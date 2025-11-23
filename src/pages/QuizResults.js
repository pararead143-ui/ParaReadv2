import React from "react";
import "../styles/Quiz.css";

const QuizResults = ({ darkMode, questions = [], answers, onClose, onRetake }) => {
  if (!questions || questions.length === 0) return null;

  // Add `correctAnswer` for each question to match your API
  const quizWithCorrect = questions.map(q => ({
    ...q,
    correctAnswer: q.answer // use the field returned from your backend
  }));

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    quizWithCorrect.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / quizWithCorrect.length) * 100);

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

        {/* Score and questions */}
        <div className="quiz-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <h3>Your Score: {score} / {quizWithCorrect.length} ({percentage}%)</h3>
          {percentage >= 70 ? (
            <p style={{ color: "green" }}>Great job! 🎉</p>
          ) : (
            <p style={{ color: "red" }}>Keep practicing! 💡</p>
          )}

          {quizWithCorrect.map((q, idx) => {
            const userAnswer = answers[q.id];

            return (
              <div key={idx} className="results-question">
                <p className="question-text">{q.question}</p>
                <ul>
                  {q.options.map((opt, i) => {
                    const optionLetter = opt[0]; // "A", "B", etc.
                    const correct = optionLetter === q.correctAnswer;
                    const selected = optionLetter === userAnswer;

                    let style = {};
                    if (correct) style = { color: "green", fontWeight: "bold" };
                    else if (selected && !correct)
                      style = { color: "red", textDecoration: "line-through" };

                    return (
                      <li key={i} style={style}>
                        {opt} {correct ? "✅" : selected && !correct ? "❌" : ""}
                      </li>
                    );
                  })}
                </ul>
                <hr />
              </div>
            );
          })}
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
