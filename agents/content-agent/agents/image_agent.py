import logging
import os
from typing import List, Optional

import config
from services.image_gen_client import ImageGenClient
from services.pexels_client import PexelsClient
from services.gcs_client import GCSClient  # NEW
from utils.data_models import BlogPost, ImageDetails, ImagePathDetails
from utils.helpers import slugify


class ImageAgent:
    """
    Generates and/or fetches images for a blog post and uploads them to GCS.
    """

    def __init__(self):
        logging.info("Initializing Image Agent...")
        self.image_gen_client = ImageGenClient()
        self.pexels_client = PexelsClient()
        self.gcs_client = GCSClient()  # NEW

    def run(self, post: BlogPost) -> BlogPost:
        logging.info(f"ImageAgent: Processing images for '{post.generated_title}'.")

        if not post.images:
            logging.warning("No image metadata found in post. Skipping image processing.")
            return post

        generated_image_details: List[ImagePathDetails] = []
        for i, image_details in enumerate(post.images):
            path_details = self._process_image(post.generated_title, i, image_details)
            if path_details:
                generated_image_details.append(path_details)

        post.image_path_details = generated_image_details

        # Upload images and store their public URLs
        for i, img_path_detail in enumerate(post.image_path_details):
            try:
                public_url = self.gcs_client.upload_file(
                    source_file_name=img_path_detail.local_path,
                    destination_blob_name=img_path_detail.upload_filename,
                )
                # Store the public URL back in the corresponding ImageDetails object
                if i < len(post.images):
                    post.images[i].public_url = public_url
                logging.info(f"Uploaded {img_path_detail.local_path} to {public_url}")
            except Exception as e:
                logging.error(f"Failed to upload {img_path_detail.local_path} to GCS: {e}", exc_info=True)
        
        logging.info("Finished processing images and storing public URLs.")
        return post

    def _process_image(self, title: str, index: int, image_details: ImageDetails) -> Optional[ImagePathDetails]:
        """Processes a single image, either by generating it or fetching it from Pexels."""
        path_details = self._get_image_path_details(title, index)

        if image_details.source == "ai":
            logging.info(f"Generating AI image with prompt: {image_details.query}")
            success = self._generate_ai_image(image_details.query, path_details.local_path)
        else:
            logging.info(f"Fetching Pexels image with query: {image_details.query}")
            success = self._fetch_pexels_image(image_details.query, path_details.local_path)

        if success:
            logging.info(f"Successfully processed image and saved to {path_details.local_path}")
            return path_details
        else:
            logging.error(f"Failed to process image for query '{image_details.query}'")
            return None

    def _get_image_path_details(self, title: str, index: int) -> ImagePathDetails:
        """Constructs the filename and path for an image."""
        base_filename = f"{slugify(title)}-img-{index+1}"
        output_dir = config.IMAGE_STORAGE_PATH
        os.makedirs(output_dir, exist_ok=True)
        local_image_path = os.path.join(output_dir, f"{base_filename}.png")
        upload_filename = f"{base_filename}.png"
        return ImagePathDetails(local_path=local_image_path, upload_filename=upload_filename)

    def _generate_ai_image(self, query: str, local_path: str) -> bool:
        """Generates an AI image and saves it to the specified path."""
        try:
            self.image_gen_client.generate_images(query, local_path)
            return True
        except Exception as e:
            logging.error(f"Failed to generate AI image for query '{query}': {e}", exc_info=True)
            return False

    def _fetch_pexels_image(self, query: str, local_path: str) -> bool:
        """Fetches an image from Pexels and saves it to the specified path."""
        try:
            image_content = self.pexels_client.search_and_download_photo(query)
            if image_content:
                with open(local_path, 'wb') as f:
                    f.write(image_content)
                return True
            return False
        except Exception as e:
            logging.error(f"Failed to fetch Pexels image for query '{query}': {e}", exc_info=True)
            return False
