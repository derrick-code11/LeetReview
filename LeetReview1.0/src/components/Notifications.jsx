import { useNotifications } from "../utils/notificationContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const Notifications = () => {
  const { notifications, setNotifications } = useNotifications();

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4"
            >
              <p>{notification.message}</p>
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Mark as Read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
