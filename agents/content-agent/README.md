# Autonomous AI Content Agent

This application is a fully autonomous AI agent designed to create and publish blog posts based on topics defined in a Google Sheet. It runs on a schedule, managing the entire content lifecycle from idea to publication without human intervention.

## High-Level Architecture

- **Central Orchestrator (`orchestrator.py`)**: This is the main control unit that runs on a schedule. It coordinates the entire workflow, fetching tasks and delegating them to the appropriate specialized agents.

- **Specialized Agents (`agents/`)**:
  - **`ContentAgent`**: Generates the blog post's text content and identifies opportunities for images.
  - **`ImageAgent`**: Creates images based on prompts from the `ContentAgent`.
  - **`EditingAgent`**: Cleans, formats, and finalizes the generated content (e.g., converting Markdown to HTML).
  - **`PublishingAgent`**: Publishes the final content and images to WordPress.

- **Services (`services/`)**: These are client classes that handle all communication with external APIs.
  - **`GoogleSheetsClient`**: Fetches tasks from and updates statuses in Google Sheets.
  - **`LLMClient`**: Communicates with the Google Gemini API to generate text.
  - **`ImageGenClient`**: Communicates with a local Stable Diffusion model to generate images.
  - **`WordPressClient`**: Communicates with the WordPress API to publish posts.

- **Utilities (`utils/`)**:
  - **`data_models.py`**: Defines the central `BlogPost` Pydantic model used to pass data between agents.
  - **`logging_config.py`**: Configures application-wide logging.

## Workflow

1. The `Orchestrator` wakes up on a schedule (e.g., every hour).
2. It uses the `GoogleSheetsClient` to find any rows in the "Content Plan" sheet with the status "POST".
3. For each task, it creates a `BlogPost` data object.
4. It passes the `BlogPost` object through the pipeline of agents in sequence: `ContentAgent` -> `ImageAgent` -> `EditingAgent` -> `PublishingAgent`.
5. Each agent performs its specific task, adding its results (e.g., raw text, generated images, edited HTML) to the `BlogPost` object.
6. If the pipeline completes successfully, the `Orchestrator` updates the row's status in Google Sheets to "Published".
7. If any agent fails, the status is updated to "Error", and the error is logged in `app.log`.
8. The `Orchestrator` then sleeps until the next scheduled run.

## Setup and Running

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**: Copy `.env.example` to `.env` and fill in all the required API keys and IDs.

3. **Run the Application**:

   ```bash
   python orchestrator.py
   ```

## TODO

1. **image output, possibly use different size images?**
2. **persistence and utilized previous posts from Generated Content Log**
3. **links that are not empty and also do we need to show the full domain name, use shorter link text for external links**
