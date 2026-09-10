import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Theme definitions with different emoji sets
const THEMES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥏'],
  food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓', '🍒', '🍑'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑'],
  nature: ['🌹', '🌺', '🌻', '🌷', '🌼', '🌸', '🌞', '🌝'],
  arts: ['🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎸'],
};

// Difficulty configuration
const DIFFICULTIES = {
  easy: { rows: 3, cols: 4, timeLimit: 120 },
  medium: { rows: 4, cols: 4, timeLimit: 180 },
  hard: { rows: 4, cols: 6, timeLimit: 240 },
};

// Sound effects helper
const playSound = (type) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  
  switch(type) {
    case 'match':
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case 'wrong':
      oscillator.frequency.value = 300;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
    case 'win':
      for (let i = 0; i < 3; i++) {
        oscillator.frequency.value = 600 + (i * 100);
      }
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    default:
      break;
  }
};

function App() {
  // Game state
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('animals');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Timer and stats
  const [time, setTime] = useState(0);
  const [bestScores, setBestScores] = useState({});
  
  // New features
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hints, setHints] = useState(3);
  const [hintedCard, setHintedCard] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hintTimeoutRef = useRef(null);

  // Load best scores from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memoryGameScores');
    if (saved) {
      setBestScores(JSON.parse(saved));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || isPaused || gameWon) return;
    
    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, isPaused, gameWon]);

  // Initialize game when difficulty/theme changes
  useEffect(() => {
    const initGame = () => {
      const totalCards = DIFFICULTIES[difficulty].rows * DIFFICULTIES[difficulty].cols;
      const selectedEmojis = THEMES[theme];
      const numPairs = totalCards / 2;
      
      const emojiPairs = selectedEmojis.slice(0, numPairs);
      const cardPairs = [...emojiPairs, ...emojiPairs];
      const shuffled = cardPairs.sort(() => Math.random() - 0.5);
      
      setCards(shuffled);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setCombo(0);
      setMaxCombo(0);
      setGameWon(false);
      setTime(0);
      setHints(3);
      setHintedCard(null);
    };

    if (gameStarted) {
      initGame();
    }
  }, [difficulty, theme, gameStarted]);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setCombo(combo + 1);
        setMaxCombo(Math.max(maxCombo, combo + 1));
        if (soundEnabled) playSound('match');
        setFlipped([]);
      } else {
        if (soundEnabled) playSound('wrong');
        setCombo(0);
        setTimeout(() => setFlipped([]), 800);
      }
      
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves, combo, maxCombo, soundEnabled]);

  // Check for win
  useEffect(() => {
    const totalCards = DIFFICULTIES[difficulty].rows * DIFFICULTIES[difficulty].cols;
    if (matched.length > 0 && matched.length === totalCards) {
      setGameWon(true);
      if (soundEnabled) playSound('win');
      // Save score on win
      const key = `${difficulty}_${theme}`;
      const currentBest = bestScores[key];
      const newScore = { moves, time, combo: maxCombo, date: new Date().toLocaleDateString() };
      
      if (!currentBest || moves < currentBest.moves || (moves === currentBest.moves && time < currentBest.time)) {
        const updated = { ...bestScores, [key]: newScore };
        setBestScores(updated);
        localStorage.setItem('memoryGameScores', JSON.stringify(updated));
      }
    }
  }, [matched, difficulty, theme, bestScores, moves, time, maxCombo, soundEnabled]);



  const initializeGame = () => {
    const totalCards = DIFFICULTIES[difficulty].rows * DIFFICULTIES[difficulty].cols;
    const selectedEmojis = THEMES[theme];
    const numPairs = totalCards / 2;
    
    // Create pairs from selected emojis
    const emojiPairs = selectedEmojis.slice(0, numPairs);
    const cardPairs = [...emojiPairs, ...emojiPairs];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setCombo(0);
    setMaxCombo(0);
    setGameWon(false);
    setTime(0);
    setHints(3);
    setHintedCard(null);
  };

  const handleStartGame = () => {
    initializeGame();
    setGameStarted(true);
    setIsPaused(false);
  };

  const handleCardClick = (index) => {
    if (isPaused || flipped.includes(index) || matched.includes(index) || gameWon) {
      return;
    }
    
    if (flipped.length >= 2) {
      return;
    }

    setFlipped([...flipped, index]);
  };

  const handleReset = () => {
    initializeGame();
    setGameStarted(true);
  };

  const handleQuit = () => {
    setGameStarted(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const useHint = () => {
    if (hints <= 0 || flipped.length > 0 || gameWon) return;
    
    const unmatched = cards.map((card, idx) => 
      !matched.includes(idx) ? idx : null
    ).filter(idx => idx !== null);
    
    if (unmatched.length === 0) return;
    
    const randomCard = unmatched[Math.floor(Math.random() * unmatched.length)];
    setHintedCard(randomCard);
    setHints(hints - 1);
    
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setHintedCard(null);
    }, 1000);
  };

  const totalCards = DIFFICULTIES[difficulty].rows * DIFFICULTIES[difficulty].cols;
  const gridColumns = DIFFICULTIES[difficulty].cols;
  const getBestScore = () => {
    const key = `${difficulty}_${theme}`;
    return bestScores[key];
  };

  if (!gameStarted) {
    return (
      <div className="app">
        <header className="header">
          <h1>🎮 Memory Game</h1>
        </header>
        
        <main className="menu-container">
          <div className="menu-card">
            <h2>Welcome to Memory Game!</h2>
            <p>Test your memory by finding matching pairs. Choose your difficulty and theme below.</p>
            
            <div className="menu-section">
              <h3>Difficulty Level</h3>
              <div className="difficulty-buttons">
                {Object.entries(DIFFICULTIES).map(([key, config]) => (
                  <button
                    key={key}
                    className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                    onClick={() => setDifficulty(key)}
                  >
                    <div className="btn-name">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="btn-info">{config.rows}x{config.cols}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-section">
              <h3>Theme</h3>
              <div className="theme-buttons">
                {Object.keys(THEMES).map(themeName => (
                  <button
                    key={themeName}
                    className={`theme-btn ${theme === themeName ? 'active' : ''}`}
                    onClick={() => setTheme(themeName)}
                    title={themeName}
                  >
                    {THEMES[themeName].slice(0, 2).join('')}
                  </button>
                ))}
              </div>
            </div>

            {getBestScore() && (
              <div className="best-score">
                <h3>✨ Best Score</h3>
                <p>🎯 Moves: {getBestScore().moves} | ⏱️ Time: {getBestScore().time}s | 🔥 Combo: {getBestScore().combo || 0}</p>
              </div>
            )}

            <div className="leaderboard-section">
              <button 
                className="leaderboard-toggle"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
              >
                {showLeaderboard ? '📊 Hide Leaderboard' : '📊 Show Leaderboard'}
              </button>
              {showLeaderboard && (
                <div className="leaderboard">
                  <h4>Recent Scores</h4>
                  {Object.entries(bestScores).length > 0 ? (
                    <ul>
                      {Object.entries(bestScores).map(([key, score]) => (
                        <li key={key}>
                          <span className="score-key">{key}</span>
                          <span className="score-stats">Moves: {score.moves} | Time: {score.time}s | Combo: {score.combo || 0}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No scores yet. Play to get your name on the board!</p>
                  )}
                </div>
              )}
            </div>

            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>Memory Game</h1>
          <span className="difficulty-badge">{difficulty.toUpperCase()}</span>
        </div>
        
        <div className="header-stats">
          <div className="stat">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{time}s</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🎯</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{matched.length / 2} / {totalCards / 2}</span>
          </div>
          <div className="stat combo-stat">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{combo}/{maxCombo}</span>
          </div>
        </div>

        <div className="header-buttons">
          <button 
            className={`hint-button ${hints === 0 ? 'disabled' : ''}`} 
            onClick={useHint}
            disabled={hints === 0 || flipped.length > 0}
            title={`Hints remaining: ${hints}`}
          >
            💡 {hints}
          </button>
          <button 
            className={`sound-button ${!soundEnabled ? 'muted' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className={`pause-button ${isPaused ? 'paused' : ''}`} onClick={togglePause}>
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button className="quit-button" onClick={handleQuit}>❌ Quit</button>
        </div>
      </header>

      <main className="game-container">
        {isPaused && (
          <div className="pause-overlay">
            <div className="pause-message">
              <h2>Game Paused</h2>
              <button onClick={togglePause}>Resume Game</button>
            </div>
          </div>
        )}

        {gameWon && (
          <div className="win-message">
            <h2>🎉 You Won! 🎉</h2>
            <div className="win-stats">
              <p>🎯 <strong>Moves:</strong> {moves}</p>
              <p>⏱️ <strong>Time:</strong> {time}s</p>
              <p>🔥 <strong>Max Combo:</strong> {maxCombo}</p>
              <p>⭐ <strong>Efficiency:</strong> {(totalCards / 2 / moves * 100).toFixed(0)}%</p>
            </div>
            {getBestScore() && getBestScore().moves === moves && (
              <p className="new-best">🏆 New Best Score!</p>
            )}
          </div>
        )}

        <div className="grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
          {cards.map((card, index) => (
            <Card
              key={index}
              index={index}
              card={card}
              isFlipped={flipped.includes(index)}
              isMatched={matched.includes(index)}
              isHinted={hintedCard === index}
              onClick={() => handleCardClick(index)}
              isPaused={isPaused}
            />
          ))}
        </div>

        <div className="button-group">
          <button className="reset-button" onClick={handleReset}>
            {gameWon ? '🔄 Play Again' : '🔄 Reset Game'}
          </button>
          <button className="menu-button" onClick={handleQuit}>
            📋 Back to Menu
          </button>
        </div>
      </main>
    </div>
  );
}

function Card({ index, card, isFlipped, isMatched, isHinted, onClick, isPaused }) {
  return (
    <button
      className={`card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''} ${isHinted ? 'hinted' : ''}`}
      onClick={onClick}
      disabled={isMatched || isPaused}
      aria-label={`Card ${index + 1}`}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card}</div>
      </div>
    </button>
  );
}

export default App;
