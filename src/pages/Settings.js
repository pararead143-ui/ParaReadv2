import React from "react";
import Sidebar from "./Sidebar";
import "../styles/Settings.css";

const Settings = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  return (
    <div className={`settings-container ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setLoggedIn={setLoggedIn} />

      <div className="settings-content">
        <h1 className="settings-title">SETTINGS</h1>

        {/* Account Settings */}
        <div className="settings-section">
          <h3>Account</h3>
          <div className="settings-item">
            <label>Username:</label>
            <input type="text" placeholder="Your username" />
          </div>
          <div className="settings-item">
            <label>Email:</label>
            <input type="email" placeholder="Your email" />
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="settings-item">
            <label>Dark Mode:</label>
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          </div>
          {/* Placeholder for future settings */}
          <div className="settings-item">
            <label>Font Size:</label>
            <select>
              <option value="small">Small</option>
              <option value="medium" selected>Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
