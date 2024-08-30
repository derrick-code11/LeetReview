/* eslint-disable react/prop-types */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchQuestionData } from "../utils/getData";

const AddModal = ({ isOpen, onClose, handleAddQuestion }) => {
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
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
          notes,
          links,
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

  const handleAddLink = () => {
    if (newLink) {
      setLinks([...links, newLink]);
      setNewLink("");
    }
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
          <div className="mb-4">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add your notes here..."
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newLink"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Add Link
            </label>
            <div className="flex">
              <input
                type="url"
                id="newLink"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Add
              </button>
            </div>
          </div>
          {links.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Added Links
              </label>
              <ul className="list-disc list-inside">
                {links.map((link, index) => (
                  <li key={index}>{link}</li>
                ))}
              </ul>
            </div>
          )}
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
