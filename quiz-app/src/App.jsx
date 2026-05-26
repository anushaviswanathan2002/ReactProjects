import { useState, useEffect, useCallback } from "react";
import "./App.css";

const quizData = [
  {
    id: 1,
    category: "General Knowledge",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: "Canberra",
  },
  {
    id: 2,
    category: "Science",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: "Au",
  },
  {
    id: 3,
    category: "History",
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    answer: "1945",
  },
  {
    id: 4,
    category: "Science",
    question: "How many bones are in the adult human body?",
    options: ["196", "206", "216", "226"],
    answer: "206",
  },
  {
    id: 5,
    category: "General Knowledge",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Saturn", "Mars"],
    answer: "Mars",
  },
  {
    id: 6,
    category: "History",
    question: "Who was the first President of the United States?",
    options: [
      "Thomas Jefferson",
      "Abraham Lincoln",
      "George Washington",
      "John Adams",
    ],
    answer: "George Washington",
  },
  {
    id: 7,
    category: "Science",
    question: "What is the speed of light in a vacuum (approximately)?",
    options: [
      "150,000 km/s",
      "200,000 km/s",
      "300,000 km/s",
      "400,000 km/s",
    ],
    answer: "300,000 km/s",
  },
  {
    id: 8,
    category: "General Knowledge",
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    answer: "6",
  },
  {
    id: 9,
    category: "History",
    question: "Which ancient wonder was located in Alexandria, Egypt?",
    options: [
      "The Colossus of Rhodes",
      "The Hanging Gardens",
      "The Great Lighthouse",
      "The Statue of Zeus",
    ],
    answer: "The Great Lighthouse",
  },
  {
    id: 10,
    category: "Science",
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"],
    answer: "Nitrogen",
  },
];

const QUESTION_TIME = 15;

const categoryColors = {
  "General Knowledge": "category--general",
  Science: "category--science",
  History: "category--history",
};

function getScoreMessage(percentage) {
  if (percentage === 100) return "Perfect Score! Outstanding! 🏆";
  if (percentage >= 80) return "Excellent Work! 🎉";
  if (percentage >= 60) return "Good Job! Keep it up! 👍";
  if (percentage >= 40) return "Not Bad! Keep practicing! 📚";
  return "Keep Learning! You'll get there! 💪";
}

export default function App() {
  const [screen, setScreen] = useState("start"); // "start" | "quiz" | "results"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timedOut, setTimedOut] = useState(false);

  const totalQuestions = quizData.length;
  const currentQuestion = quizData[currentIndex];

  const handleTimesUp = useCallback(() => {
    if (!isAnswered) {
      setTimedOut(true);
      setIsAnswered(true);
    }
  }, [isAnswered]);

  useEffect(() => {
    if (screen !== "quiz" || isAnswered) return;

    if (timeLeft === 0) {
      handleTimesUp();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [screen, timeLeft, isAnswered, handleTimesUp]);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setTimedOut(false);
    if (option === currentQuestion.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setScreen("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimedOut(false);
      setTimeLeft(QUESTION_TIME);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimedOut(false);
    setScore(0);
    setTimeLeft(QUESTION_TIME);
    setScreen("start");
  };

  const getOptionClass = (option) => {
    if (!isAnswered) return "option-btn";
    if (option === currentQuestion.answer) return "option-btn option-btn--correct";
    if (option === selectedOption) return "option-btn option-btn--wrong";
    return "option-btn option-btn--disabled";
  };

  const timerPercentage = (timeLeft / QUESTION_TIME) * 100;
  const timerClass =
    timeLeft <= 5
      ? "timer-bar timer-bar--danger"
      : timeLeft <= 10
      ? "timer-bar timer-bar--warning"
      : "timer-bar";

  const percentage = Math.round((score / totalQuestions) * 100);

  // ── Start Screen ──────────────────────────────────────────────
  if (screen === "start") {
    return (
      <div className="app">
        <div className="card start-card">
          <div className="start-icon">🧠</div>
          <h1 className="start-title">Quiz Challenge</h1>
          <p className="start-subtitle">
            Test your knowledge across General Knowledge, Science &amp; History
          </p>
          <ul className="start-info">
            <li>
              <span className="info-icon">📋</span>
              {totalQuestions} multiple-choice questions
            </li>
            <li>
              <span className="info-icon">⏱️</span>
              {QUESTION_TIME} seconds per question
            </li>
            <li>
              <span className="info-icon">✅</span>
              Instant feedback on every answer
            </li>
          </ul>
          <button
            className="btn btn--primary btn--lg"
            onClick={() => setScreen("quiz")}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────────
  if (screen === "results") {
    return (
      <div className="app">
        <div className="card results-card">
          <div className="results-trophy">
            {percentage === 100 ? "🏆" : percentage >= 60 ? "🎉" : "📚"}
          </div>
          <h2 className="results-title">Quiz Complete!</h2>
          <p className="results-message">{getScoreMessage(percentage)}</p>

          <div className="score-circle">
            <span className="score-circle__value">{percentage}%</span>
            <span className="score-circle__label">Score</span>
          </div>

          <div className="results-stats">
            <div className="stat-item">
              <span className="stat-value stat-value--correct">{score}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value stat-value--wrong">
                {totalQuestions - score}
              </span>
              <span className="stat-label">Wrong</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{totalQuestions}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>

          <button
            className="btn btn--primary btn--lg"
            onClick={handleRestart}
          >
            🔄 Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ───────────────────────────────────────────────
  return (
    <div className="app">
      <div className="card quiz-card">
        {/* Header */}
        <div className="quiz-header">
          <span
            className={`category-badge ${
              categoryColors[currentQuestion.category] ?? ""
            }`}
          >
            {currentQuestion.category}
          </span>
          <span className="progress-text">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Timer */}
        <div className="timer-section">
          <div className="timer-track">
            <div
              className={timerClass}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          <span
            className={`timer-label ${
              timeLeft <= 5 ? "timer-label--danger" : ""
            }`}
          >
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Question */}
        <h2 className="question-text">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="options-grid">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              className={getOptionClass(option)}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div
            className={`feedback ${
              timedOut
                ? "feedback--timeout"
                : selectedOption === currentQuestion.answer
                ? "feedback--correct"
                : "feedback--wrong"
            }`}
          >
            {timedOut ? (
              <>
                ⏰ Time's up! The correct answer was{" "}
                <strong>{currentQuestion.answer}</strong>
              </>
            ) : selectedOption === currentQuestion.answer ? (
              <>✅ Correct! Well done!</>
            ) : (
              <>
                ❌ Wrong! The correct answer is{" "}
                <strong>{currentQuestion.answer}</strong>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="quiz-footer">
          <span className="score-label">
            Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
          </span>
          {isAnswered && (
            <button className="btn btn--primary" onClick={handleNext}>
              {currentIndex + 1 >= totalQuestions ? "See Results →" : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
