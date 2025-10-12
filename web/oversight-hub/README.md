# Oversight Hub

This project is the main interface for overseeing the GLAD Labs AI-powered content creation pipeline.

## Overview

The Oversight Hub is a React application that provides a dashboard for monitoring the status of content creation tasks, viewing financial data, and interacting with the AI agents.

## Tech Stack

- **React:** The core UI library.
- **Zustand:** For state management.
- **@chatscope/chat-ui-kit-react:** For the chat interface.
- **Firebase:** For real-time data synchronization.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository.
2. Navigate to the `web/oversight-hub` directory:
   ```sh
   cd web/oversight-hub
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

To start the development server, run the following command:

```sh
npm start
```

The application will be available at [http://localhost:3001](http://localhost:3001).

## Key Features

- **Dashboard:** A central place to view the status of all content creation tasks in a card-based layout.
- **Settings Page:** A dedicated page to configure the application, including theme settings (light/dark mode), auto-refresh options, and API key management.
- **Resizable Panes:** The UI features resizable panes for a flexible and customizable layout.
- **Command Pane:** Interact with the AI Co-Founder agent through a chat interface to give commands and receive feedback.
- **Real-time Updates:** The application uses Firebase Firestore to provide real-time updates on the status of tasks and other data.
