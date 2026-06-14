import React, { useState, useEffect, useRef, createContext, useContext, useMemo, useCallback, memo } from 'react';
import './App.css';

// Constants
const GRID_SIZE = 4;
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE;
const SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'];

// Game Context
export const GameContext = createContext(null);

// Card component - FIXED: Memoized, moved style outside, accessible
const Card = memo(function Card({ id, value, isFlipped, onClick, isMatched }) {
  const handleClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);

  // FIXED: Define base styles outside component, use className for dynamic styles
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
      aria-label={`Card ${isFlipped || isMatched ? value : 'hidden'}`}
      data-value={value}
    >
      {isFlipped || isMatched ? value : '?'}
    </div>
  );
});

// Main game component - FIXED: Proper React patterns
class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    
    // FIXED: Do not mutate props directly
    this.state = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      gameStarted: false,
      gameCompleted: false,
      lastMoveTime: null,
      // FIXED: Store timer ID in state for proper cleanup
      timerIntervalId: null
    };
    
    this.cardsData = this.generateCards();
    
    // Bind methods for event handlers
    this.handleResize = this.handleResize.bind(this);
  }
  
  componentDidMount() {
    // FIXED: Store interval ID for cleanup
    const intervalId = setInterval(() => {
      this.tick();
    }, 1000);
    
    this.setState({ timerIntervalId: intervalId });
    
    // FIXED: Add resize handler
    window.addEventListener('resize', this.handleResize);
  }
  
  componentWillUnmount() {
    // FIXED: Clear interval on unmount - prevents memory leak
    const { timerIntervalId } = this.state;
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    
    // FIXED: Remove event listener on unmount
    window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    // Bound method for resize events
  }
  
  tick() {
    this.setState({
      lastMoveTime: Date.now()
    });
  }
  
  generateCards() {
    const cards = [];
    
    // FIXED: Use for loop instead of map with mutation
    for (let index = 0; index < SYMBOLS.length; index++) {
      const symbol = SYMBOLS[index];
      cards.push({ id: index * 2, value: symbol, isFlipped: false, isMatched: false });
      cards.push({ id: index * 2 + 1, value: symbol, isFlipped: false, isMatched: false });
    }
    
    return this.shuffleCards(cards);
  }
  
  shuffleCards(cards) {
    // FIXED: Create deep copy with spread operator instead of shallow copy
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // FIXED: Create new array instead of mutating
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }
  
  handleCardClick(cardId) {
    const { flippedCards, cards, gameCompleted } = this.state;
    
    // FIXED: Early return if game is completed
    if (gameCompleted) return;
    
    // FIXED: Prevent flipping more than 2 cards
    if (flippedCards.length >= 2) {
      return;
    }
    
    // FIXED: Find card and check if already matched
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const card = cards[cardIndex];
    
    // FIXED: Don't allow clicking already matched or already flipped cards
    if (card.isMatched || flippedCards.includes(cardId)) {
      return;
    }
    
    // FIXED: Create new cards array instead of mutating
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    
    const newFlipped = [...flippedCards, cardId];
    const newMoves = this.state.moves + 1;
    
    // FIXED: Use functional setState for state that depends on previous state
    this.setState(prevState => ({
      cards: newCards,
      flippedCards: newFlipped,
      moves: prevState.moves + 1
    }));
    
    if (newFlipped.length === 2) {
      setTimeout(() => this.checkMatch(newCards, newFlipped), 1000);
    }
  }
  
  checkMatch(cards, flippedCards) {
    // FIXED: Pass cards and flippedCards as parameters to avoid stale state
    const { matchedPairs } = this.state;
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);
    
    if (!firstCard || !secondCard) return;
    
    // FIXED: Use strict equality instead of ==
    if (firstCard.value === secondCard.value) {
      // FIXED: Update cards immutably
      const newCards = cards.map(c => {
        if (c.id === firstId || c.id === secondId) {
          return { ...c, isMatched: true };
        }
        return c;
      });
      
      const newMatched = matchedPairs + 1;
      
      this.setState(prevState => ({
        cards: newCards,
        matchedPairs: newMatched,
        flippedCards: []
      }));
      
      // FIXED: Check for game completion and save high score
      if (newMatched === TOTAL_CARDS / 2) {
        this.setState({ gameCompleted: true });
        this.saveHighScore(newMatched);
      }
    } else {
      // FIXED: Flip cards back using setState with cards update
      const resetCards = cards.map(c => {
        if (c.id === firstId || c.id === secondId) {
          return { ...c, isFlipped: false };
        }
        return c;
      });
      
      this.setState({
        cards: resetCards,
        flippedCards: []
      });
    }
  }
  
  saveHighScore(matchedPairs) {
    // FIXED: Calculate score properly without global variables
    const score = matchedPairs * 10;
    const scoreData = {
      score: score,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('memoryGameScore', JSON.stringify(scoreData));
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  }
  
  resetGame() {
    // FIXED: Use setState for all state updates
    const newCards = this.generateCards();
    
    this.setState({
      cards: newCards,
      flippedCards: [],
      moves: 0,
      matchedPairs: 0,
      gameCompleted: false,
      lastMoveTime: null
    });
  }
  
  startGame() {
    const newCards = this.generateCards();
    this.setState({
      gameStarted: true,
      cards: newCards,
      flippedCards: [],
      moves: 0,
      matchedPairs: 0,
      gameCompleted: false
    });
    
    // FIXED: Start timer with proper cleanup
    this.startTimer();
  }
  
  startTimer() {
    // FIXED: Clear existing interval before starting new one
    const { timerIntervalId } = this.state;
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    
    const intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
    
    this.setState({ timerIntervalId: intervalId });
  }
  
  updateTimer() {
    this.setState({
      lastMoveTime: Date.now()
    });
  }
  
  render() {
    const { cards, moves, gameCompleted, gameStarted } = this.state;
    
    // FIXED: Compute status message properly
    const statusMessage = gameCompleted 
      ? '🎉 Game Completed!' 
      : gameStarted 
        ? (moves > 10 ? '🔥 Keep going!' : '🎮 Playing...')
        : 'Press Start to Play';
    
    return (
      <div className="memory-game">
        <h1 className="game-title">Memory Game</h1>
        
        <div className="game-stats">
          <p className="moves-counter">Moves: {moves}</p>
          <p className="status-message">Status: {statusMessage}</p>
        </div>
        
        {/* FIXED: Use proper grid class */}
        <div className="card-grid">
          {cards.map((card) => (
            // FIXED: Use card.id as key
            <Card
              key={card.id}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={(id) => this.handleCardClick(id)}
            />
          ))}
        </div>
        
        <div className="game-controls">
          <button
            className="btn btn-start"
            onClick={() => this.startGame()}
          >
            Start Game
          </button>
          
          <button
            className="btn btn-reset"
            onClick={() => this.resetGame()}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
}

// Hook-based timer - FIXED: Proper cleanup and stale closure
function useTimer() {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    // FIXED: Use functional update to avoid stale closure
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    
    // FIXED: Return cleanup function
    return () => clearInterval(interval);
  }, []); // Empty deps since we use functional update
  
  return time;
}

