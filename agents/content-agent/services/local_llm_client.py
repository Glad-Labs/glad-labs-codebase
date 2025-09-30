import logging
import json
import re
from typing import Optional, Dict, Any
import openai
from tenacity import retry, stop_after_attempt, wait_exponential
import config
import utils.logging_config as log_utils # FIX: Import logging_config

# Get the dedicated logger for prompts
prompt_logger = log_utils.prompts_logger # FIX: Use imported logger

class LocalLLMClient:
    """
    Handles interactions with a local LLM served by Ollama.
    This client uses the OpenAI library to connect to Ollama's OpenAI-compatible API endpoint.
    """
    def __init__(self):
        try:
            # Point the OpenAI client to the local Ollama server
            self.client = openai.OpenAI(
                base_url="http://localhost:11434/v1",
                api_key="ollama"  # The API key can be any non-empty string
            )
            self.client.timeout = 300.0
            logging.info("LocalLLMClient initialized, connected to Ollama server.")
        except Exception as e:
            logging.error(f"Failed to initialize Ollama client: {e}", exc_info=True)
            self.client = None

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def generate_structured_content(self, prompt: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            logging.error("Ollama client not available.")
            return None
        
        try:
            self._log_prompt(prompt)
            logging.info("Generating structured content with local LLM via Ollama...")
            
            messages = [{"role": "user", "content": prompt}]
            
            response = self.client.chat.completions.create(
                model=config.LOCAL_LLM_MODEL,
                messages=messages,
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            
            return self._parse_json_response(response)

        except Exception as e:
            logging.error(f"An unexpected error occurred in LocalLLMClient: {e}", exc_info=True)
            raise e

    def _log_prompt(self, prompt: str):
        """Logs the prompt."""
        prompt_logger.debug(f"--- START LOCAL LLM PROMPT ---\n{prompt}\n--- END LOCAL LLM PROMPT ---")

    def _parse_json_response(self, response) -> Optional[Dict[str, Any]]:
        """Parses the JSON response from the LLM."""
        response_content = response.choices[0].message.content
        logging.debug(f"Raw Ollama response content: {response_content}")
        
        try:
            parsed_response = json.loads(response_content)
            logging.info("Successfully parsed structured content from local LLM.")
            return parsed_response
        except json.JSONDecodeError as e:
            logging.error(f"JSON parsing failed for local LLM: {e}")
            logging.error(f"Raw local LLM response that caused the error:\n{response_content}")
            return None
