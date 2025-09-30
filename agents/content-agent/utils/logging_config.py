import logging
from logging.handlers import RotatingFileHandler
import os
import shutil
import config
from datetime import datetime

# Define prompts_logger globally in this module
prompts_logger = logging.getLogger('prompts') # FIX: Define here

def setup_logging():
    # Ensure log directory exists (it's BASE_DIR, so it should exist)
    if not os.path.exists(config.LOG_DIR):
        os.makedirs(config.LOG_DIR)

    # Ensure archive directory exists
    if not os.path.exists(config.ARCHIVE_DIR):
        os.makedirs(config.ARCHIVE_DIR)

    # --- Setup main application logger ---
    app_logger = logging.getLogger()
    app_logger.setLevel(logging.INFO)

    # Clear existing handlers to prevent duplicate logs on re-runs (e.g., in development)
    if app_logger.handlers:
        for handler in app_logger.handlers[:]:
            app_logger.removeHandler(handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    app_logger.addHandler(console_handler)

    # File handler for app.log (current run)
    app_log_path = os.path.join(config.LOG_DIR, 'app.log')
    app_file_handler = RotatingFileHandler(
        app_log_path,
        maxBytes=config.MAX_LOG_SIZE_MB * 1024 * 1024,
        backupCount=config.MAX_LOG_BACKUP_COUNT
    )
    app_file_handler.setLevel(logging.INFO)
    app_file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')
    app_file_handler.setFormatter(app_file_formatter)
    app_logger.addHandler(app_file_handler)

    # --- Setup prompts logger ---
    # prompts_logger = logging.getLogger('prompts') # REMOVE: Defined globally above
    prompts_logger.setLevel(logging.DEBUG)
    prompts_logger.propagate = False # Prevent prompts from also going to app_logger

    # Clear existing handlers for prompts_logger
    if prompts_logger.handlers:
        for handler in prompts_logger.handlers[:]:
            prompts_logger.removeHandler(handler)

    # File handler for prompts.log (current run)
    prompts_log_path = os.path.join(config.LOG_DIR, 'prompts.log')
    prompts_file_handler = RotatingFileHandler(
        prompts_log_path,
        maxBytes=config.MAX_LOG_SIZE_MB * 1024 * 1024,
        backupCount=config.MAX_LOG_BACKUP_COUNT
    )
    prompts_file_handler.setLevel(logging.DEBUG)
    prompts_file_formatter = logging.Formatter('%(asctime)s - %(levelname)s:%(name)s:%(message)s')
    prompts_file_handler.setFormatter(prompts_file_formatter)
    prompts_logger.addHandler(prompts_file_handler)

    # --- Setup archive loggers and handlers ---
    # Archive App Logger
    archive_app_logger = logging.getLogger('archive_app')
    archive_app_logger.setLevel(logging.INFO)
    archive_app_logger.propagate = False
    if archive_app_logger.handlers:
        for handler in archive_app_logger.handlers[:]:
            archive_app_logger.removeHandler(handler)

    archive_app_log_path = os.path.join(config.ARCHIVE_DIR, 'app_archive.log')
    archive_app_handler = RotatingFileHandler(
        archive_app_log_path,
        maxBytes=config.MAX_ARCHIVE_LOG_SIZE_MB * 1024 * 1024,
        backupCount=config.MAX_ARCHIVE_LOG_BACKUP_COUNT
    )
    archive_app_handler.setLevel(logging.INFO)
    archive_app_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')
    archive_app_handler.setFormatter(archive_app_formatter)
    archive_app_logger.addHandler(archive_app_handler)

    # Archive Prompts Logger
    archive_prompts_logger = logging.getLogger('archive_prompts')
    archive_prompts_logger.setLevel(logging.DEBUG)
    archive_prompts_logger.propagate = False
    if archive_prompts_logger.handlers:
        for handler in archive_prompts_logger.handlers[:]:
            archive_prompts_logger.removeHandler(handler)

    archive_prompts_log_path = os.path.join(config.ARCHIVE_DIR, 'prompts_archive.log')
    archive_prompts_handler = RotatingFileHandler(
        archive_prompts_log_path,
        maxBytes=config.MAX_ARCHIVE_LOG_SIZE_MB * 1024 * 1024,
        backupCount=config.MAX_ARCHIVE_LOG_BACKUP_COUNT
    )
    archive_prompts_handler.setLevel(logging.DEBUG)
    archive_prompts_formatter = logging.Formatter('%(asctime)s - %(levelname)s:%(name)s:%(message)s')
    archive_prompts_handler.setFormatter(archive_prompts_formatter)
    archive_prompts_logger.addHandler(archive_prompts_handler)

    # --- Archive previous run's logs by re-logging their content ---
    log_files_to_archive = {
        'app.log': archive_app_logger,
        'prompts.log': archive_prompts_logger
    }
    for log_filename, target_logger in log_files_to_archive.items():
        source_path = os.path.join(config.LOG_DIR, log_filename)
        if os.path.exists(source_path) and os.path.getsize(source_path) > 0:
            try:
                with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Log the entire content as a single message to the archive logger
                # This will trigger the RotatingFileHandler for the archive file
                last_modified_timestamp = datetime.fromtimestamp(os.path.getmtime(source_path)).strftime("%Y-%m-%d %H:%M:%S")
                target_logger.info(f"--- ARCHIVING RUN FROM {last_modified_timestamp} ---\n{content}")
                
                # Truncate the original log file after archiving its content
                with open(source_path, 'w', encoding='utf-8') as f:
                    f.truncate(0)
                logging.info(f"Archived content of '{source_path}' to its respective archive.")
            except Exception as e:
                logging.error(f"Error archiving '{source_path}': {e}")

    logging.info("Dual-logging system initialized.")