import logging
import requests
from typing import Optional
import config

class PexelsClient:
    def __init__(self):
        self.api_key = config.PEXELS_API_KEY
        if not self.api_key:
            logging.warning("Pexels API key not found. Stock photo functionality will be disabled.")
            self.is_enabled = False # FIX: Add an enabled flag
            self.headers = None
        else:
            self.is_enabled = True # FIX: Set enabled flag
            self.headers = {'Authorization': self.api_key}
        self.search_url = "https://api.pexels.com/v1/search"
        self.session = requests.Session()

    def search_and_download_photo(self, query: str) -> Optional[bytes]:
        if not self.is_enabled: # FIX: Check enabled flag
            logging.warning("Pexels client is disabled due to missing API key.")
            return None
        
        params = {'query': query, 'per_page': 1, 'orientation': 'landscape'}
        try:
            logging.info(f"Searching Pexels for: '{query}'")
            response = self.session.get(self.search_url, headers=self.headers, params=params, timeout=15)
            response.raise_for_status()
            
            data = response.json()
            if data['photos']:
                photo = data['photos'][0]
                image_url = photo['src']['large'] # Download a reasonably sized image
                
                logging.info(f"Downloading image from URL: {image_url}")
                image_response = self.session.get(image_url, timeout=15)
                image_response.raise_for_status()
                return image_response.content
            else:
                logging.warning(f"No Pexels results found for query: '{query}'")
                return None
        except requests.RequestException as e:
            logging.error(f"Error fetching image from Pexels for query '{query}': {e}")
            return None