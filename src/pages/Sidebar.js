import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation(); // get current path

  const handleLogout = () => {
    console.log("[Sidebar] Logging out...");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoggedIn(false); // Update global login state
    navigate("/login"); // Redirect
  };

  // Check if a route is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <h1 className="sidebar-title">PARAREAD</h1>

      <ul className="sidebar-menu">
        <li className={isActive("/home")} onClick={() => navigate("/home")}>Home</li>
        <li className={isActive("/summary")} onClick={() => navigate("/summary")}>Summary</li>
        <li className={isActive("/readings")} onClick={() => navigate("/readings")}>Reading Materials</li>

        {/* Dark mode switch */}
        <li>
          <label className="switch">
            <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} />
            <span className="slider"></span>
          </label>
          Dark Mode
        </li>

        <li className={isActive("/settings")} onClick={() => navigate("/settings")}>Settings</li>
        <li className={isActive("/about")} onClick={() => navigate("/about")}>About</li>

        {/* Logout */}
        <li onClick={handleLogout}>Log Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;
