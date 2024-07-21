import { useEffect, useState } from "react";
import {Navigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { CircularProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";


// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <CircularProgress></CircularProgress>
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

