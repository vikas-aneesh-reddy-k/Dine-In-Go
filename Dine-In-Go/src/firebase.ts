import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrlZ28wxDI3U8jDm8WJzfIGR9Gqh3-cbc",
  authDomain: "dineingo.firebaseapp.com",
  projectId: "dineingo",
  storageBucket: "dineingo.firebasestorage.app",
  messagingSenderId: "434559391214",
  appId: "1:434559391214:web:3e3c54d5ef351d1371eaff",
  measurementId: "G-J08CQW2HYG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const db = getFirestore(app); // Moved this line after app initialization

// Export Firebase methods
export { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup };