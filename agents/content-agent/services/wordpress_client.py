import logging
import time
import requests
import base64
import re
import os
from typing import Dict, Optional, List
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from requests.exceptions import RequestException

import config
from utils.helpers import slugify
from utils.data_models import BlogPost, ImagePathDetails, ImageDetails

class WordPressPublishingError(Exception):
    """Custom exception for specific errors during the WordPress publishing process."""
    pass

class WordPressClient:
    """
    Manages all interactions with the WordPress REST API, including authentication,
    content posting, and media uploads.
    """
    def __init__(self, url, username, password):
        self.base_url = f"{url.rstrip('/')}/wp-json/wp/v2"
        self.username = username
        self.password = password
        
        credentials = f"{self.username}:{self.password}"
        token = base64.b64encode(credentials.encode())
        self.headers = {'Authorization': f'Basic {token.decode("utf-8")}'}
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)

        self.category_id_cache = {}
        self.tag_id_cache = {}

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(RequestException)
    )
    def _get_or_create_term_id(self, name: str, taxonomy: str) -> Optional[int]:
        """
        Retrieves the ID for a given term name and taxonomy. If the term does not exist,
        it is created automatically. Results are cached to reduce API calls.
        """
        cache = self.category_id_cache if taxonomy == 'categories' else self.tag_id_cache
        if name in cache:
            return cache[name]
        try:
            res = self.session.get(f"{self.base_url}/{taxonomy}", params={'search': name})
            res.raise_for_status()
            data = res.json()
            if data:
                term_id = data[0]['id']
                cache[name] = term_id
                return term_id
            else:
                logging.info(f"{taxonomy.capitalize()} '{name}' not found, creating it...")
                slug = slugify(name)
                create_res = self.session.post(f"{self.base_url}/{taxonomy}", json={'name': name, 'slug': slug})
                create_res.raise_for_status()
                new_term = create_res.json()
                term_id = new_term['id']
                cache[name] = term_id
                return term_id
        except requests.RequestException as e:
            logging.error(f"Failed to get or create {taxonomy} '{name}': {e}")
            return None

    def _create_draft_post(self, post_data: BlogPost) -> int:
        """Creates a new post in WordPress with a 'draft' status."""
        category_id = self._get_or_create_term_id(post_data.category, 'categories')
        tag_ids = [self._get_or_create_term_id(tag, 'tags') for tag in post_data.tags]
        
        post_payload = {
            'title': post_data.generated_title,
            'content': "<!-- Post content is being generated and will be populated shortly. -->",
            'status': 'draft',
            'tags': tag_ids,
            'categories': [category_id] if category_id else [],
            'meta': {
                'description': post_data.meta_description,
                'robots': 'noindex, nofollow'
            }
        }
        
        res = self.session.post(f"{self.base_url}/posts", json=post_payload)
        res.raise_for_status()
        post_id = res.json()['id']
        logging.info(f"Created draft post with ID: {post_id}")
        return post_id

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=4, max=30),
        retry=retry_if_exception_type(RequestException)
    )
    def _upload_image(self, image_path_detail: ImagePathDetails, image_metadata: ImageDetails) -> Optional[Dict]:
        """Uploads a single image and returns its full media details dictionary from WordPress."""
        try:
            with open(image_path_detail.local_path, 'rb') as f:
                image_data = f.read()
            
            files = {'file': (image_path_detail.upload_filename, image_data)}
            
            # Use the directly passed image_metadata
            payload = {
                'title': image_metadata.caption,
                'alt_text': image_metadata.alt_text,
                'caption': image_metadata.caption,
                'description': image_metadata.description,
            }

            logging.info(f"Uploading image '{image_path_detail.upload_filename}' to WordPress...")
            res = self.session.post(f"{self.base_url}/media", headers={'Content-Disposition': f'attachment; filename={image_path_detail.upload_filename}'}, files=files, data=payload)
            res.raise_for_status()
            media_details = res.json()
            logging.info(f"Successfully uploaded image, Media ID: {media_details['id']}")
            return media_details
        except FileNotFoundError:
            logging.error(f"Image file not found at path: {image_path_detail.local_path}")
            return None
        except Exception as e:
            logging.error(f"Failed to upload image {image_path_detail.local_path}: {e}", exc_info=True)
            return None

    def _update_and_publish_post(self, post_id: int, content: str, featured_media_id: Optional[int]):
        """Updates a post with its final content and sets its status to 'draft'."""
        publish_payload = {
            'content': content,
            'status': 'publish'
        }
        if featured_media_id:
            publish_payload['featured_media'] = featured_media_id
        
        logging.info(f"Updating post ID: {post_id} with final content and saving as draft...")
        res = self.session.post(f"{self.base_url}/posts/{post_id}", json=publish_payload)
        res.raise_for_status()
        
        response_data = res.json()
        logging.info(f"Successfully saved post as draft: {response_data.get('link')}")
        return response_data

    def _upload_and_embed_images(self, post_data: BlogPost) -> tuple[str, Optional[int]]:
        """Handles the logic for uploading all images and embedding them in the post content."""
        final_html_content = str(post_data.edited_content)
        featured_image_id = None

        if not post_data.image_path_details or not post_data.images:
            return final_html_content, featured_image_id

        logging.info(f"Uploading {len(post_data.image_path_details)} images to WordPress...")
        
        uploaded_media_details = []
        # Iterate through both lists simultaneously, assuming they are aligned by the creative agent
        for i, image_path_detail in enumerate(post_data.image_path_details):
            if i < len(post_data.images): # Ensure there's corresponding metadata
                image_metadata = post_data.images[i]
                media_details = self._upload_image(image_path_detail, image_metadata) # Pass metadata
                if media_details:
                    uploaded_media_details.append((media_details, i)) # Store media details and original index
            else:
                logging.warning(f"No corresponding metadata found for image path: {image_path_detail.local_path}. Skipping upload.")
        
        if not uploaded_media_details:
            logging.warning("No images were successfully uploaded. Cannot set featured image.")
            return final_html_content, featured_image_id

        # Set the first successfully uploaded image as featured
        featured_image_id = uploaded_media_details[0][0]['id'] 

        for media_details, original_index in uploaded_media_details:
            placeholder = f"<!-- image_placeholder_{original_index} -->"
            
            original_metadata = post_data.images[original_index] # Retrieve metadata using original index
            
            try:
                media_url = media_details['media_details']['sizes']['large']['source_url']
            except KeyError:
                media_url = media_details['source_url']

            image_figure = (
                f'<figure class="wp-block-image size-large"><img src="{media_url}" alt="{original_metadata.alt_text}"/>'
                f'<figcaption class="wp-element-caption">{original_metadata.caption}</figcaption></figure>'
            )
            final_html_content = final_html_content.replace(placeholder, image_figure)
            logging.info(f"Image {original_index+1} uploaded and embedded successfully (Media ID: {media_details['id']}).")
        
        return final_html_content, featured_image_id

    def post_article(self, post_data: BlogPost) -> BlogPost:
        """
        Executes the full publishing workflow: create draft, upload images, and publish.
        """
        try:
            post_data.wordpress_post_id = self._create_draft_post(post_data)
            
            final_html_content, featured_image_id = self._upload_and_embed_images(post_data)

            final_post_data = self._update_and_publish_post(post_data.wordpress_post_id, final_html_content, featured_image_id)
            
            if final_post_data and 'link' in final_post_data:
                post_data.wordpress_url = final_post_data['link']

            return post_data

        except requests.RequestException as e:
            logging.error(f"A REST API error occurred with WordPress: {e.response.text if e.response else e}")
            raise WordPressPublishingError(f"REST API Error: {e}") from e
        except Exception as e:
            logging.error(f"An unexpected error occurred during WordPress publishing: {e}", exc_info=True)
            raise WordPressPublishingError(f"Unexpected Error: {e}") from e
