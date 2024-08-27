import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function fetchQuestionData(titleSlug) {
  const q = query(
    collection(db, "leetcode_questions"),
    where("titleSlug", "==", titleSlug)
  );

  try {
    const querySnapshot = await getDocs(q);

    // Check if any documents were returned
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data();
    } else {
      return null; // No documents found
    }
  } catch (error) {
    console.error("Error fetching question data:", error);
    return null;
  }
}
