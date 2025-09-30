import os
import logging
from google.cloud import firestore
import config

class FirestoreClient:
    """
    Client for interacting with Google Cloud Firestore to log real-time agent status.
    """
    def __init__(self):
        try:
            # This will use the Application Default Credentials in a Cloud Run environment
            self.db = firestore.Client(project=config.GCP_PROJECT_ID)
            self.collection_name = os.getenv("FIRESTORE_COLLECTION", "agent_runs")
            logging.info("Firestore client initialized successfully.")
        except Exception as e:
            logging.error(f"Failed to initialize Firestore client: {e}", exc_info=True)
            self.db = None

    def update_document(self, document_id: str, data: dict):
        """
        Creates or updates a document in the 'agent_runs' collection.
        """
        if not self.db:
            logging.warning("Firestore client not available. Skipping update.")
            return
        try:
            doc_ref = self.db.collection(self.collection_name).document(document_id)
            # Use set with merge=True to create or update fields without overwriting the whole doc
            doc_ref.set(data, merge=True)
            logging.debug(f"Updated Firestore document '{document_id}' in collection '{self.collection_name}'.")
        except Exception as e:
            logging.error(f"Failed to update Firestore document '{document_id}': {e}", exc_info=True)
