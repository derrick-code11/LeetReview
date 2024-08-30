import { useState } from "react";
import {
  AppsOutline,
  HomeOutline,
  LogOutOutline,
  NewspaperOutline,
  NotificationsOutline,
  PieChartOutline,
  CalendarOutline,
} from "react-ionicons";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useNotifications } from "../utils/notificationContext";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  const navLinks = [
    {
      title: "Home",
      icon: <HomeOutline color="#555" width="22px" height="22px" />,
      path: "/dashboard",
    },
    {
      title: "Board",
      icon: <AppsOutline color="#555" width="22px" height="22px" />,
      path: "/dashboard/board",
    },
    {
      title: "Schedule",
      icon: <CalendarOutline color="#555" width="22px" height="22px" />,
      path: "/dashboard/schedule",
    },
    {
      title: "Analytics",
      icon: <PieChartOutline color="#555" width="22px" height="22px" />,
      path: "/dashboard/analytics",
    },
    {
      title: "Notifications",
      icon: <NotificationsOutline color="#555" width="22px" height="22px" />,
      path: "/dashboard/notifications",
      count: notifications.length,
    },
  ];

  const handleNavigate = (link) => {
    setActiveLink(link.title);
    navigate(link.path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="fixed left-0 top-0 md:w-[230px] w-[60px] overflow-hidden h-full flex flex-col">
      <div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px] bg-[#fff]">
        <span className="text-orange-400 font-semibold text-2xl md:block hidden">
          LeetReview
        </span>
        <span className="text-orange-400 font-semibold text-2xl md:hidden block"></span>
      </div>
      <div className="w-full h-[calc(100vh-70px)] border-r flex flex-col md:items-start items-center gap-2 border-slate-300 bg-[#fff] py-5 md:px-3 px-3 relative">
        {navLinks.map((link) => (
          <div
            key={link.title}
            onClick={() => handleNavigate(link)}
            className={`flex items-center gap-2 w-full rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer ${
              activeLink === link.title ? "bg-orange-300" : "bg-transparent"
            }`}
          >
            {link.icon}
            <span className="font-medium text-[15px] md:block hidden">
              {link.title}
            </span>
            {link.count > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {link.count}
              </span>
            )}
          </div>
        ))}
        <div
          className="flex absolute bottom-4 items-center md:justify-start justify-center gap-2 md:w-[90%] w-[70%] rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer bg-gray-200"
          onClick={handleLogout}
        >
          <LogOutOutline />
          <span className="font-medium text-[15px] md:block hidden">
            Log Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
