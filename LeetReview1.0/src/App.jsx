import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import RequestResetLink from "./components/RequestResetLink.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Board from "./components/Board.jsx";
import Schedule from "./components/Schedule.jsx";
import AppHome from "./components/AppHome.jsx";
import Analytics from "./components/Analytics";
import { SearchProvider } from "./utils/searchFilterContext.jsx";
import { NotificationProvider } from "./utils/notificationContext";
import Notifications from "./components/Notifications";

function App() {
  return (
    <>
      <SearchProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/request-reset" element={<RequestResetLink />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AppHome />} />
                <Route path="board" element={<Board />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </SearchProvider>
    </>
  );
}

export default App;
