import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar";

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
       <Sidebar />
       <Navbar />
       <div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet />
			</div>
      <Button variant="outlined" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
