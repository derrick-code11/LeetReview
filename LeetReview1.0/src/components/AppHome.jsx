import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Calendar, Clock, Award, TrendingUp } from "lucide-react";

const AppHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        const boardDoc = doc(db, "boards", user.uid);
        const [userSnap, boardSnap] = await Promise.all([
          getDoc(userDoc),
          getDoc(boardDoc),
        ]);

        if (userSnap.exists() && boardSnap.exists()) {
          setUserData({
            ...userSnap.data(),
            board: boardSnap.data().columns,
          });
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅"; // Morning
    if (hour < 18) return "☀️"; // Afternoon
    return "🌙"; // Evening
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getRandomEmoji = () => {
    const emojis = ["👋", "💻", "🚀", "🧠", "🏆"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        No user data found
      </div>
    );
  }

  const totalQuestions = Object.values(userData.board).reduce(
    (acc, col) => acc + col.items.length,
    0
  );
  const reviewedQuestions = userData.board.reviewed.items.length;
  const completionRate =
    totalQuestions > 0 ? (reviewedQuestions / totalQuestions) * 100 : 0;

  const pieData = [
    { name: "Reviewed", value: reviewedQuestions },
    { name: "To Review", value: totalQuestions - reviewedQuestions },
  ];

  const COLORS = ["#00C49F", "#FFBB28"];

  const nextReviewDate = userData.reviewSchedule
    ? new Date(userData.reviewSchedule.seconds * 1000)
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white bg-gradient-to-br ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {getGreeting()}, {userData.firstName}! {getGreetingEmoji()}{" "}
        {getRandomEmoji()}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Calendar className="text-blue-500 mr-4" size={24} />
          <div>
            <p className="text-sm text-gray-600">Next Review</p>
            <p className="text-xl font-semibold text-gray-800">
              {nextReviewDate
                ? nextReviewDate.toLocaleDateString()
                : "Not scheduled"}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg shadow-md flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Clock className="text-green-500 mr-4" size={24} />
          <div>
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalQuestions}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-lg shadow-md flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Award className="text-yellow-500 mr-4" size={24} />
          <div>
            <p className="text-sm text-gray-600">Reviewed Questions</p>
            <p className="text-xl font-semibold text-gray-800">
              {reviewedQuestions}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-100 p-6 rounded-lg shadow-md flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <TrendingUp className="text-purple-500 mr-4" size={24} />
          <div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xl font-semibold text-gray-800">
              {completionRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Review Progress
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center mx-2">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span className="text-gray-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Activity
          </h2>
          <ul className="space-y-2">
            {userData.board.review.items.slice(0, 5).map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-700">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppHome;
