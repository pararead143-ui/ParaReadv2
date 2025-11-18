// src/pages/ReadingMaterials.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import Sidebar from "./Sidebar";
import "../styles/Readings.css";

const ReadingMaterials = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const navigate = useNavigate(); // ✅ for linking to view page

  // Placeholder for uploaded materials
  const [materials, setMaterials] = useState([
    { id: 1, title: "Sample Material 1" },
    { id: 2, title: "Sample Material 2" },
    { id: 3, title: "Sample Material 3" },
  ]);

  // ✅ View handler
  const handleView = (id) => {
    navigate(`/view-reading/${id}`);
  };

  return (
    <div className={`materials-container ${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setLoggedIn={setLoggedIn}
      />

      <div className="materials-content">
        <h1 className="materials-title">READING MATERIALS</h1>

        {/* Upload Section */}
        <div className="materials-section upload-section">
          <label className="upload-btn">
            Upload New Material
            <input type="file" />
          </label>
        </div>

        {/* Materials List */}
        <div className="materials-list">
          {materials.map((item) => (
            <div key={item.id} className="material-item">
              <span className="material-title">{item.title}</span>

              <div className="action-buttons">
                {/* ✅ VIEW BUTTON NOW WORKS */}
                <button onClick={() => handleView(item.id)}>View</button>

                <button>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ReadingMaterials;
