import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

export const addNotification = async (userId, message) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      message,
      read: false,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Error adding notification: ", error);
  }
};