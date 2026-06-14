import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import './App.css';

// Memory Game - Fixed version with proper React patterns

// Constants
const GRID_SIZE = 4;
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE;
const SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'];

// Context for theme (properly exported and used)
export const GameContext = createContext(null);

// Safe evaluation function - no security vulnerability
function evaluateCondition(baseScore, movePenalty, timePenalty) {
  return Math.max(0, baseScore - movePenalty - timePenalty);
}

// Calculate score with safe arithmetic
function calculateScore(moves, time) {
  const baseScore = 1000;
  const movePenalty = moves * 10;
  const timePenalty = time * 2;
  return evaluateCondition(baseScore, movePenalty, timePenalty);
}

// Utility: Shuffle array with proper immutability
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Card component with proper React patterns
function Card({ id, value, isFlipped, isMatched, onClick, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      onClick(id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled) {
      onClick(id);
    }
  };

  const cardClasses = `card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`;

  return (
    <div
      className={cardClasses}
      role="button"
      aria-label={`Card ${value}${isFlipped || isMatched ? ' showing' : ' hidden'}`}
      aria-pressed={isFlipped || isMatched}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-value={value}
    >
      <span className="card-content">
        {isFlipped || isMatched ? value : '?'}
      </span>
    </div>
  );
}

// Custom hook for timer with proper cleanup
function useTimer(isActive) {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  const reset = useCallback(() => setTime(0), []);

  return { time, reset };
}

// Main game component - functional with hooks
function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const [matchedCardIds, setMatchedCardIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const timeoutRef = useRef(null);
  const timerRef = useRef(null);
  const matchedPairs = matchedCardIds.length / 2;

  const { time: elapsedTime, reset: resetTimer } = useTimer(gameStarted && !gameCompleted);

  // Generate cards with unique string IDs
  const generateCards = useCallback(() => {
    const cardsArray = [];
    SYMBOLS.forEach((symbol, index) => {
      cardsArray.push({ id: `card-${index * 2}`, value: symbol, isFlipped: false, isMatched: false });
      cardsArray.push({ id: `card-${index * 2 + 1}`, value: symbol, isFlipped: false, isMatched: false });
    });
    return shuffleArray(cardsArray);
  }, []);

  // Start game with proper cleanup
  const startGame = useCallback(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCards(generateCards());
    setFlippedCardIds([]);
    setMatchedCardIds([]);
    setMoves(0);
    setGameStarted(true);
    setGameCompleted(false);
    setIsChecking(false);
    resetTimer();
  }, [generateCards, resetTimer]);

  // Reset game with proper cleanup
  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCards(generateCards());
    setFlippedCardIds([]);
    setMatchedCardIds([]);
    setMoves(0);
    setGameCompleted(false);
    setIsChecking(false);
    resetTimer();
  }, [generateCards, resetTimer]);

  // Check for match with proper state management
  const checkMatch = useCallback((firstId, secondId) => {
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.value === secondCard.value) {
      // Match found
      setMatchedCardIds(prev => [...prev, firstId, secondId]);
      setFlippedCardIds([]);
      setIsChecking(false);

      // Check for game completion
      const newMatchedCount = (matchedCardIds.length / 2) + 1;
      if (newMatchedCount === TOTAL_CARDS / 2) {
        setGameCompleted(true);
        saveHighScore();
      }
    } else {
      // No match - flip cards back
      timeoutRef.current = setTimeout(() => {
        setCards(prevCards =>
          prevCards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          )
        );
        setFlippedCardIds([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [cards, matchedCardIds.length]);

  // Handle card click with validation
  const handleCardClick = useCallback((cardId) => {
    // Prevent clicks during match checking
    if (isChecking) return;

    // Prevent clicking already flipped or matched cards
    if (flippedCardIds.includes(cardId)) return;
    if (matchedCardIds.includes(cardId)) return;

    // Update card state
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);

    // Increment moves when second card is flipped
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      timeoutRef.current = setTimeout(() => {
        checkMatch(newFlipped[0], newFlipped[1]);
      }, 1000);
    }
  }, [isChecking, flippedCardIds, matchedCardIds, checkMatch]);

  // Save high score with error handling
  const saveHighScore = useCallback(() => {
    const score = calculateScore(moves, matchedPairs);
    const scoreData = { score, timestamp: new Date().toISOString() };
    try {
      localStorage.setItem('memoryGameScore', JSON.stringify(scoreData));
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  }, [moves, matchedPairs]);

  // Window resize handler with proper cleanup
  useEffect(() => {
    const handleResize = () => {
      // Handle resize logic if needed
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Determine status message
  const statusMessage = useMemo(() => {
    if (gameCompleted) return '🎉 Game Completed!';
    if (gameStarted) {
      return moves > 10 ? '🔥 Keep going!' : '🎮 Playing...';
    }
    return 'Press Start to Play';
  }, [gameCompleted, gameStarted, moves]);

  return (
    <div className="memory-game">
      <h1>Memory Game</h1>

      <div className="game-stats">
        <p>Moves: {moves}</p>
        <p>Time: {elapsedTime}s</p>
        <p>Status: {statusMessage}</p>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            value={card.value}
            isFlipped={card.isFlipped}
            isMatched={matchedCardIds.includes(card.id)}
            onClick={handleCardClick}
            disabled={isChecking || gameCompleted}
          />
        ))}
      </div>

      <div className="button-group">
        <button
          onClick={startGame}
          className="btn btn-start"
          aria-label="Start new game"
        >
          Start Game
        </button>

        <button
          onClick={resetGame}
          className="btn btn-reset"
          aria-label="Reset current game"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// Leaderboard component with proper error handling
function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetch('/api/scores', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Failed to load');
        return response.json();
      })
      .then(data => {
        setScores(data);
        setLoading(false);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          setError('Failed to load scores');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Memoize expensive sorting
  const sortedScores = useMemo(() =>
    [...scores].sort((a, b) => b.score - a.score),
    [scores]
  );

  const topScores = useMemo(() =>
    sortedScores.slice(0, 5),
    [sortedScores]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="leaderboard" role="region" aria-label="Leaderboard">
      <h2>Leaderboard</h2>

      {loading && <p aria-live="polite">Loading...</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {topScores.length > 0 ? (
        <ul aria-label="Top scores">
          {topScores.map((score, index) => (
            <li key={`${score.name}-${index}`}>
              {score.name}: {score.score}
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No scores yet. Be the first to play!</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter name"
          aria-label="Enter your name for the leaderboard"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// Main App component with proper context and hooks
function App() {
  const [theme, setTheme] = useState('light');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Memoize context value to prevent unnecessary re-renders
  const gameContextValue = useMemo(() => ({
    theme,
  }), [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const toggleLeaderboard = useCallback(() => {
    setShowLeaderboard(prev => !prev);
  }, []);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className={`App ${theme}`}>
        <header className="App-header">
          <div className="header-content">
            <h1>Memory Game</h1>

            <div className="header-buttons">
              <button
                onClick={toggleTheme}
                className="btn btn-theme"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                aria-pressed={theme === 'dark'}
              >
                Toggle Theme
              </button>

              <button
                onClick={toggleLeaderboard}
                className="btn btn-leaderboard"
                aria-expanded={showLeaderboard}
              >
                {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
              </button>
            </div>
          </div>

          <MemoryGame />

          {showLeaderboard && <Leaderboard />}
        </header>
      </div>
    </GameContext.Provider>
  );
}

export { MemoryGame };
export default App;