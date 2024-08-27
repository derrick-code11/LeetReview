/* eslint-disable react/prop-types */
import { TrashOutline } from "react-ionicons";

const QuestionCard = ({ question, onDelete, isReviewed }) => {
  const getDifficultyClasses = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500 text-xs  bg-gray-100 px-2 py-1 rounded";
      case "medium":
        return "text-orange-500 text-xs bg-gray-100 px-2 py-1 rounded";
      case "hard":
        return "text-red-500 text-xs bg-gray-100 px-2 py-1 rounded";
      default:
        return "text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">
          {question.questionNum}. {question.title}
        </h3>
        <button
          onClick={() => onDelete(question.id)}
          className="p-1 text-red-500 hover:text-red-700"
        >
          <TrashOutline height="20px" width="20px" />
        </button>
      </div>
      <span className={`text-sm ${getDifficultyClasses(question.difficulty)}`}>
        {question.difficulty}
      </span>
      <div className="flex flex-wrap gap-2 mt-2 mb-2">
        {question.topicTags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      {!isReviewed && (
        <div className="flex justify-center mt-4">
          <a
            href={question.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white text-xs font-semibold py-1.5 px-2 rounded shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-center"
          >
            Solve
          </a>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
