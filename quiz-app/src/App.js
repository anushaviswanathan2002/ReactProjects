import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    category: '🌍 Geography',
    question: 'What is the capital city of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    answer: 'Canberra',
  },
  {
    id: 2,
    category: '🔬 Science',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    answer: 'Au',
  },
  {
    id: 3,
    category: '📚 History',
    question: 'In which year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    answer: '1945',
  },
  {
    id: 4,
    category: '🎬 Entertainment',
    question: 'Who directed the movie "Inception" (2010)?',
    options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Ridley Scott'],
    answer: 'Christopher Nolan',
  },
  {
    id: 5,
    category: '🔬 Science',
    question: 'How many bones are in the adult human body?',
    options: ['196', '206', '216', '226'],
    answer: '206',
  },
  {
    id: 6,
    category: '🌍 Geography',
    question: 'Which is the longest river in the world?',
    options: ['Amazon', 'Yangtze', 'Mississippi', 'Nile'],
    answer: 'Nile',
  },
  {
    id: 7,
    category: '🎨 Art & Literature',
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'],
    answer: 'Leonardo da Vinci',
  },
  {
    id: 8,
    category: '⚽ Sports',
    question: 'How many players are on a standard soccer team on the field?',
    options: ['9', '10', '11', '12'],
    answer: '11',
  },
  {
    id: 9,
    category: '💻 Technology',
    question: 'What does "HTTP" stand for?',
    options: [
      'HyperText Transfer Protocol',
      'High Transfer Text Protocol',
      'Hyper Technical Transfer Process',
      'HyperText Transmission Protocol',
    ],
    answer: 'HyperText Transfer Protocol',
  },
  {
    id: 10,
    category: '🔢 Mathematics',
    question: 'What is the value of π (Pi) to two decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    answer: '3.14',
  },
  {
    id: 11,
    category: '🎬 Entertainment',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Saturn', 'Jupiter', 'Mars'],
    answer: 'Mars',
  },
  {
    id: 12,
    category: '📚 History',
    question: 'Who was the first person to walk on the Moon?',
    options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn'],
    answer: 'Neil Armstrong',
  },
];

const TIMER_SECONDS = 15;

// ─── Utility ──────────────────────────────────────────────────────────────────
function getGrade(percentage) {
  if (percentage >= 90) return { letter: 'A+', label: 'Outstanding!', emoji: '🏆' };
  if (percentage >= 80) return { letter: 'A',  label: 'Excellent!',   emoji: '🌟' };
  if (percentage >= 70) return { letter: 'B',  label: 'Great Job!',   emoji: '😄' };
  if (percentage >= 60) return { letter: 'C',  label: 'Good Effort!', emoji: '👍' };
  if (percentage >= 50) return { letter: 'D',  label: 'Keep Trying!', emoji: '📖' };
  return                       { letter: 'F',  label: 'Study More!',  emoji: '💪' };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ProgressBar = ({ current, total }) => {
  const pct = ((current) / total) * 100;
  return (
    <div className="progress-wrapper">
      <div className="progress-labels">
        <span>Question {current} of {total}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-dots">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < current ? 'done' : ''} ${i === current - 1 ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

const TimerRing = ({ timeLeft, total }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / total) * circumference;
  const danger = timeLeft <= 5;
  const warning = timeLeft <= 10;

  return (
    <div className={`timer-ring ${danger ? 'danger' : warning ? 'warning' : ''}`}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} className="timer-track" />
        <circle
          cx="36" cy="36" r={radius}
          className="timer-fill"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>
      <span className="timer-text">{timeLeft}</span>
    </div>
  );
};

const OptionButton = ({ label, text, selected, correct, revealed, disabled, onClick }) => {
  let cls = 'option-btn';
  if (revealed) {
    if (correct)                    cls += ' correct';
    else if (selected && !correct)  cls += ' wrong';
    else                            cls += ' faded';
  } else if (selected) {
    cls += ' selected';
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      <span className="option-label">{label}</span>
      <span className="option-text">{text}</span>
      {revealed && correct  && <span className="option-icon">✓</span>}
      {revealed && selected && !correct && <span className="option-icon">✗</span>}
    </button>
  );
};

// ─── Welcome Screen ───────────────────────────────────────────────────────────
const WelcomeScreen = ({ onStart, total }) => (
  <div className="screen welcome-screen animate-in">
    <div className="welcome-icon">🧠</div>
    <h1 className="welcome-title">Quiz Challenge</h1>
    <p className="welcome-subtitle">Test your knowledge across multiple categories!</p>

    <div className="welcome-stats">
      <div className="stat-card">
        <span className="stat-num">{total}</span>
        <span className="stat-label">Questions</span>
      </div>
      <div className="stat-card">
        <span className="stat-num">15s</span>
        <span className="stat-label">Per Question</span>
      </div>
      <div className="stat-card">
        <span className="stat-num">4</span>
        <span className="stat-label">Options Each</span>
      </div>
    </div>

    <div className="categories-preview">
      <p className="categories-heading">Categories covered:</p>
      <div className="categories-list">
        {[...new Set(QUESTIONS.map(q => q.category))].map(cat => (
          <span key={cat} className="category-chip">{cat}</span>
        ))}
      </div>
    </div>

    <button className="btn-primary" onClick={onStart}>
      Start Quiz →
    </button>
  </div>
);

// ─── Question Screen ──────────────────────────────────────────────────────────
const QuestionScreen = ({
  question, questionIndex, total,
  timeLeft, selected, revealed,
  onSelect, onNext, score,
}) => {
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="screen question-screen animate-in">
      {/* Header */}
      <div className="q-header">
        <div className="score-badge">
          <span className="score-icon">⭐</span>
          <span>{score} / {questionIndex}</span>
        </div>
        <TimerRing timeLeft={timeLeft} total={TIMER_SECONDS} />
      </div>

      {/* Progress */}
      <ProgressBar current={questionIndex} total={total} />

      {/* Card */}
      <div className="question-card">
        <span className="category-badge">{question.category}</span>
        <h2 className="question-text">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="options-grid">
        {question.options.map((opt, i) => (
          <OptionButton
            key={opt}
            label={labels[i]}
            text={opt}
            selected={selected === opt}
            correct={opt === question.answer}
            revealed={revealed}
            disabled={revealed}
            onClick={() => onSelect(opt)}
          />
        ))}
      </div>

      {/* Next button */}
      {revealed && (
        <button className="btn-primary next-btn animate-in" onClick={onNext}>
          {questionIndex === total ? 'See Results 🎉' : 'Next Question →'}
        </button>
      )}

      {/* Feedback banner */}
      {revealed && (
        <div className={`feedback-banner animate-in ${selected === question.answer ? 'feedback-correct' : 'feedback-wrong'}`}>
          {selected === question.answer
            ? '🎉 Correct! Well done!'
            : `❌ The correct answer was: ${question.answer}`}
        </div>
      )}
    </div>
  );
};

