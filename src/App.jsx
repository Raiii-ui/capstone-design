import { Routes, Route, useLocation, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./components/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Games from "./components/Games.jsx";
import Settings from "./components/Settings.jsx";
import Login from "./components/Login.jsx";
import "./css/sidebar.css";
import "./css/login.css";

function App() {
  const location = useLocation(); // Get the current route

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {/* Conditionally render the login button (hide it on /login) */}
        {location.pathname !== "/login" && (
          <Link to="/login" className="login-btn">Login</Link>
        )}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
