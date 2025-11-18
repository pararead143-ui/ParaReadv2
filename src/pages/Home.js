import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Home.css";

const Home = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [segmentedText, setSegmentedText] = useState("");

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = () => setTextInput(reader.result);
    reader.readAsText(file);
  };

  const handleSegment = () => {
    setSegmentedText(textInput.split(". ").join(".\n"));
  };

  const handleSummarize = () => {
    const summaryText = textInput.split(". ").slice(0, 3).join(". ") + ".";
    navigate("/summary", {
      state: {
        original: textInput,
        summary: summaryText,
      },
    });
  };

  const handleClear = () => {
    setTextInput("");
    setSegmentedText("");
    setUploadedFile(null);
  };

  return (
    <div className={`home-container ${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setLoggedIn={setLoggedIn}
      />

      <div className={`home-content ${darkMode ? "dark" : ""}`}>
        <h1 className={`home-title ${darkMode ? "dark" : ""}`}>
          READ SMARTER, UNDERSTAND BETTER
        </h1>

        <div className="upload-section">
          <label className={`upload-btn ${darkMode ? "dark" : ""}`}>
            Upload
            <input type="file" onChange={handleFileUpload} />
          </label>
        </div>

        <textarea
          className={`text-input ${darkMode ? "dark" : ""}`}
          placeholder="Type or paste your text here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <textarea
          className={`text-output ${darkMode ? "dark" : ""}`}
          placeholder="Segmentation results..."
          value={segmentedText}
          readOnly
        />

        <div className="action-buttons">
          <button className={darkMode ? "dark" : ""} onClick={handleSegment}>
            Segment
          </button>
          <button className={darkMode ? "dark" : ""} onClick={handleSummarize}>
            Summarize
          </button>
          <button className={darkMode ? "dark" : ""} onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
