import requests
import logging
import config
from typing import Tuple
from utils.data_models import BlogPost

class StrapiPublishingError(Exception):
    """Custom exception for Strapi publishing failures."""
    pass

class StrapiClient:
    """
    Client for interacting with the Strapi Headless CMS API.
    """
    def __init__(self):
        self.api_url = config.STRAPI_API_URL
        self.api_token = config.STRAPI_API_TOKEN
        if not self.api_url or not self.api_token:
            raise ValueError("STRAPI_API_URL and STRAPI_API_TOKEN must be set in environment variables.")
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def publish_post(self, post: BlogPost) -> Tuple[int, str]:
        """
        Publishes a blog post to Strapi.
        """
        endpoint = f"{self.api_url}/api/articles"
        
        # Map BlogPost data to Strapi content type schema
        # This assumes your Strapi 'article' content type has these field names
        data = {
            "data": {
                "title": post.generated_title,
                "content": post.edited_content,
                "slug": post.slug,
                "meta_description": post.meta_description,
                "tags": ", ".join(post.tags),
                "publishedAt": post.timestamp, # Or use None to save as draft
            }
        }

        try:
            logging.info(f"Publishing post '{post.generated_title}' to Strapi.")
            response = self.session.post(endpoint, json=data)
            response.raise_for_status()
            
            response_data = response.json()
            post_id = response_data['data']['id']
            # Construct a placeholder URL, as Strapi API doesn't return the frontend URL
            post_url = f"https://your-frontend-url.com/blog/{post.slug}" 
            
            logging.info(f"Successfully published to Strapi. Post ID: {post_id}")
            return post_id, post_url

        except requests.exceptions.RequestException as e:
            # FIX: Check if response exists before trying to access it
            error_text = e.response.text if e.response else str(e)
            logging.error(f"Error publishing to Strapi: {error_text}", exc_info=True)
            raise StrapiPublishingError(f"Failed to connect to Strapi API: {error_text}")
        except KeyError as e:
            logging.error(f"Unexpected response format from Strapi.", exc_info=True)
            raise StrapiPublishingError(f"Unexpected response from Strapi, missing key: {e}")
