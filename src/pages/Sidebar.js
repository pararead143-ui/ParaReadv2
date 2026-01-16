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
  Book,
} from "lucide-react"; // added Book icon
import Swal from "sweetalert2"; // ✅ ADDED
import logo from "../assets/Logo.png";
import "../styles/Sidebar.css";
import { useMaterial } from "../context/MaterialContext";

const Sidebar = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { materialId } = useMaterial();
  const [collapsed, setCollapsed] = React.useState(false);

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
      if (materialId) navigate(`/summary/${materialId}`);
      else navigate("/summary");
    } else navigate(path);
  };

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/home" },
    { name: "Summary", icon: <Menu size={20} />, path: "/summary" },
    { name: "Reading Materials", icon: <FileText size={20} />, path: "/readings" },
    {
      name: "Vocabulary",
      icon: <Book size={20} />, // changed to Book icon
      path: "/vocabulary",
    },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "About", icon: <Info size={20} />, path: "/about" },
  ];

  const confirmLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Log out?",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#7b2cbf",
    });

    if (result.isConfirmed) handleLogout();
  };

  return (
    <>
      <div
        className={`sidebar ${darkMode ? "dark" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <div className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "➤" : "⬅"}
        </div>

        {/* Static logo/avatar */}
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
            <div className="icon-circle">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            {!collapsed && <span>Dark Mode</span>}
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider"></span>
            </label>
          </li>

          {/* ✅ SweetAlert logout confirm replaces modal */}
          <li onClick={confirmLogout}>
            <div className="icon-circle">
              <LogOut size={20} />
            </div>
            {!collapsed && <span>Log Out</span>}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
