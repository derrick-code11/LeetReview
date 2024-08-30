/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  TrashOutline,
  ChevronDownOutline,
  ChevronUpOutline,
} from "react-ionicons";

const YouTubeIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const QuestionCard = ({
  question,
  onDelete,
  isReviewed,
  onUpdateNotes,
  columnId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(question.notes || "");
  const [links, setLinks] = useState(question.links || []);
  const [newLink, setNewLink] = useState("");
  const [youtubeThumbnails, setYoutubeThumbnails] = useState({});

  useEffect(() => {
    links.forEach((link) => {
      if (isYouTubeLink(link)) {
        fetchYouTubeThumbnail(link);
      }
    });
  }, [links]);

  const getDifficultyClasses = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    onUpdateNotes(question.id, e.target.value, links);
  };

  const handleAddLink = () => {
    if (newLink) {
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      setNewLink("");
      onUpdateNotes(question.id, notes, updatedLinks);
    }
  };

  const isYouTubeLink = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const fetchYouTubeThumbnail = (url) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      setYoutubeThumbnails((prev) => ({ ...prev, [url]: thumbnailUrl }));
    }
  };

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold pr-24">
            {question.questionNum}. {question.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {question.topicTags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyClasses(
            question.difficulty
          )} absolute top-4 right-4 mt-2`}
        >
          {question.difficulty}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onDelete(question.id)}
          className="p-1 text-red-500 hover:text-red-700"
        >
          <TrashOutline height="20px" width="20px" />
        </button>

        {!isReviewed && (
          <a
            href={question.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
          >
            Solve
          </a>
        )}
      </div>

      {(columnId === "review" || columnId === "reviewed") && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {isExpanded ? (
            <ChevronUpOutline color={"#4B5563"} height="20px" width="20px" />
          ) : (
            <ChevronDownOutline color={"#4B5563"} height="20px" width="20px" />
          )}
          <span className="ml-2 font-medium">
            {isExpanded ? "Hide" : "Show"} Notes & Links
          </span>
        </button>
      )}

      {isExpanded && (columnId === "review" || columnId === "reviewed") && (
        <div className="mt-4">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add your notes here..."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
          <div className="mt-2">
            <input
              type="text"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Add a link..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddLink}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Add Link
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {links.map((link, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                {isYouTubeLink(link) && youtubeThumbnails[link] ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative"
                  >
                    <img
                      src={youtubeThumbnails[link]}
                      alt="YouTube Video Thumbnail"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 hover:opacity-100">
                      <YouTubeIcon className="w-12 h-12 text-red-600" />
                    </div>
                  </a>
                ) : (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors duration-300"
                  >
                    {link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
