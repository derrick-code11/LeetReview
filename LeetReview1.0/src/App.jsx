import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
// import ResetPassword from "./components/ResetPassword.jsx";
import RequestResetLink from "./components/RequestResetLink.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request-reset" element={<RequestResetLink />} />
          {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
