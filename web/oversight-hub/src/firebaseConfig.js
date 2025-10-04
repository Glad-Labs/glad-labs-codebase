/**
 * @file firebaseConfig.js
 * @description This file initializes and configures the Firebase app instance.
 * It exports the Firestore database (`db`) and Authentication (`auth`) services
 * for use throughout the application.
 *
 * @requires firebase/app
 * @requires firebase/firestore
 * @requires firebase/auth
 *
 * @suggestion SECURITY_RISK: This file contains hardcoded API keys and project
 * identifiers. This is a major security vulnerability. Anyone with access to this
 * code can access your Firebase project.
 *
 * @recommendation BEST_PRACTICE: Move this configuration to environment variables.
 * 1. Create a `.env` file in the `web/oversight-hub` root directory.
 * 2. Add your Firebase config to the `.env` file, prefixing each key with `REACT_APP_`.
 *    For example: `REACT_APP_API_KEY="your-api-key"`
 * 3. Add `.env` to your `.gitignore` file to prevent it from being committed.
 * 4. Access these variables in this file using `process.env.REACT_APP_API_KEY`.
 * 5. I will create an example file (`.env.example`) to demonstrate the structure.
 */

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- Firebase Configuration ---
// @security: DANGER - Do not commit this object with real credentials to a public repository.
// These values should be loaded from environment variables.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

