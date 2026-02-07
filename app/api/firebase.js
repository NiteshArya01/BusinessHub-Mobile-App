import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbvBnnyFMoWIgjq1OX4v5u7WtvZFwHEOQ", 
  authDomain: "prt-manager.firebaseapp.com",
  projectId: "prt-manager",
  storageBucket: "prt-manager.firebasestorage.app",
  messagingSenderId: "458085686423",
  appId: "1:458085686423:web:ade9f65193fbd1e2bd1dd2",
  measurementId: "G-NXC4MGB3TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;