import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  FileText,
  Settings,
  Info,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import logo from "../assets/Logo.png";
import "../styles/Sidebar.css";
import { useMaterial } from "../context/MaterialContext";

const Sidebar = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { materialId } = useMaterial(); // ✅ Get current material
  const [collapsed, setCollapsed] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoggedIn(false);
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active" : "";

  const handleNavigation = (path) => {
    if (path === "/summary") {
      if (materialId) {
        navigate(`/summary/${materialId}`); // ✅ Go to the selected material's summary
      } else {
        // No material selected, still go to summary page but show a message
        navigate("/summary");
      }
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/home" },
    { name: "Summary", icon: <Menu size={20} />, path: "/summary" },
    { name: "Reading Materials", icon: <FileText size={20} />, path: "/readings" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "About", icon: <Info size={20} />, path: "/about" },
  ];

  return (
    <>
      <div className={`sidebar ${darkMode ? "dark" : ""} ${collapsed ? "collapsed" : ""}`}>
        <div className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "➤" : "⬅"}
        </div>

        <div className="sidebar-avatar">
          <div className="avatar-circle">
            <img src={logo} alt="PARAREAD Logo" className="avatar-logo" />
          </div>
          {!collapsed && <span className="avatar-name">PARAREAD</span>}
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="icon-circle">{item.icon}</div>
              {!collapsed && <span className="menu-text">{item.name}</span>}
              {collapsed && <span className="tooltip">{item.name}</span>}
            </li>
          ))}

          <li className="toggle-item">
            <div className="icon-circle">{darkMode ? <Moon size={20} /> : <Sun size={20} />}</div>
            {!collapsed && <span>Dark Mode</span>}
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="slider"></span>
            </label>
          </li>

          <li onClick={() => setShowLogoutModal(true)}>
            <div className="icon-circle">
              <LogOut size={20} />
            </div>
            {!collapsed && <span>Log Out</span>}
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div
            className={`logout-modal-content ${darkMode ? "dark" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Are you sure you want to log out?</h2>
            <div className="logout-modal-actions">
              <button className="logout-btn" onClick={handleLogout}>Yes</button>
              <button className="cancel-logout-btn" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
