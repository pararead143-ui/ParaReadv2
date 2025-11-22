import React, { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react"; // Add Check icon
import Sidebar from "./Sidebar";
import "../styles/Settings.css";

const Settings = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const username = "john_doe";
  const email = "johndoe@example.com";

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name.substring(0, 3) + "***@" + domain;
  };

  const maskedEmail = maskEmail(email);
  const maskedUsername = username.substring(0, 3) + "***";

  const [notifications, setNotifications] = useState(true);

  // Password modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const updatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;

    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true); // Show success animation

    // Hide success after 2 seconds
    setTimeout(() => {
      setSuccess(false);
      setIsModalOpen(false);
    }, 2000);
  };

  // Clear reading materials modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const confirmClearMaterials = () => {
    console.log("Deleted all materials");
    setIsClearModalOpen(false);
  };

  return (
    <div className={`settings-container ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setLoggedIn={setLoggedIn} />

      <div className="settings-content">
        <h1 className="settings-title">SETTINGS</h1>

        {/* Preferences */}
        <div className="settings-section">
          <h3>User Preferences</h3>
          <div className="settings-item">
            <label>Font Size:</label>
            <select defaultValue="medium">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="settings-item">
            <label>Language:</label>
            <select defaultValue="en">
              <option value="en">English</option>
              <option value="fil">Filipino</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-item toggle-row">
            <label>Enable Notifications:</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Account */}
        <div className="settings-section">
          <h3>Account</h3>
          <div className="settings-item">
            <label>Username:</label>
            <input type="text" value={maskedUsername} readOnly />
          </div>
          <div className="settings-item">
            <label>Email:</label>
            <input type="email" value={maskedEmail} readOnly />
          </div>
          <div className="settings-item">
            <label>Password:</label>
            <input type="password" value="********" readOnly className="masked" />
          </div>
          <button className="save-btn" onClick={() => setIsModalOpen(true)}>
            Change Password
          </button>
          <button className="clear-btn" onClick={() => setIsClearModalOpen(true)}>
            Clear Reading Materials
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>

            <div className="settings-item">
              <label>Current Password:</label>
              <div className="password-wrapper">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <span className="eye-icon" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </div>
            </div>

            <div className="settings-item">
              <label>New Password:</label>
              <div className="password-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </div>
            </div>

            <div className="settings-item">
              <label>Confirm Password:</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={updatePassword}>
                Update Password
              </button>
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>

            {/* Success Animation */}
            {success && (
              <div className="success-animation">
                <Check size={36} color="#00d7ff" />
                <span>Password Updated Successfully!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear Materials Modal */}
      {isClearModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Clear Reading Materials</h3>
            <p>Are you sure you want to delete <strong>all</strong> reading materials?</p>
            <div className="modal-actions">
              <button className="clear-btn" onClick={confirmClearMaterials}>
                Yes, Delete
              </button>
              <button className="cancel-btn" onClick={() => setIsClearModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
