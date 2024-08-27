/* eslint-disable react/prop-types */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchQuestionData } from "../utils/getData";

const AddModal = ({ isOpen, onClose, handleAddQuestion }) => {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateLeetCodeLink = (link) => {
    const regex =
      /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/?(?:description\/?)?$/;
    return regex.test(link);
  };

  const extractTitleSlug = (link) => {
    const match = link.match(/\/problems\/([a-z0-9-]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateLeetCodeLink(link)) {
      setError("Invalid LeetCode link. Please provide a valid link.");
      setIsLoading(false);
      return;
    }

    const titleSlug = extractTitleSlug(link);

    try {
      const questionData = await fetchQuestionData(titleSlug);
      if (questionData) {
        handleAddQuestion({
          id: uuidv4(),
          link,
          ...questionData,
        });
        onClose();
      } else {
        setError("Question not found in the database.");
      }
    } catch (error) {
      setError("Error fetching question data. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Add LeetCode Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              LeetCode Question Link
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://leetcode.com/problems/question-title/"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
