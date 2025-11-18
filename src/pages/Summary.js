import React, { useState } from "react";
import Sidebar from "./Sidebar";
import QuizModal from "./Quiz";
import "../styles/Summary.css";

const SummaryPage = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  // Make originalText editable
  const [originalText, setOriginalText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  // Example questions — replace with real quiz data
  const questions = [
    {
      id: 1,
      question: "What is the main idea of the summary?",
      options: ["Option A", "Option B", "Option C", "Option D"]
    },
    {
      id: 2,
      question: "Which point was emphasized in the summary?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"]
    }
  ];

  const handleSummarize = () => {
    // Here you can update the summary dynamically
    const generatedSummary = originalText
      .split(". ")
      .slice(0, 3)
      .join(". ") + ".";
    setSummaryText(generatedSummary);
  };

  const handleQuizSubmit = (answers) => {
    console.log("Quiz answers:", answers);
    alert("Quiz submitted! Check console for answers.");
    setShowQuiz(false);
  };

  return (
    <div className={`summary-container ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setLoggedIn={setLoggedIn} />

      <div className={`summary-content ${darkMode ? "dark" : ""}`}>
        <h1 className="summary-title">SUMMARY</h1>

        {/* Original Text Section */}
        <div className="summary-section">
          <h3>Original Text</h3>
          <textarea
            className="summary-input"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
          <div className="action-buttons">
            <button onClick={handleSummarize}>Summarize</button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <h3>Summary</h3>
          <textarea className="summary-output" value={summaryText} readOnly />
          <div className="action-buttons">
            <button onClick={() => setShowQuiz(true)}>Take Quiz</button>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          darkMode={darkMode}
          questions={questions}
          onClose={() => setShowQuiz(false)}
          onSubmit={handleQuizSubmit}
        />
      )}
    </div>
  );
};

export default SummaryPage;
