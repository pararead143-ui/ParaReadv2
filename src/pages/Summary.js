// src/pages/SummaryPage.js
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"; // ✅ ADDED
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

  const [isSummarizing, setIsSummarizing] = useState(false);

  const summarizeAbortRef = useRef(null);
  const quizAbortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (summarizeAbortRef.current) summarizeAbortRef.current.abort();
      if (quizAbortRef.current) quizAbortRef.current.abort();
    };
  }, []);

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

  const handleSummarize = async () => {
    if (!originalText.trim()) return;

    const token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to summarize!");
      return;
    }

    setIsSummarizing(true);

    try {
      if (summarizeAbortRef.current) summarizeAbortRef.current.abort();
      summarizeAbortRef.current = new AbortController();

      const res = await fetch("http://localhost:8000/api/materials/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: originalText, material_id: currentMaterialId }),
        signal: summarizeAbortRef.current.signal,
      });

      const data = await res.json();

      if (res.ok && data.summary) {
        let formattedSummary = data.summary.replace(/\\n/g, "\n").replace(/- /g, "\n- ");
        setSummaryText(formattedSummary);

        if (!currentMaterialId && data.id) {
          setCurrentMaterialId(data.id);
        }
      } else {
        alert(data.error || "Failed to summarize.");
      }
    } catch (err) {
      if (err?.name === "AbortError") return;

      console.error(err);
      alert("Network error while summarizing.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClear = () => {
    setOriginalText("");
    setSummaryText("");
    setCurrentMaterialId(null);
    setQuestions([]);
    setShowQuiz(false);
  };

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

  const handleTakeQuiz = async () => {
    if (!currentMaterialId) {
      Swal.fire({
        icon: "error",
        title: "No material selected",
        text: "Please summarize or select a material first before taking a quiz.",
        confirmButtonColor: "#7b2cbf",
      });
      return;
    }

    setQuizLoading(true);

    try {
      const token = localStorage.getItem("access");

      if (quizAbortRef.current) quizAbortRef.current.abort();
      quizAbortRef.current = new AbortController();

      const res = await axios.post(
        `/materials/${currentMaterialId}/generate-quiz/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: quizAbortRef.current.signal,
        }
      );

      console.log("🔍 Quiz API response:", res.data);

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
      if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
        return;
      }

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

            {isSummarizing && (
              <div className="processing">Summarizing...</div>
            )}

            <div className={`text-counter ${darkMode ? "dark" : ""}`}>
              {summaryText.length} characters
            </div>
          </div>
        </div>

        <div className={`info-box ${darkMode ? "dark" : ""}`}>
          Tip: Keep your paragraphs clear and concise for better summaries.
        </div>

        <div className="action-buttons">
          <button onClick={handleSummarize} disabled={isSummarizing}>
            <FiFileText /> {isSummarizing ? "Summarizing..." : "Summarize"}
          </button>

          <button onClick={handleTakeQuiz} disabled={quizLoading}>
            <FiEdit2 /> {quizLoading ? "Generating..." : "Take Quiz"}
          </button>

          <button onClick={handleClear} className="clear-btn">
            <FiTrash2 /> Clear
          </button>
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
