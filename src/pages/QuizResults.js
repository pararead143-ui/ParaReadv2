import React from "react";
import "../styles/Quiz.css";

const QuizResults = ({ darkMode, questions = [], answers, onClose, onRetake }) => {
  if (!questions || questions.length === 0) return null;

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const score = calculateScore();

  return (
    <div className={`quiz-modal ${darkMode ? "dark" : ""}`}>
      <div className="quiz-overlay" onClick={onClose}></div>

      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <h2>Quiz Results</h2>
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>

        {/* Score */}
        <div className="quiz-body">
          <h3>Your Score: {score} / {questions.length}</h3>

          {questions.map((q, idx) => (
            <div key={idx} className="results-question">
              <p className="question-text">{q.question}</p>
              <p>
                Your Answer: <strong>{answers[q.id] || "Not answered"}</strong>
              </p>
              <p>
                Correct Answer: <strong>{q.correctAnswer}</strong>
              </p>
              <hr />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="quiz-footer">
          <button onClick={onRetake}>Retake Quiz</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
