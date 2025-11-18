// src/pages/ViewReading.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/ViewReading.css";

const ViewReading = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // TEMPORARY DUMMY MATERIAL — later fetched from DB
  const material = {
    title: `Reading Material #${id}`,
    uploaded: "February 17, 2025",
    text:
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. ` +
      `Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. \n\n` +
      `Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. ` +
      `Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.`,
    segmented:
      Array.from({ length: 20 }, (_, i) => `Segment ${i + 1}: Lorem ipsum dolor sit amet...`).join("\n"),
    summary:
      `This text discusses several core ideas about structure, discipline, and progression in reading comprehension.`
  };

  return (
    <div className={`view-container ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setLoggedIn={setLoggedIn} />

      <div className="view-content">
        
        {/* Top Header with Back Button */}
        <div className="view-header">
          <button className="back-btn" onClick={() => navigate("/readings")}>
            ← Back
          </button>
          <h1 className="view-title">VIEW READING MATERIAL</h1>
        </div>

        {/* Date */}
        <p className="uploaded-date">
          Uploaded on: <span>{material.uploaded}</span>
        </p>

        {/* Scrollable PDF-like content */}
        <div className="pdf-viewer">

          {/* Title */}
          <div className="page-section">
            <h2 className="section-title">Title</h2>
            <div className="page-box">{material.title}</div>
          </div>

          {/* Original Text */}
          <div className="page-section">
            <h2 className="section-title">Original Text</h2>
            <div className="page-box long-text">
              {material.text.split("\n").map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
          </div>

          {/* Segmented Text */}
          <div className="page-section">
            <h2 className="section-title">Segmented Text</h2>
            {material.segmented.split("\n").map((s, index) => (
              <div key={index} className="page-box long-text">
                <p>{s}</p>
              </div>
            ))}
          </div>

          {/* Summary Text */}
          <div className="page-section">
            <h2 className="section-title">Summary</h2>
            <div className="page-box long-text">
              <p>{material.summary}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewReading;
