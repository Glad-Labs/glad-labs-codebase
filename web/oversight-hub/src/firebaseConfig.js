// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDTqYXTYjGLRDzRvwPE6UFehBXExHFt1o",
  authDomain: "gen-lang-client-0031944915.firebaseapp.com",
  projectId: "gen-lang-client-0031944915",
  storageBucket: "gen-lang-client-0031944915.firebasestorage.app",
  messagingSenderId: "206722606964",
  appId: "1:206722606964:web:2496cb024b79e19d01ae21",
  measurementId: "G-S97NX6MW9V"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

// Make the db and auth instances available to other files
export { db, auth };