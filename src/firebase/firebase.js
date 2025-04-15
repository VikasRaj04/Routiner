// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEx18HIqR-sFr6GFnohtgItbAg0NOYqgI",
  authDomain: "routiner-ce566.firebaseapp.com",
  projectId: "routiner-ce566",
  storageBucket: "routiner-ce566.firebasestorage.app",
  messagingSenderId: "667287178637",
  appId: "1:667287178637:web:9b3dcc254c330f9b1c81c4",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
