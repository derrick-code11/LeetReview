
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar";

const Dashboard = () => {

  return (
    <div>
       <Sidebar />
       <Navbar />
       <div className="dashboard md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet />
			</div>
    </div>
  );
};

export default Dashboard;
