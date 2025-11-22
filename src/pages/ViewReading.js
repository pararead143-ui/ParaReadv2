// src/pages/ViewReading.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "../api/anxios"; // your axios instance
import "../styles/ViewReading.css";

const ViewReading = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await axios.get(`/materials/${id}/`);
        setMaterial(res.data);
      } catch (err) {
        console.error("Error fetching material:", err);
        setMaterial(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  if (loading) return <p>Loading material...</p>;
  if (!material) return <p>Material not found.</p>;

  // Helper to render Groq segments
  const renderSegments = () => {
    const data = material.segmented_data;
    if (!data) return <p>No segmented text available.</p>;

    if (Array.isArray(data)) {
      return data.map((seg, i) => (
        <div key={i} className="segment-box">
          <h4>Segment {i + 1}</h4>
          <p><strong>Text:</strong> {seg.segment}</p>
          <p><strong>Explanation:</strong> {seg.explanation}</p>
          <p><strong>Key Terms:</strong> {seg.key_terms.join(", ")}</p>
          <p><strong>Example:</strong> {seg.example}</p>
        </div>
      ));
    }

    if (data.sentences) {
      return data.sentences.map((s, i) => <p key={i}>{s}</p>);
    }

    return <p>No segmented text available.</p>;
  };

  // Helper to safely extract summary text
  const getSummaryText = (summaryData) => {
    if (!summaryData) return "No summary available.";
    if (typeof summaryData === "string") return summaryData;
    if (summaryData.summary) return summaryData.summary;
    return JSON.stringify(summaryData);
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
          Uploaded on: <span>{new Date(material.created_at).toLocaleDateString()}</span>
        </p>

        {/* Scrollable content */}
        <div className="pdf-viewer">
          {/* Title */}
          <div className="page-section">
            <h2 className="section-title">Title</h2>
            <div className="page-box">{material.title || "Untitled"}</div>
          </div>

          {/* Original Text */}
          <div className="page-section">
            <h2 className="section-title">Original Text</h2>
            <div className="page-box long-text">
              {material.raw_text?.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Segmented Text */}
          <div className="page-section">
            <h2 className="section-title">Segmented Text</h2>
            <div className="page-box long-text">
              {renderSegments()}
            </div>
          </div>

          {/* Summary Text */}
          <div className="page-section">
            <h2 className="section-title">Summary</h2>
            <div className="page-box long-text">
              <p>{getSummaryText(material.summary_data)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReading;

