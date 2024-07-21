import {
  collection,
  writeBatch,
  doc,
} from "firebase/firestore";
import { getFilteredLeetcodeQuestions } from "../api/index.js";
import { db } from "../services/firebase.js";



async function addQuestionsToFirestore() {
  const filteredQuestions = await getFilteredLeetcodeQuestions();
  const questionsRef = collection(db, "leetcode_questions");

  // Split questions into chunks of 500 (Firestore batch limit)
  const chunks = [];
  for (let i = 0; i < filteredQuestions.length; i += 500) {
    chunks.push(filteredQuestions.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    const batch = writeBatch(db);

    chunk.forEach((question) => {
      const docRef = doc(questionsRef); // Create a new document reference
      batch.set(docRef, question); // Add the document to the batch
    });

    try {
      await batch.commit();
      console.log(`Batch of ${chunk.length} questions committed successfully`);
    } catch (error) {
      console.error("Error committing batch: ", error);
    }
  }

  console.log("All questions added successfully");
}

addQuestionsToFirestore();
