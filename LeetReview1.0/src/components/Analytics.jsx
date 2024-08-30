import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ClipboardList,
  CheckCircle,
  RefreshCw,
  ListChecks,
} from "lucide-react";

const Analytics = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "boards", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            setError("No user data found");
          }
        } else {
          setError("No user logged in");
        }
      } catch (err) {
        setError("Error fetching user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No data available</div>;

  const { columns } = userData;

  // Calculate statistics
  const totalProblems = Object.values(columns).reduce(
    (acc, col) => acc + col.items.length,
    0
  );
  const problemsByStatus = Object.entries(columns).map(([key, value]) => ({
    key,
    name: value.name,
    value: value.items.length,
  }));

  const difficultyCount = Object.values(columns).reduce((acc, col) => {
    col.items.forEach((item) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
    });
    return acc;
  }, {});

  const difficultyData = Object.entries(difficultyCount).map(
    ([key, value]) => ({
      difficulty: key,
      count: value,
    })
  );

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your LeetCode Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Problem Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={problemsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {problemsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Problem Difficulty</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={difficultyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Problem Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="flex items-center justify-between">
              <ClipboardList className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-blue-600">
                {totalProblems}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Total Problems</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="flex items-center justify-between">
              <ListChecks className="text-yellow-500" size={24} />
              <span className="text-2xl font-bold text-yellow-600">
                {columns.todo.items.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">To Do</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="flex items-center justify-between">
              <RefreshCw className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-orange-600">
                {columns.review.items.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">To Review</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="flex items-center justify-between">
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-2xl font-bold text-green-600">
                {columns.reviewed.items.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Reviewed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
