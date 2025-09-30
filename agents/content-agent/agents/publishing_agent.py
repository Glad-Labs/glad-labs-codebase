import logging
import config  # Add this import

from services.wordpress_client import WordPressClient # FIX: Use absolute import
from utils.data_models import BlogPost # FIX: Use absolute import

class PublishingAgent:
    """Handles the final step of publishing the content to WordPress."""
    def __init__(self):
        logging.info("Initializing Publishing Agent...")
        self.wp_client = WordPressClient(
            url=config.WORDPRESS_URL,
            username=config.WORDPRESS_USERNAME,
            password=config.WORDPRESS_PASSWORD
        )

    def publish_post(self, post_data: BlogPost) -> BlogPost:
        """
        Publishes the given blog post data to WordPress.
        Delegates the actual publishing logic to the WordPressClient.
        """
        logging.info(f"PublishingAgent: Attempting to publish '{post_data.topic}'...")
        return self.wp_client.post_article(post_data)