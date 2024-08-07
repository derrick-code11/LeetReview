import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button variant="outlined" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
