import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { X } from "lucide-react";
import dayjs from "dayjs";
import { db, auth } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { addNotification } from "../utils/notification";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem("scheduledReviewDate");
    return saved ? dayjs(saved) : dayjs();
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    localStorage.setItem("scheduledReviewDate", selectedDate.toISOString());
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        await updateDoc(userDoc, {
          reviewSchedule: selectedDate.toDate(),
        });
        setShowNotification(true);

        // Add a notification
        await addNotification(
          user.uid, 
          `Review scheduled for ${formatDate(selectedDate)}`
        );
      }
    } catch (error) {
      console.error("Error scheduling review:", error);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const formatDate = (date) => {
    const now = dayjs();
    const tomorrow = now.add(1, "day");

    if (date.isSame(now, "day")) {
      return `Today at ${date.format("h:mm A")}`;
    } else if (date.isSame(tomorrow, "day")) {
      return `Tomorrow at ${date.format("h:mm A")}`;
    } else if (date.isSame(now, "year")) {
      return date.format("MMM D [at] h:mm A");
    } else {
      return date.format("MMM D, YYYY [at] h:mm A");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 transform -translate-y-28">
          {showNotification && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 relative">
              <button
                onClick={closeNotification}
                className="absolute top-2 right-2 text-green-700 hover:text-green-900"
              >
                <X size={20} />
              </button>
              <p className="font-bold">🎉 Review Scheduled!</p>
              <p>📅 Your next review is: {formatDate(selectedDate)} ⏰</p>
              <p>
                🚀 You will receive a notification at your chosen time...
              </p>
            </div>
          )}
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Review Scheduler
            </div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black mb-6">
              Schedule Your Next Review
            </h2>
            <div className="mb-6">
              <DateTimePicker
                label="Select Date and Time"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <div className="relative">
                    <input
                      {...params.inputProps}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <label className="absolute left-2 -top-3 bg-white px-1 text-xs text-gray-600">
                      {params.label}
                    </label>
                  </div>
                )}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Schedule;