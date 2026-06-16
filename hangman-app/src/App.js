import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// ─── Word Bank ───────────────────────────────────────────────────────────────
const WORD_BANK = [
  // Animals
  { word: 'ELEPHANT',   category: 'Animals' },
  { word: 'GIRAFFE',    category: 'Animals' },
  { word: 'PENGUIN',    category: 'Animals' },
  { word: 'CROCODILE',  category: 'Animals' },
  { word: 'CHEETAH',    category: 'Animals' },
  { word: 'DOLPHIN',    category: 'Animals' },
  // Countries
  { word: 'BRAZIL',     category: 'Countries' },
  { word: 'PORTUGAL',   category: 'Countries' },
  { word: 'INDONESIA',  category: 'Countries' },
  { word: 'ARGENTINA',  category: 'Countries' },
  { word: 'KENYA',      category: 'Countries' },
  { word: 'VIETNAM',    category: 'Countries' },
  // Fruits
  { word: 'MANGO',      category: 'Fruits' },
  { word: 'PAPAYA',     category: 'Fruits' },
  { word: 'BLUEBERRY',  category: 'Fruits' },
  { word: 'PINEAPPLE',  category: 'Fruits' },
  { word: 'WATERMELON', category: 'Fruits' },
  { word: 'RASPBERRY',  category: 'Fruits' },
  // Sports
  { word: 'BASKETBALL', category: 'Sports' },
  { word: 'VOLLEYBALL', category: 'Sports' },
  { word: 'BADMINTON',  category: 'Sports' },
  { word: 'SWIMMING',   category: 'Sports' },
  { word: 'GYMNASTICS', category: 'Sports' },
  { word: 'WRESTLING',  category: 'Sports' },
  // Technology
  { word: 'JAVASCRIPT', category: 'Technology' },
  { word: 'KEYBOARD',   category: 'Technology' },
  { word: 'ALGORITHM',  category: 'Technology' },
  { word: 'DATABASE',   category: 'Technology' },
  // Movies
  { word: 'INCEPTION',  category: 'Movies' },
  { word: 'GLADIATOR',  category: 'Movies' },
  { word: 'INTERSTELLAR', category: 'Movies' },
  { word: 'PARASITE',   category: 'Movies' },
];

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─── SVG Hangman Drawing ─────────────────────────────────────────────────────
function HangmanSVG({ wrongCount }) {
  const strokeProps = {
    stroke: '#00f5ff',
    strokeWidth: '4',
    strokeLinecap: 'round',
    fill: 'none',
  };
  const ropeProps = {
    stroke: '#a78bfa',
    strokeWidth: '4',
    strokeLinecap: 'round',
    fill: 'none',
  };

  return (
    <svg
      viewBox="0 0 220 280"
      className="hangman-svg"
      aria-label={`Hangman drawing: ${wrongCount} wrong guesses`}
    >
      {/* Gallows — always visible */}
      {/* Base */}
      <line x1="10" y1="270" x2="210" y2="270" {...strokeProps} stroke="#4ade80" />
      {/* Vertical pole */}
      <line x1="60" y1="270" x2="60"  y2="20"  {...strokeProps} stroke="#4ade80" />
      {/* Horizontal beam */}
      <line x1="60" y1="20"  x2="150" y2="20"  {...strokeProps} stroke="#4ade80" />
      {/* Diagonal brace */}
      <line x1="60" y1="60"  x2="100" y2="20"  {...strokeProps} stroke="#4ade80" />
      {/* Rope */}
      <line x1="150" y1="20" x2="150" y2="55"  {...ropeProps} />

      {/* 1 — Head */}
      {wrongCount >= 1 && (
        <circle
          cx="150" cy="75" r="20"
          stroke="#f472b6" strokeWidth="4" fill="none"
        />
      )}

      {/* 2 — Body */}
      {wrongCount >= 2 && (
        <line x1="150" y1="95" x2="150" y2="175" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" fill="none" />
      )}

      {/* 3 — Left Arm */}
      {wrongCount >= 3 && (
        <line x1="150" y1="115" x2="115" y2="150" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" fill="none" />
      )}

      {/* 4 — Right Arm */}
      {wrongCount >= 4 && (
        <line x1="150" y1="115" x2="185" y2="150" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" fill="none" />
      )}

      {/* 5 — Left Leg */}
      {wrongCount >= 5 && (
        <line x1="150" y1="175" x2="115" y2="225" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" fill="none" />
      )}

      {/* 6 — Right Leg */}
      {wrongCount >= 6 && (
        <line x1="150" y1="175" x2="185" y2="225" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" fill="none" />
      )}

      {/* X eyes when dead */}
      {wrongCount >= 6 && (
        <>
          <line x1="141" y1="68" x2="147" y2="74" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="147" y1="68" x2="141" y2="74" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="153" y1="68" x2="159" y2="74" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="159" y1="68" x2="153" y2="74" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
          {/* Sad mouth */}
          <path d="M 141 83 Q 150 78 159 83" stroke="#ff4444" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Smile when alive and head visible */}
      {wrongCount >= 1 && wrongCount < 6 && (
        <path d="M 141 80 Q 150 87 159 80" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// ─── Word Display ─────────────────────────────────────────────────────────────
function WordDisplay({ word, guessedLetters, gameOver }) {
  return (
    <div className="word-display">
      {word.split('').map((letter, idx) => {
        const revealed = guessedLetters.includes(letter) || gameOver;
        const correct  = guessedLetters.includes(letter);
        return (
          <span
            key={idx}
            className={`letter-box ${revealed ? (correct ? 'correct' : 'revealed-lost') : ''}`}
          >
            <span className="letter-char">
              {revealed ? letter : ''}
            </span>
          </span>
        );
      })}
    </div>
  );
}

// ─── On-Screen Keyboard ───────────────────────────────────────────────────────
function Keyboard({ guessedLetters, wrongLetters, onGuess, disabled }) {
  return (
    <div className="keyboard">
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        const isWrong   = wrongLetters.includes(letter);
        const isCorrect = isGuessed && !isWrong;
        return (
          <button
            key={letter}
            className={`key-btn ${isWrong ? 'key-wrong' : ''} ${isCorrect ? 'key-correct' : ''}`}
            onClick={() => onGuess(letter)}
            disabled={isGuessed || disabled}
            aria-label={`Guess letter ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

// ─── Wrong Letters Display ────────────────────────────────────────────────────
function WrongLetters({ wrongLetters }) {
  return (
    <div className="wrong-letters-container">
      <span className="wrong-label">Wrong:</span>
      <div className="wrong-letters">
        {wrongLetters.length === 0
          ? <span className="no-wrong">None yet</span>
          : wrongLetters.map((l) => (
              <span key={l} className="wrong-letter-chip">{l}</span>
            ))
        }
      </div>
    </div>
  );
}

// ─── Score Board ──────────────────────────────────────────────────────────────
function ScoreBoard({ wins, losses }) {
  return (
    <div className="scoreboard">
      <div className="score-item wins">
        <span className="score-icon">🏆</span>
        <span className="score-value">{wins}</span>
        <span className="score-label">Wins</span>
      </div>
      <div className="score-divider">|</div>
      <div className="score-item losses">
        <span className="score-icon">💀</span>
        <span className="score-value">{losses}</span>
        <span className="score-label">Losses</span>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function WrongGuessBar({ wrongCount }) {
  const pct = (wrongCount / MAX_WRONG) * 100;
  const color =
    pct <= 33 ? '#4ade80' :
    pct <= 66 ? '#facc15' :
    '#f87171';

  return (
    <div className="wrong-bar-container">
      <div className="wrong-bar-track">
        <div
          className="wrong-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="wrong-bar-label" style={{ color }}>
        {wrongCount} / {MAX_WRONG} wrong
      </span>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function getRandomEntry() {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

export default function App() {
  const [entry,         setEntry]         = useState(() => getRandomEntry());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wins,          setWins]          = useState(0);
  const [losses,        setLosses]        = useState(0);
  const [showHint,      setShowHint]      = useState(false);
  const [particles,     setParticles]     = useState([]);

  const { word, category } = entry;

  const wrongLetters = guessedLetters.filter((l) => !word.includes(l));
  const wrongCount   = wrongLetters.length;
  const isWon        = word.split('').every((l) => guessedLetters.includes(l));
  const isLost       = wrongCount >= MAX_WRONG;
  const gameOver     = isWon || isLost;

  // Score tracking — run once when game ends
  const [scored, setScored] = useState(false);
  useEffect(() => {
    if (isWon && !scored) {
      setWins((w) => w + 1);
      setScored(true);
      spawnParticles();
    }
    if (isLost && !scored) {
      setLosses((l) => l + 1);
      setScored(true);
    }
  }, [isWon, isLost, scored]);

  // Particle celebration
  function spawnParticles() {
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: ['#f472b6', '#a78bfa', '#4ade80', '#00f5ff', '#facc15'][Math.floor(Math.random() * 5)],
    }));
    setParticles(p);
    setTimeout(() => setParticles([]), 3000);
  }

  // New game
  const newGame = useCallback(() => {
    setEntry(getRandomEntry());
    setGuessedLetters([]);
    setShowHint(false);
    setScored(false);
    setParticles([]);
  }, []);

  // Handle a letter guess
  const handleGuess = useCallback((letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;
    setGuessedLetters((prev) => [...prev, letter]);
  }, [gameOver, guessedLetters]);

  // Physical keyboard support
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) handleGuess(key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleGuess]);

  // ── Render ──
  return (
    <div className="app">
      {/* Particle overlay */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}

      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-hang">HANG</span>
          <span className="title-man">MAN</span>
        </h1>
        <ScoreBoard wins={wins} losses={losses} />
      </header>

      <main className="game-area">
        {/* Left column — SVG + info */}
        <section className="left-col">
          <HangmanSVG wrongCount={wrongCount} />
          <WrongGuessBar wrongCount={wrongCount} />

          <div className="category-hint">
            <span className="category-label">Category:</span>
            <span className="category-value">{category}</span>
          </div>

          <button
            className="hint-btn"
            onClick={() => setShowHint((h) => !h)}
            disabled={showHint}
          >
            {showHint ? `Hint: "${category}"` : '💡 Show Hint'}
          </button>

          <WrongLetters wrongLetters={wrongLetters} />
        </section>

        {/* Right column — word + keyboard */}
        <section className="right-col">
          {/* Status banner */}
          {gameOver && (
            <div className={`status-banner ${isWon ? 'banner-win' : 'banner-lose'}`}>
              {isWon
                ? <>🎉 <span>You Won!</span> The word was <strong>{word}</strong>!</>
                : <>💀 <span>Game Over!</span> The word was <strong>{word}</strong>.</>
              }
            </div>
          )}

          {!gameOver && (
            <p className="guess-prompt">
              Guess the <span className="prompt-highlight">{word.length}-letter</span> word!
            </p>
          )}

          <WordDisplay
            word={word}
            guessedLetters={guessedLetters}
            gameOver={isLost}
          />

          <div className="letters-remaining">
            {!gameOver && (
              <span>
                Letters left:{' '}
                <strong>
                  {ALPHABET.filter((l) => !guessedLetters.includes(l)).length}
                </strong>
              </span>
            )}
          </div>

          <Keyboard
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            onGuess={handleGuess}
            disabled={gameOver}
          />

          <button className="new-game-btn" onClick={newGame}>
            🔄 New Game
          </button>

          <p className="keyboard-tip">⌨️ You can also use your physical keyboard!</p>
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React · Hangman Game</p>
      </footer>
    </div>
  );
}
