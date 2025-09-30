import logging
import json
from typing import Optional, Dict, Any, List
from google.oauth2.service_account import Credentials
import vertexai
from vertexai.generative_models import GenerativeModel, Part, Candidate, HarmCategory, HarmBlockThreshold # Added HarmCategory, HarmBlockThreshold
from google.api_core.exceptions import GoogleAPIError # Added GoogleAPIError
import config
from utils.helpers import extract_json_from_string
import utils.logging_config as log_utils # FIX: Import logging_config

# Get the dedicated logger for prompts
prompts_logger = log_utils.prompts_logger # FIX: Use imported logger
logger = logging.getLogger(__name__) # Added logger definition

class LLMClient:
    """
    Handles all interactions with the Google Vertex AI for Gemini models.
    This client is explicitly configured for a specific GCP project and region
    to ensure reliable API communication.
    """
    def __init__(self, credentials: Optional[Credentials] = None):
        try:
            vertexai.init(project=config.GCP_PROJECT_ID, location=config.GCP_REGION, credentials=credentials)
            logging.info(f"Vertex AI initialized for project '{config.GCP_PROJECT_ID}' in region '{config.GCP_REGION}'.")

            self.text_model = GenerativeModel(config.GEMINI_MODEL)
            logging.info(f"Vertex AI Text Model initialized: {config.GEMINI_MODEL}")

            self.json_model = GenerativeModel(config.GEMINI_MODEL)
            logging.info(f"Vertex AI JSON Model initialized: {config.GEMINI_MODEL} (JSON output enforced in method call).")
        except Exception as e:
            logging.error(f"Failed to initialize Vertex AI LLMClient: {e}", exc_info=True)
            raise

    def generate_text_content(self, prompt: str) -> Optional[str]:
        """Generates freeform text content using the model."""
        try:
            prompts_logger.debug(f"--- START VERTEX AI PROMPT ---\n{prompt}\n--- END VERTEX AI PROMPT ---")
            logging.info("Generating text content with Vertex AI...")
            
            response = self.text_model.generate_content(prompt)
            
            return self._validate_text_response(response)

        except Exception as e:
            logging.error(f"An unexpected error occurred during text generation with Vertex AI: {e}", exc_info=True)
            return None

    def _validate_text_response(self, response) -> Optional[str]:
        """Validates the response from the text model."""
        if not response.candidates:
            logging.error("Vertex AI returned a response with no candidates.")
            return None

        first_candidate = response.candidates[0]
        
        if first_candidate.finish_reason.name != "STOP":
            logging.error(f"Vertex AI stopped generation for reason: {first_candidate.finish_reason.name}")
            if first_candidate.safety_ratings:
                for rating in first_candidate.safety_ratings:
                    logging.error(f"Safety Rating: {rating.category.name} - {rating.probability.name}")
            return None

        if not first_candidate.content.parts:
            logging.error("Vertex AI returned a candidate with no content parts.")
            return None

        response_text = first_candidate.content.parts[0].text
        logging.info("Successfully generated text content from Vertex AI.")
        return response_text

    def generate_structured_content(self, contents: List[Part]) -> Optional[Dict[str, Any]]:
        """Generates structured JSON content using the model's native JSON output mode, supporting multimodal input."""
        if not self.json_model:
            logger.error("LLMClient not initialized. Cannot generate structured content.")
            return None
        try:
            logger.info("Generating structured content with Vertex AI (JSON output enforced)...")
            
            # Log the prompt content, handling both text and multimodal parts
            prompt_log_parts = []
            for part in contents:
                if hasattr(part, 'text') and part.text:
                    prompt_log_parts.append(f"TextPart: {part.text[:200]}...") # Log snippet for brevity
                elif hasattr(part, 'inline_data') and part.inline_data:
                    prompt_log_parts.append(f"ImagePart: (mime_type={part.inline_data.mime_type}, size={len(part.inline_data.data)} bytes)")
            
            if prompt_log_parts:
                prompts_logger.debug(f"--- START VERTEX AI JSON PROMPT ---\nContents: {prompt_log_parts}\n--- END VERTEX AI JSON PROMPT ---")
            else:
                prompts_logger.debug(f"--- START VERTEX AI JSON PROMPT (EMPTY/UNEXPECTED) ---\n{contents}\n--- END VERTEX AI JSON PROMPT (EMPTY/UNEXPECTED) ---")

            response = self.json_model.generate_content(
                contents,
                generation_config={"response_mime_type": "application/json"},
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            if response.candidates and response.candidates[0].content.parts:
                json_text = None
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'text') and part.text:
                        json_text = part.text
                        break
                
                if json_text:
                    structured_content = json.loads(json_text)
                    logger.info("Successfully generated and parsed structured content from Vertex AI.")
                    return structured_content
                else:
                    logger.warning("Vertex AI structured content generation returned no text part in candidates.")
                    return None
            else:
                logger.warning("Vertex AI structured content generation returned no candidates or content parts.")
                return None
        except GoogleAPIError as e:
            logger.error(f"An unexpected error occurred during structured content generation with Vertex AI: {e}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from Vertex AI structured content response: {e}. Raw response: {response.candidates[0].content.parts[0].text if response.candidates and response.candidates[0].content.parts else 'No text part in response'}")
            return None
        except Exception as e:
            logger.error(f"An unexpected error occurred during structured content generation: {e}")
            return None