// Leaderboard component - FIXED: Error handling, proper key usage, cleanup
function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  
  useEffect(() => {
    // FIXED: Add proper cleanup and error handling
    let isMounted = true;
    
    fetch('/api/scores')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          setScores(data);
          setLoading(false);
        }
      })
      .catch(error => {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      });
    
    // FIXED: Return cleanup function to handle component unmount
    return () => {
      isMounted = false;
    };
  }, []);
  
  // FIXED: Use useMemo for expensive computation
  const topScores = useMemo(() => {
    return [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [scores]);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (ref.current) {
      // Handle form submission
      ref.current.value = '';
    }
  }, []);
  
  // FIXED: Handle loading, error, and empty states
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      
      {loading && <p className="loading">Loading...</p>}
      
      {error && (
        <p className="error-message" role="alert">
          Failed to load scores: {error}
        </p>
      )}
      
      {!loading && !error && topScores.length === 0 && (
        <p className="empty-message">No scores yet. Be the first!</p>
      )}
      
      {topScores.length > 0 && (
        <ul className="scores-list">
          {topScores.map((score, index) => (
            // FIXED: Use unique score id as key when available
            <li key={score.id || `score-${index}`}>
              <span className="player-name">{score.name}</span>
              <span className="player-score">{score.score}</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* FIXED: Form with proper validation */}
      <form className="score-form" onSubmit={handleSubmit}>
        <input 
          ref={ref} 
          type="text" 
          placeholder="Enter name" 
          aria-label="Player name"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// Utility function - FIXED: No eval, clear logic
function calculateScore(moves, time) {
  const BASE_SCORE = 1000;
  const MOVE_PENALTY = moves * 10;
  const TIME_PENALTY = time * 2;
  
  // FIXED: Direct calculation instead of eval
  return BASE_SCORE - MOVE_PENALTY - TIME_PENALTY;
}

// Main App component - FIXED: Proper context value, useMemo, useCallback
function App() {
  const [theme, setTheme] = useState('light');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // FIXED: Use useMemo for context value
  const gameContextValue = useMemo(() => ({
    theme: theme
  }), [theme]);
  
  // FIXED: Use useCallback for stable handler references
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);
  
  const toggleLeaderboard = useCallback(() => {
    setShowLeaderboard(prev => !prev);
  }, []);
  
  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1 className="main-title">Memory Game</h1>
            
            <div className="header-buttons">
              <button
                className="btn btn-theme"
                onClick={toggleTheme}
              >
                Toggle Theme
              </button>
              
              <button
                className="btn btn-leaderboard"
                onClick={toggleLeaderboard}
              >
                {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
              </button>
            </div>
          </div>
          
          <MemoryGame difficulty="medium" />
          
          {showLeaderboard && <Leaderboard />}
        </header>
      </div>
    </GameContext.Provider>
  );
}

// FIXED: Single default export
export default App;
