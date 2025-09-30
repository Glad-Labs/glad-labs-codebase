import logging
from google.cloud import storage
import config

class GCSClient:
    """Client for interacting with Google Cloud Storage."""

    def __init__(self):
        try:
            self.client = storage.Client(project=config.GCP_PROJECT_ID)
            self.bucket_name = config.GCS_BUCKET_NAME
            if not self.bucket_name:
                raise ValueError("GCS_BUCKET_NAME environment variable not set.")
            self.bucket = self.client.bucket(self.bucket_name)
            logging.info(f"GCS client initialized for bucket '{self.bucket_name}'.")
        except Exception as e:
            logging.error(f"Failed to initialize GCS client: {e}", exc_info=True)
            self.client = None
            self.bucket = None

    def upload_file(self, source_file_name: str, destination_blob_name: str) -> str:
        """
        Uploads a file to the GCS bucket and returns its public URL.
        """
        if not self.bucket:
            raise ConnectionError("GCS bucket is not initialized.")

        blob = self.bucket.blob(destination_blob_name)
        
        logging.info(f"Uploading {source_file_name} to gs://{self.bucket_name}/{destination_blob_name}")
        blob.upload_from_filename(source_file_name)
        
        # Make the blob publicly viewable
        blob.make_public()
        
        return blob.public_url