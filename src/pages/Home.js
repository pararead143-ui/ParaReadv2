// src/pages/Home.js
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2"; // ✅ ADDED
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Folder,
  ChevronDown,
  FileText,
  RefreshCcw,
  Layers,
  Info,
  Copy,
  Download,
} from "lucide-react";
import "../styles/Home.css";
import { segmentTextAPI } from "../api/materialsApi";
import { useMaterial } from "../context/MaterialContext";

const Home = ({ darkMode, toggleDarkMode, setLoggedIn }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { currentMaterialId, setCurrentMaterialId } = useMaterial();

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // ✅ ADDED: store AbortController for uploads
  const uploadAbortRef = useRef(null);

  // ✅ ADDED: abort any in-flight upload if Home unmounts
  useEffect(() => {
    return () => {
      if (uploadAbortRef.current) {
        uploadAbortRef.current.abort();
      }
    };
  }, []);

  // ✅ ADDED: file validation rules
  const MAX_FILE_MB = 30;
  const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

  // You can adjust this list depending on what your backend supports
  const ALLOWED_MIME_TYPES = new Set([
    "application/pdf", // .pdf
    "text/plain", // .txt
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    // ✅ add these
  "image/png",
  "image/jpeg",
  "image/jpg",
    
  ]);

  const showFileError = (title, text) => {
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#7b2cbf",
    });
  };

  // --------------------------
  // FILE UPLOAD (NO SAVING!)
  // --------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ ADDED: validate file size
    if (file.size > MAX_FILE_BYTES) {
      showFileError(
        "File too large",
        `Please upload a file smaller than ${MAX_FILE_MB}MB.`
      );
      // allow re-selecting the same file
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // ✅ ADDED: validate file type
    // Some browsers may give empty type for unknown files; treat as unsupported
    if (!file.type || !ALLOWED_MIME_TYPES.has(file.type)) {
      showFileError("Unsupported file", "Supported files: PDF, TXT, DOC, DOCX.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadedFile(file);
    setTextInput("");
    setTitleInput(file.name);
    setCurrentMaterialId(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        showToastMessage("You are not logged in!");
        return;
      }

      // ✅ cancel previous upload request (if any)
      if (uploadAbortRef.current) {
        uploadAbortRef.current.abort();
      }
      uploadAbortRef.current = new AbortController();

      const res = await fetch(
        "http://localhost:8000/api/materials/upload-file/",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
          signal: uploadAbortRef.current.signal,
        }
      );

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);

      if (res.ok) {
        setTextInput(data.cleaned_text || "");
        setCurrentMaterialId(null);
        showToastMessage("File uploaded and extracted successfully!");
      } else {
        showToastMessage(data.error || "Upload failed");
      }
    } catch (err) {
      if (err?.name === "AbortError") return;

      console.error(err);
      showToastMessage("Network error while uploading");
    } finally {
      setIsProcessing(false);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload({ target: { files: [file] } });
  };

  // --------------------------
  // SEGMENT (SAVES TO DB ONCE)
  // --------------------------
  const handleSegment = async () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);

    try {
      const res = await segmentTextAPI(textInput, titleInput);

      const segmentedData = res.data.segmented_data;

      const formatted = segmentedData
        .map(
          (seg, i) =>
            `Segment ${i + 1}:\n${seg.segment}\n\nExplanation: ${seg.explanation}\nKey Terms: ${seg.key_terms.join(
              ", "
            )}\nExample: ${seg.example}`
        )
        .join("\n\n--------------------------------\n\n");

      setTextInput(formatted);
      setCurrentMaterialId(res.data.id);
      showToastMessage("Segmentation completed!");
    } catch (error) {
      console.error(error);
      showToastMessage("Segmentation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --------------------------
  // SUMMARIZE
  // --------------------------
  const handleSummarize = () => {
    if (!textInput.trim()) return;

    if (!currentMaterialId) {
      showToastMessage("No material available to summarize!");
      return;
    }

    navigate(`/summary/${currentMaterialId}`);
  };

  // --------------------------
  // CLEAR
  // --------------------------
  const handleClear = () => {
    setTextInput("");
    setUploadedFile(null);
    setTitleInput("");
    setCurrentMaterialId(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ optional reset
  };

  // --------------------------
  // COPY / DOWNLOAD (JSON with materialId)
  // --------------------------
  const handleCopy = () => {
    if (!textInput.trim()) return;

    const payload = JSON.stringify({
      materialId: currentMaterialId || null,
      content: textInput,
    });

    navigator.clipboard.writeText(payload);
    showToastMessage("Copied!");
  };

  const handleDownload = () => {
    if (!textInput.trim()) return;

    const blob = new Blob([textInput], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "text.txt";
    link.click();
    showToastMessage("Download started!");
  };

  const wordCount = textInput.split(/\s+/).filter(Boolean).length;
  const charCount = textInput.length;

  return (
    <div
      className={`home-container ${darkMode ? "dark" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setLoggedIn={setLoggedIn}
      />

      <div className={`home-content ${darkMode ? "dark" : ""}`}>
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>

        <h1 className={`home-title ${darkMode ? "dark" : ""}`}>
          READ SMARTER <br />
          UNDERSTAND BETTER
        </h1>

        <p className={`home-subtitle ${darkMode ? "dark" : ""}`}>
          Paste your text, upload a file, or try our tools below.
          <span
            className="tooltip-icon-inline"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info size={16} />
          </span>
        </p>

        {showTooltip && (
          <div className={`tooltip ${darkMode ? "dark" : ""}`}>
            Tip: Segment splits sentences. Summarize redirects to summary page.
          </div>
        )}

        <div className="upload-section">
          <div className="upload-group">
            <label
              className={`upload-main ${darkMode ? "dark" : ""}`}
              onClick={openFilePicker}
            >
              <span className="upload-icon">
                <Folder size={16} />
              </span>
              <span className="upload-text">Upload</span>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>

            <button
              type="button"
              className={`upload-dropdown ${darkMode ? "dark" : ""}`}
              onClick={openFilePicker}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* ✅ has-actions class already applied */}
        <div
          className={`work-box ${
            textInput.trim() ? "has-actions" : ""
          } ${darkMode ? "dark" : ""}`}
        >
          {textInput.trim() && (
            <div className="preview-actions">
              {/* ✅ UPDATED: add class + wrap label in span */}
              <button
                className="preview-btn"
                onClick={handleCopy}
                aria-label="Copy"
              >
                <Copy size={16} />
                <span className="btn-text">Copy</span>
              </button>

              <button
                className="preview-btn"
                onClick={handleDownload}
                aria-label="Download"
              >
                <Download size={16} />
                <span className="btn-text">Download</span>
              </button>
            </div>
          )}

          <textarea
            className={`text-input ${darkMode ? "dark" : ""}`}
            placeholder="Paste here or drag a file..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          <div className={`text-counter ${darkMode ? "dark" : ""}`}>
            {wordCount} words | {charCount} characters
          </div>

          {isProcessing && <div className="processing">Processing...</div>}
        </div>

        <div className="action-buttons-right">
          <button onClick={handleSummarize}>
            <FileText size={18} /> Summarize
          </button>
          <button onClick={handleSegment}>
            <Layers size={18} /> Segment
          </button>
          <button onClick={handleClear}>
            <RefreshCcw size={18} /> Clear
          </button>
        </div>

        <div className={`info-box ${darkMode ? "dark" : ""}`}>
          {uploadedFile ? (
            <p>Recent Upload: {uploadedFile.name}</p>
          ) : (
            <p>Upload a file to get started.</p>
          )}
        </div>
      </div>

      {showToast && (
        <div className={`toast ${darkMode ? "dark" : ""}`}>{toastMessage}</div>
      )}
    </div>
  );
};

export default Home;
