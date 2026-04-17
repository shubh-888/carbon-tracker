import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6em4xs9dp6dTLO-WF8f7hDq1CfXSnEVU",
  authDomain: "carbon-tracker-2fc4d.firebaseapp.com",
  projectId: "carbon-tracker-2fc4d",
  storageBucket: "carbon-tracker-2fc4d.firebasestorage.app",
  messagingSenderId: "319860997729",
  appId: "1:319860997729:web:3c9f7563991c98ae5ef420",
  measurementId: "G-T0K4K37N7W"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);