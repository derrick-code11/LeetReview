import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import RequestResetLink from "./components/RequestResetLink.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Board from "./components/Board.jsx";
// import Boards from "./pages/Boards"

function App() {
  return (
    <>
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
            <Route path="" element={<Board/>} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
