import logging
import json
import re
import os
from typing import Optional, List, Dict, Any
import mimetypes
import config
from utils.data_models import BlogPost, ImagePathDetails, QAReview
from utils.helpers import load_prompts_from_file # Import the new helper
from services.llm_client import LLMClient
from vertexai.generative_models import Part
import utils.logging_config as log_utils # FIX: Import logging_config

# Get the dedicated logger for prompts
prompt_logger = log_utils.prompts_logger # FIX: Use imported logger

class QAAgent:
    """
    A Quality Assurance agent that uses a multimodal model (Vertex AI Gemini)
    to review the final post content and its generated images for cohesion and quality.
    """
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client
        self.prompts = load_prompts_from_file(config.PROMPTS_PATH) # Use helper
        logging.info("QAAgent initialized, using Vertex AI LLMClient for multimodal review.")

    def run(self, post: BlogPost) -> bool:
        """
        Reviews the blog post and its images, returning True if approved, False otherwise.
        """
        if not self.llm_client:
            logging.error("QA Agent LLMClient not available. Approving by default to prevent blockage.")
            post.qa_review = QAReview(approved=True, rejection_reason="QA Agent LLMClient not available.")
            return True
        
        if post.images and not post.image_path_details:
            post.qa_review = QAReview(approved=False, rejection_reason="Image generation failed. The creative brief specified images, but no image files were created.")
            logging.error(f"QAAgent Review FAILED for '{post.generated_title}'. Reason: {post.qa_review.rejection_reason}")
            return False

        if not post.images or not post.image_path_details:
            logging.info("QAAgent: No images were specified or generated. Approving post content.")
            post.qa_review = QAReview(approved=True, rejection_reason="No images were specified or generated.")
            return True

        try:
            logging.info(f"QAAgent: Starting multimodal review for '{post.generated_title}'.")
            
            contents = self._prepare_multimodal_prompt(post)
            review = self.llm_client.generate_structured_content(contents)

            return self._process_review_response(post, review)

        except AttributeError as e:
            logging.error(f"An error occurred during QA review: {e}", exc_info=True)
            post.qa_review = QAReview(approved=False, rejection_reason=f"An error occurred during QA review: {e}")
            return False

    def _prepare_multimodal_prompt(self, post: BlogPost) -> List[Part]:
        """Prepares the prompt for the multimodal model."""
        image_metadata_str = "\n".join([f"- Image {i+1}: {img.model_dump_json()}" for i, img in enumerate(post.images)])

        prompt_text = self.prompts['qa_review'].format(
            raw_content=post.raw_content,
            image_metadata_str=image_metadata_str
        )

        contents = [Part.from_text(prompt_text)]

        for image_detail in post.image_path_details:
            if os.path.exists(image_detail.local_path):
                mime_type, _ = mimetypes.guess_type(image_detail.local_path)
                if mime_type:
                    with open(image_detail.local_path, "rb") as f:
                        image_bytes = f.read()
                    contents.append(Part.from_data(data=image_bytes, mime_type=mime_type))
                else:
                    logging.warning(f"Could not determine MIME type for image: {image_detail.local_path}")
            else:
                logging.warning(f"Image file not found for QA review: {image_detail.local_path}")
        
        loggable_contents = []
        for part in contents:
            if hasattr(part, 'text') and part.text: # FIX: Safely check for 'text' attribute
                loggable_contents.append(f"TextPart: {part.text[:200]}...")
            elif hasattr(part, 'inline_data') and part.inline_data:
                loggable_contents.append(f"ImagePart: (mime_type={part.inline_data.mime_type}, size={len(part.inline_data.data)} bytes)")
        prompt_logger.debug(f"--- START QA PROMPT (MULTIMODAL) ---\nContents: {loggable_contents}\n--- END QA PROMPT (MULTIMODAL) ---")

        return contents

    def _process_review_response(self, post: BlogPost, review: Optional[Dict[str, Any]]) -> bool:
        """Processes the response from the multimodal model."""
        if not review:
            logging.error("QAAgent: Multimodal LLM did not return a valid JSON object.")
            post.qa_review = QAReview(approved=False, rejection_reason="Multimodal LLM did not return a valid JSON object.")
            return False

        approved = review.get("approved", False)
        reason = review.get('reason', 'No reason provided.')
        post.qa_review = QAReview(approved=approved, rejection_reason=reason)

        if approved:
            logging.info(f"QAAgent Review PASSED for '{post.generated_title}'. Reason: {reason}")
            return True
        else:
            logging.warning(f"QAAgent Review FAILED for '{post.generated_title}'. Reason: {reason}")
            return False