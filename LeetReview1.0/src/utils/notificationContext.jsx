/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const notificationContext = createContext();

export const useNotifications = () => useContext(notificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        where("read", "==", false)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationList = [];
        querySnapshot.forEach((doc) => {
          notificationList.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(notificationList);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <notificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </notificationContext.Provider>
  );
};
