import logging
import gspread
import re # Add this import
from gspread.exceptions import SpreadsheetNotFound, WorksheetNotFound
from google.oauth2.service_account import Credentials # Keep for potential service account flow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials as UserCredentials # Alias for clarity
from google_auth_oauthlib.flow import InstalledAppFlow
import os
from typing import List, Dict, Any, Optional
import config
from datetime import datetime
import gspread.utils

class GoogleSheetsClient:
    """
    Manages all interactions with Google Sheets for fetching tasks from the
    'Content Plan' and writing results to the 'Generated Content Log'.
    Handles authentication, reading, and writing data.
    """
    # Defines the permissions the application will request from the user.
    SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/cloud-platform' # ADD THIS LINE
    ]

    def __init__(self):
        try:
            # Authenticate and initialize the Google Sheets client
            self.creds = self._authenticate()
            self.client = gspread.authorize(self.creds)

            # Open the spreadsheet and initialize worksheets
            self.spreadsheet = self.client.open_by_key(config.SPREADSHEET_ID)
            self.plan_sheet = self.spreadsheet.worksheet(config.PLAN_SHEET_NAME)
            self.log_sheet = self.spreadsheet.worksheet(config.LOG_SHEET_NAME)
            
            # FIX: Implement robust, self-healing header logic for the log sheet.
            self._ensure_log_sheet_headers()

        except gspread.exceptions.SpreadsheetNotFound:
            logging.critical(f"Spreadsheet with ID '{config.SPREADSHEET_ID}' not found.")
            raise
        except gspread.exceptions.WorksheetNotFound as e:
            logging.error(f"Worksheet not found: {e}")
            raise
        except Exception as e:
            logging.critical(f"An unexpected error occurred during Google Sheets client initialization: {e}", exc_info=True)
            self.spreadsheet = None
            self.creds = None

    def _authenticate(self) -> Optional[UserCredentials]:
        """
        Handles the OAuth 2.0 user consent flow.
        If a valid token.json exists, it's used. Otherwise, it initiates
        a browser-based login to create/refresh the token.
        """
        creds = None
        token_path = config.TOKEN_PATH # Use config.TOKEN_PATH for consistency
        
        if os.path.exists(token_path):
            creds = UserCredentials.from_authorized_user_file(token_path, self.SCOPES)
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    creds.refresh(Request())
                except Exception as e:
                    logging.warning(f"Could not refresh token: {e}. Re-authentication is required.")
                    creds = None
            
            if not creds:
                try:
                    flow = InstalledAppFlow.from_client_secrets_file(
                        config.CREDENTIALS_PATH, self.SCOPES
                    )
                    creds = flow.run_local_server(port=0, prompt='select_account')
                except FileNotFoundError:
                    logging.error(f"OAuth credentials file not found at: {config.CREDENTIALS_PATH}")
                    logging.error("Please create an an 'OAuth 2.0 Client ID' for a 'Desktop App' in Google Cloud Console and save it as credentials.json.")
                    raise
                except Exception as e:
                    logging.error(f"An error occurred during the OAuth flow: {e}")
                    raise

            with open(token_path, 'w') as token:
                token.write(creds.to_json())
            logging.info("Authentication successful, token.json saved.")
            
        return creds

    def _ensure_log_sheet_headers(self):
        """Checks if the log sheet has all required headers and adds any that are missing."""
        try:
            current_headers = self.log_sheet.row_values(1)
            required_headers = config.LOG_SHEET_HEADERS

            if not current_headers:
                # Sheet is empty, write all headers
                self.log_sheet.append_row(required_headers, value_input_option='USER_ENTERED')
                logging.info(f"Initialized log sheet with headers: {required_headers}")
            else:
                # Sheet has headers, check for missing ones
                current_headers_lower = [h.strip().lower() for h in current_headers]
                missing_headers = [h for h in required_headers if h.lower() not in current_headers_lower]
                
                if missing_headers:
                    logging.warning(f"Log sheet is missing headers: {missing_headers}. Appending them now.")
                    # This appends the missing headers to the end of the first row.
                    self.log_sheet.update(
                        f'{gspread.utils.rowcol_to_a1(1, len(current_headers) + 1)}', 
                        [missing_headers]
                    )
            
            # The source of truth for header order is now the sheet itself, read after potential updates.
            self.log_sheet_headers = [h.strip().lower() for h in self.log_sheet.row_values(1)]
            logging.info(f"Log sheet headers loaded: {self.log_sheet_headers}")
        except Exception as e:
            logging.error(f"Failed to ensure log sheet headers: {e}", exc_info=True)
            # Fallback to config headers if sheet is unreadable
            self.log_sheet_headers = [h.lower() for h in config.LOG_SHEET_HEADERS]

    def get_new_content_requests(self) -> List[Dict[str, Any]]: # FIX: Renamed method
        """
        Fetches rows from the 'Content Plan' sheet that are marked with the status 'POST'.
        This method is hardened to read column headers dynamically, so it is not
        dependent on a fixed column order.
        """
        try:
            records = self.plan_sheet.get_all_records()
            
            if not records:
                logging.info("Content Plan sheet is empty or has no data rows.")
                return []

            header = [h.strip().lower() for h in records[0].keys()]
            
            # FIX: Add validation to ensure required columns exist before proceeding.
            required_columns = ['status', 'topic']
            if not all(col in header for col in required_columns):
                missing = [col for col in required_columns if col not in header]
                logging.error(f"Content Plan sheet is missing required columns: {missing}. Please add them and try again.")
                return []

            tasks = []
            for i, row in enumerate(records):
                # FIX: Normalize the dictionary keys to be lowercase and stripped of whitespace
                # to make parsing resilient to header capitalization in the Google Sheet.
                normalized_row = {key.strip().lower(): value for key, value in row.items()}

                if normalized_row.get('status', '').strip().upper() == 'POST':
                    task_data = {
                        'topic': normalized_row.get('topic', ''),
                        'primary_keyword': normalized_row.get('primary keyword', ''),
                        'target_audience': normalized_row.get('target audience', ''),
                        'category': normalized_row.get('category', 'Uncategorized'),
                        'secondary_keywords': [item.strip() for item in normalized_row.get('secondary keywords', '').split(',') if item.strip()],
                        'internal_links': [item.strip() for item in normalized_row.get('internal links', '').split(',') if item.strip()]
                    }
                    
                    tasks.append({'sheet_row_index': i + 2, **task_data})
            return tasks
        except Exception as err:
            logging.error(f"An error occurred fetching new tasks from the sheet: {err}")
            return []

    def get_published_posts_map(self) -> Dict[str, str]:
        """
        Retrieves a map of published post titles to their WordPress URLs from the log sheet.
        """
        try:
            records = self.log_sheet.get_all_records()
            
            if not records:
                logging.info("Log sheet has no header or data rows for internal linking.")
                return {}

            # This validation is still useful to ensure the sheet is structured correctly.
            header = [h.strip().lower() for h in records[0].keys()]
            required_columns = ['generated title', 'status']
            if not all(col in header for col in required_columns):
                missing = [col for col in required_columns if col not in header]
                logging.error(f"Log sheet is missing required columns: {missing}. Please add them.")
                return {}

            published_posts = {}
            for row in records:
                # FIX: Normalize the dictionary keys here as well for the same reason.
                normalized_row = {key.strip().lower(): value for key, value in row.items()}

                if "published" in normalized_row.get('status', '').strip().lower(): # More flexible check
                    title = normalized_row.get('generated title')
                    url = normalized_row.get('strapi url') # FIX: Changed from 'wordpress url'
                    if title and url:
                        published_posts[title] = url
            
            logging.info(f"Found {len(published_posts)} published posts for internal linking.")
            return published_posts
        except Exception as e:
            logging.error(f"Failed to get published posts map from sheet: {e}", exc_info=True)
            return {}

    def log_generated_post(self, post_data: Dict[str, Any]) -> int:
        """
        Logs post details to the sheet. If a row index is in post_data, it updates that row.
        Otherwise, it finds or appends a new row. Returns the index of the affected row.
        """
        try:
            sheet = self.log_sheet
            
            post_data['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Use .get() for safety, as log_sheet_row_index might not be present
            row_to_update = post_data.get('log_sheet_row_index') 

            row_values_in_order = []
            for header in self.log_sheet_headers:
                normalized_header_key = header.strip().lower().replace(' ', '_')
                value = post_data.get(header, post_data.get(normalized_header_key, ''))
                
                # FIX: Exclude or truncate large content fields for Google Sheets
                if header.lower() == 'raw_content' or header.lower() == 'edited_content':
                    value = "Content too large for cell (see WordPress)" # Or truncate: value[:49000] + "..."
                elif header.lower() == 'rejection_reason' and len(str(value)) > 1000:
                    value = str(value)[:997] + "..." # Truncate long rejection reasons
                
                row_values_in_order.append(str(value))

            if row_to_update:
                logging.info(f"Updating existing log entry in row {row_to_update}.")
                sheet.update(f'A{row_to_update}', [row_values_in_order])
                return row_to_update
            else:
                topic = post_data.get('topic', 'Unknown Topic')
                logging.info(f"Appending new log entry for '{topic}'.")
                new_row_data = sheet.append_row(row_values_in_order, value_input_option='USER_ENTERED')
                
                if hasattr(new_row_data, 'row'):
                    return new_row_data.row
                elif isinstance(new_row_data, dict) and 'updates' in new_row_data:
                    try:
                        updated_range = new_row_data['updates']['updatedRange']
                        # Parse row number from a range like "'Sheet Name'!A51:G51"
                        match = re.search(r'[A-Z]+(\d+)', updated_range)
                        if match:
                            row_number = int(match.group(1))
                            logging.info(f"Extracted new row index {row_number} from API response.")
                            return row_number
                        else:
                            logging.error(f"Could not parse row number from updatedRange: {updated_range}")
                            return -1
                    except (KeyError, TypeError) as e:
                        logging.error(f"Error parsing gspread dictionary response: {e}. Response: {new_row_data}")
                        return -1
                else:
                    logging.error(f"gspread.append_row returned an unexpected response type: {new_row_data}")
                    return -1

        except Exception as e:
            logging.error(f"Failed to log generated post to Google Sheet: {e}", exc_info=True)
            return -1 # Return an invalid index on failure

    def update_status_by_row(self, row_index: int, status: str, url: Optional[str] = None): # FIX: Added optional URL parameter
        """More robustly updates the status of a topic using its direct row index."""
        try:
            header_row = self.plan_sheet.row_values(1)
            # FIX: Normalize the header row to find the index reliably and case-insensitively.
            normalized_header = [h.strip().lower() for h in header_row]
            
            updates = []
            status_col_index = -1
            url_col_index = -1

            if 'status' in normalized_header:
                status_col_index = normalized_header.index('status') + 1
                updates.append({'col': status_col_index, 'val': status})
            else:
                logging.error("Could not find 'status' column in the Content Plan sheet to update.")
                return

            # If a URL is provided, find the 'Strapi URL' column and update it too
            if url and 'strapi url' in normalized_header:
                url_col_index = normalized_header.index('strapi url') + 1
                updates.append({'col': url_col_index, 'val': url})

            # Perform batch update
            cells_to_update = []
            for update in updates:
                cells_to_update.append(gspread.Cell(row=row_index, col=update['col'], value=update['val']))
            
            if cells_to_update:
                self.plan_sheet.update_cells(cells_to_update)
                logging.info(f"Updated row {row_index} with status '{status}'" + (f" and URL." if url else "."))

        except Exception as e:
            logging.error(f"Failed to update status for row {row_index}: {e}", exc_info=True)

    def update_topic_status(self, topic: str, status: str):
        """Updates the status of a topic in the 'Content Plan' sheet."""
        try:
            # FIX: Normalize header_row for robust column finding.
            header_row = [h.strip().lower() for h in self.plan_sheet.row_values(1)]
            if 'topic' not in header_row or 'status' not in header_row:
                logging.error("Could not find 'topic' or 'status' columns in the Content Plan sheet.")
                return

            topic_col_index = header_row.index('topic') + 1
            status_col_index = header_row.index('status') + 1
            
            # Find the cell containing the topic name in the correct column.
            cell = self.plan_sheet.find(topic, in_column=topic_col_index)
            if cell:
                # Update the status in the 'status' column for that specific row.
                self.plan_sheet.update_cell(cell.row, status_col_index, status)
                logging.info(f"Updated topic '{topic}' status to '{status}' in row {cell.row}.")
            else:
                logging.warning(f"Topic '{topic}' not found in the sheet.")
        except Exception as e:
            logging.error(f"Failed to update topic status: {e}", exc_info=True)