import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const sendNotification = async (userId, text) => {
  if (!userId) return;

  await addDoc(collection(db, "notifications"), {
    userId,
    text,
    read: false,
    createdAt: serverTimestamp()
  });
};