import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/sidebar.css"; // Ensure correct casing for file import

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      {/* ✅ Display the logo */}
      <div className="logo">
        <img src="/images/logo.jpg" alt="Logo" />
      </div>

      <ul>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">🏠 Home</Link>
        </li>
        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard">📊 Dashboard</Link>
        </li>
        <li className={location.pathname === "/games" ? "active" : ""}>
          <Link to="/games">🎮 Games</Link>
        </li>
        <li className={location.pathname === "/settings" ? "active" : ""}>
          <Link to="/settings">⚙️ Settings</Link>
        </li>
        <li className={location.pathname === "/login" ? "active" : ""}>
          <Link to="/login">🔑 Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