// ─── Results Screen ───────────────────────────────────────────────────────────
const ResultsScreen = ({ score, total, answers, questions, onRestart }) => {
  const percentage = Math.round((score / total) * 100);
  const grade = getGrade(percentage);

  return (
    <div className="screen results-screen animate-in">
      <div className="results-hero">
        <div className="grade-circle">
          <span className="grade-emoji">{grade.emoji}</span>
          <span className="grade-letter">{grade.letter}</span>
        </div>
        <h2 className="results-title">{grade.label}</h2>
        <p className="results-subtitle">You scored</p>
        <div className="results-score">
          <span className="score-big">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{total}</span>
        </div>
        <div className="results-percentage">{percentage}%</div>
      </div>

      {/* Stats row */}
      <div className="results-stats">
        <div className="res-stat correct-stat">
          <span className="res-stat-num">{score}</span>
          <span className="res-stat-label">Correct</span>
        </div>
        <div className="res-stat wrong-stat">
          <span className="res-stat-num">{total - score}</span>
          <span className="res-stat-label">Wrong</span>
        </div>
        <div className="res-stat pct-stat">
          <span className="res-stat-num">{percentage}%</span>
          <span className="res-stat-label">Score</span>
        </div>
      </div>

      {/* Answer review */}
      <div className="review-section">
        <h3 className="review-heading">Question Review</h3>
        <div className="review-list">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={q.id} className={`review-item ${isCorrect ? 'review-correct' : 'review-wrong'}`}>
                <div className="review-meta">
                  <span className="review-cat">{q.category}</span>
                  <span className="review-icon">{isCorrect ? '✓' : '✗'}</span>
                </div>
                <p className="review-q">{q.question}</p>
                <p className="review-answer">
                  <strong>Your answer:</strong>{' '}
                  <span className={isCorrect ? 'ans-correct' : 'ans-wrong'}>
                    {userAnswer || 'No answer (timed out)'}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="review-correct-ans">
                    <strong>Correct:</strong> <span className="ans-correct">{q.answer}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-primary restart-btn" onClick={onRestart}>
        🔄 Play Again
      </button>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState('welcome');      // welcome | quiz | results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const timerRef = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const revealAnswer = useCallback((choice) => {
    clearTimer();
    setSelected(choice);
    setRevealed(true);
    if (choice === questions[currentIndex]?.answer) {
      setScore(prev => prev + 1);
    }
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIndex] = choice;
      return updated;
    });
  }, [questions, currentIndex]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'quiz' || revealed) return;
    setTimeLeft(TIMER_SECONDS);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          revealAnswer(null); // timed out — no answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [phase, currentIndex, revealed, revealAnswer]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleStart = () => {
    const shuffled = shuffleArray(QUESTIONS);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswers(Array(shuffled.length).fill(null));
    setSelected(null);
    setRevealed(false);
    setPhase('quiz');
  };

  const handleSelect = (option) => {
    if (revealed) return;
    revealAnswer(option);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setPhase('results');
    } else {
      setSelected(null);
      setRevealed(false);
      setCurrentIndex(nextIndex);
    }
  };

  const handleRestart = () => {
    clearTimer();
    setPhase('welcome');
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-root">
      <div className="app-container">
        {phase === 'welcome' && (
          <WelcomeScreen onStart={handleStart} total={QUESTIONS.length} />
        )}
        {phase === 'quiz' && questions.length > 0 && (
          <QuestionScreen
            question={questions[currentIndex]}
            questionIndex={currentIndex + 1}
            total={questions.length}
            timeLeft={timeLeft}
            selected={selected}
            revealed={revealed}
            onSelect={handleSelect}
            onNext={handleNext}
            score={score}
          />
        )}
        {phase === 'results' && (
          <ResultsScreen
            score={score}
            total={questions.length}
            answers={answers}
            questions={questions}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
