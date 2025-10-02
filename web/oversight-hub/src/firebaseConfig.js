// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);