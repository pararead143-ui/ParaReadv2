// src/pages/SummaryPage.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import QuizModal from "./Quiz";
import { FiFileText, FiEdit2, FiTrash2, FiCopy, FiDownload } from "react-icons/fi";
import "../styles/Summary.css";
import axios from "../api/anxios";
import { useMaterial } from "../context/MaterialContext";

const SummaryPage = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const { currentMaterialId, setCurrentMaterialId } = useMaterial();
  const [originalText, setOriginalText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  // --- Load material if ID exists ---
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!currentMaterialId) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const res = await axios.get(`/materials/${currentMaterialId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOriginalText(res.data.raw_text || "");
        let summary = res.data.summary_data?.summary || "";
        summary = summary.replace(/\\n/g, "\n").replace(/- /g, "\n- ");
        setSummaryText(summary);
      } catch (err) {
        console.error("Error fetching material:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [currentMaterialId]);

  // --- Handle paste (detect JSON with materialId) ---
  const handlePaste = (e) => {
    try {
      const pastedData = e.clipboardData.getData("text");
      const parsed = JSON.parse(pastedData);

      if (parsed && parsed.content) {
        setOriginalText(parsed.content);
        if (parsed.materialId) {
          setCurrentMaterialId(parsed.materialId);
        } else {
          setCurrentMaterialId(null);
        }
      }
    } catch {
      setOriginalText(e.clipboardData.getData("text"));
      setCurrentMaterialId(null);
    }
  };

  if (loading) return <p>Loading material...</p>;

  // --- Summarize ---
  const handleSummarize = async () => {
    if (!originalText.trim()) return;

    const token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to summarize!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/materials/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: originalText, material_id: currentMaterialId }),
      });

      const data = await res.json();

      if (res.ok && data.summary) {
        let formattedSummary = data.summary.replace(/\\n/g, "\n").replace(/- /g, "\n- ");
        setSummaryText(formattedSummary);

        // Save new material ID if it was created
        if (!currentMaterialId && data.id) {
          setCurrentMaterialId(data.id);
        }
      } else {
        alert(data.error || "Failed to summarize.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while summarizing.");
    }
  };

  // --- Clear ---
  const handleClear = () => {
    setOriginalText("");
    setSummaryText("");
    setCurrentMaterialId(null);
    setQuestions([]);
    setShowQuiz(false);
  };

  // --- Copy as JSON with materialId ---
  const handleCopy = () => {
    if (!summaryText) return;

    const payload = JSON.stringify({
      materialId: currentMaterialId || null,
      content: summaryText,
    });

    navigator.clipboard.writeText(payload);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  // --- Download ---
  const handleDownload = () => {
    if (!summaryText) return;
    const element = document.createElement("a");
    const file = new Blob([summaryText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Generate Quiz ---
const handleTakeQuiz = async () => {
  if (!currentMaterialId) {
    alert("No material selected!");
    return;
  }

  setQuizLoading(true);

  try {
    const token = localStorage.getItem("access");
    const res = await axios.post(
      `/materials/${currentMaterialId}/generate-quiz/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("🔍 Quiz API response:", res.data);

    // Accept ANY valid field name the backend may return
    const quizData =
      res.data.quiz ??
      res.data.questions ??
      res.data.data ??
      res.data.result ??
      null;

    if (quizData && Array.isArray(quizData) && quizData.length > 0) {
      setQuestions(quizData);
      setShowQuiz(true);
    } else {
      alert("Quiz could not be generated. Empty or invalid response.");
    }
  } catch (err) {
    console.error("Error generating quiz:", err);
    alert("Network error or invalid summary.");
  } finally {
    setQuizLoading(false);
  }
};

  return (
    <div className={`summary-page ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setLoggedIn={setLoggedIn} />

      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>
      <div className="floating-shape shape3"></div>

      <div className="summary-container">
        <div className="summary-header">
          <h1 className="summary-title">Summary</h1>
          <p className={`summary-subtitle ${darkMode ? "dark" : ""}`}>
            Review the material, generate a concise summary, and test your understanding with a quiz.
          </p>
        </div>

        <div className="summary-body">
          <div className="summary-section">
            <h3>Original Text</h3>
            <textarea
              className="summary-input"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Original text appears here..."
            />
            <div className={`text-counter ${darkMode ? "dark" : ""}`}>
              {originalText.length} characters
            </div>
          </div>

          <div className="summary-section">
            <h3>Summary</h3>
            <div className="preview-actions">
              <button onClick={handleCopy}><FiCopy /> Copy</button>
              <button onClick={handleDownload}><FiDownload /> Download</button>
            </div>
            <textarea
              className="summary-output"
              value={summaryText}
              readOnly
              placeholder="Your summary will appear here..."
              style={{ whiteSpace: "pre-wrap" }}
            />
            <div className={`text-counter ${darkMode ? "dark" : ""}`}>
              {summaryText.length} characters
            </div>
          </div>
        </div>

        <div className={`info-box ${darkMode ? "dark" : ""}`}>
          Tip: Keep your paragraphs clear and concise for better summaries.
        </div>

        <div className="action-buttons">
          <button onClick={handleSummarize}><FiFileText /> Summarize</button>
          <button onClick={handleTakeQuiz} disabled={quizLoading}>
            <FiEdit2 /> {quizLoading ? "Generating..." : "Take Quiz"}
          </button>
          <button onClick={handleClear} className="clear-btn"><FiTrash2 /> Clear</button>
        </div>
      </div>

      {showQuiz && (
        <QuizModal
          darkMode={darkMode}
          questions={questions}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {toastVisible && (
        <div className={`toast ${darkMode ? "dark" : ""}`}>
          Summary copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
