import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './App.css';

// Memory Game - A card matching game with LOTS of issues for testing

// ISSUE 1: Global variable - BAD PRACTICE
let gameScore = 0;
let globalTimer = null;

// ISSUE 2: Magic numbers
const GRID_SIZE = 4;
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE;

// ISSUE 3: Unused context
export const GameContext = createContext(null);

// ISSUE 4: Using eval - SECURITY VULNERABILITY
function evaluateCondition(condition) {
  return eval(condition);
}

// Card component with many issues
function Card({ id, value, isFlipped, onClick, isMatched }) {
  // ISSUE 5: Creating new object on every render
  const cardStyle = {
    width: '100px',
    height: '100px',
    backgroundColor: isMatched ? '#90EE90' : (isFlipped ? '#87CEEB' : '#4169E1'),
    border: '2px solid #333',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    cursor: 'pointer',
    margin: '10px',
    // ISSUE 6: Inline style instead of CSS class
    boxShadow: isFlipped ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s'
  };

  // ISSUE 7: Creating function inside render - PERFORMANCE ISSUE
  const handleClick = () => {
    console.log('Card clicked:', id);
    onClick(id);
  };

  // ISSUE 8: Unused variable
  const unusedData = 'this is never used';
  const anotherUnused = 123;

  return (
    // ISSUE 9: Missing aria-label for accessibility
    // ISSUE 10: Using index as key (though we have id, using index for some)
    <div
      className="card"
      style={cardStyle}
      onClick={handleClick}
      data-value={value}
    >
      {isFlipped || isMatched ? value : '?'}
    </div>
  );
}

// Main game component with many issues
class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    
    // ISSUE 11: Direct mutation of props
    this.props.difficulty = this.props.difficulty || 'medium';
    
    this.state = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      gameStarted: false,
      gameCompleted: false,
      // ISSUE 12: Unused state variables
      unusedField1: null,
      unusedField2: [],
      lastMoveTime: null,
      timerInterval: null
    };
    
    // ISSUE 13: Using var instead of let
    var cardsData = this.generateCards();
    this.cardsData = cardsData;
    
    // ISSUE 14: No proper initialization handling
  }
  
  // ISSUE 15: Not using proper lifecycle for cleanup
  componentDidMount() {
    console.log('Game mounted');
    
    // ISSUE 16: Memory leak - starting interval without cleanup tracking
    this.state.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
    
    // ISSUE 17: Creating closures in loop
    const handlers = [];
    for (let i = 0; i < 10; i++) {
      handlers.push(() => i);
    }
    this.boundHandlers = handlers;
    
    // ISSUE 18: Adding event listener without remove
    window.addEventListener('resize', this.handleResize);
  }
  
  componentWillUnmount() {
    // ISSUE 19: NOT clearing interval - memory leak
    // Should be: clearInterval(this.state.timerInterval)
    console.log('Game unmounted');
    
    // ISSUE 20: Not removing event listener
    // Missing: window.removeEventListener('resize', this.handleResize)
  }
  
  // ISSUE 21: Arrow function creating new reference every call
  handleResize = () => {
    console.log(window.innerWidth);
  };
  
  tick() {
    // ISSUE 22: Direct state mutation
    this.state.lastMoveTime = Date.now();
    // ISSUE 23: Not using setState
    this.forceUpdate();
  }
  
  generateCards() {
    // ISSUE 24: Inefficient algorithm - generating more than needed
    const cards = [];
    const symbols = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'];
    
    // ISSUE 25: Creating array with map and mutating
    symbols.map((symbol, index) => {
      cards.push({ id: index * 2, value: symbol, isFlipped: false, isMatched: false });
      cards.push({ id: index * 2 + 1, value: symbol, isFlipped: false, isMatched: false });
    });
    
    // ISSUE 26: Not returning properly shuffled array
    return this.shuffleCards(cards);
  }
  
  shuffleCards(cards) {
    // ISSUE 27: Shallow copy instead of deep copy
    const shuffled = cards;
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // ISSUE 28: Direct mutation
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  handleCardClick(cardId) {
    // ISSUE 29: No input validation
    // ISSUE 30: State logic errors
    
    const { flippedCards, cards, matchedPairs, moves } = this.state;
    
    // ISSUE 31: Double click can flip more than 2 cards
    if (flippedCards.length >= 2) {
      return;
    }
    
    // ISSUE 32: Can click already matched cards
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    // ISSUE 33: Modifying state directly
    card.isFlipped = true;
    
    const newFlipped = [...flippedCards, cardId];
    const newMoves = moves + 1;
    
    // ISSUE 34: setState with old state values
    this.setState({
      flippedCards: newFlipped,
      moves: newMoves
    });
    
    // ISSUE 35: Async state update issues
    if (newFlipped.length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
    
    // ISSUE 36: Global variable mutation
    gameScore = matchedPairs * 10;
  }
  
  checkMatch() {
    const { flippedCards, cards, matchedPairs } = this.state;
    
    // ISSUE 37: Finding cards from potentially stale state
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);
    
    // ISSUE 38: Type coercion with ==
    if (firstCard.value == secondCard.value) {
      // ISSUE 39: Direct state mutation
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      
      const newMatched = matchedPairs + 1;
      
      this.setState({
        matchedPairs: newMatched,
        flippedCards: []
      });
      
      // ISSUE 40: No cleanup of flipped cards in state
      if (newMatched === TOTAL_CARDS / 2) {
        this.setState({ gameCompleted: true });
        // ISSUE 41: Global side effect
        this.saveHighScore();
      }
    } else {
      // ISSUE 42: Logic error - not flipping cards back properly
      setTimeout(() => {
        // ISSUE 43: Not resetting flipped state properly
        this.setState({ flippedCards: [] });
      }, 500);
    }
  }
  
  saveHighScore() {
    // ISSUE 44: LocalStorage without error handling
    // ISSUE 45: Storing sensitive data in plain text
    const scoreData = {
      score: gameScore,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('memoryGameScore', JSON.stringify(scoreData));
  }
  
  resetGame() {
    // ISSUE 46: Not properly resetting all state
    this.state.flippedCards = [];
    this.state.moves = 0;
    this.state.matchedPairs = 0;
    this.state.gameCompleted = false;
    
    // ISSUE 47: Not regenerating cards properly
    this.cardsData = this.generateCards();
    
    this.setState({
      cards: this.cardsData
    });
    
    // ISSUE 48: Forgetting to reset global variables
  }
  
  startGame() {
    this.setState({
      gameStarted: true,
      cards: this.cardsData
    });
    
    // ISSUE 49: Starting timer without proper cleanup first
    this.startTimer();
  }
  
  startTimer() {
    // ISSUE 50: Multiple intervals can run simultaneously
    globalTimer = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }
  
  updateTimer() {
    // ISSUE 51: No timer state being maintained
    this.forceUpdate();
  }
  
  render() {
    const { cards, moves, gameCompleted, gameStarted } = this.state;
    
    // ISSUE 52: Unused variable
    const unusedRenderVar = 'not used in render';
    
    // ISSUE 53: Deeply nested ternary - hard to read
    const statusMessage = gameCompleted 
      ? '🎉 Game Completed!' 
      : (gameStarted 
        ? (moves > 10 
          ? '🔥 Keep going!' 
          : '🎮 Playing...')
        : 'Press Start to Play');
    
    // ISSUE 54: Creating new function on every render
    const handleReset = () => {
      this.resetGame();
    };
    
    // ISSUE 55: Creating new function on every render
    const handleStart = () => {
      this.startGame();
    };
    
    return (
      <div className="memory-game">
        <h1 style={{ color: '#333', fontSize: '28px' }}>Memory Game</h1>
        
        {/* ISSUE 56: Inline styles everywhere */}
        <div style={{ margin: '20px 0' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Moves: {moves}</p>
          <p style={{ fontSize: '16px' }}>Status: {statusMessage}</p>
        </div>
        
        {/* ISSUE 57: Missing proper grid structure */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cards.map((card, index) => (
            // ISSUE 58: Using index as key instead of card.id
            <Card
              key={index}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={(id) => this.handleCardClick(id)}
            />
          ))}
        </div>
        
        {/* ISSUE 59: Duplicate code - buttons not extracted */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleStart}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Start Game
          </button>
          
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Reset
          </button>
        </div>
        
        {/* ISSUE 60: No loading state handling */}
        {/* ISSUE 61: No error boundary */}
      </div>
    );
  }
}

// Hook-based component with issues
function useTimer() {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    // ISSUE 62: Interval not cleaned up properly
    const interval = setInterval(() => {
      setTime(time + 1); // ISSUE 63: Stale closure
    }, 1000);
    
    // ISSUE 64: Missing return for cleanup
    return () => clearInterval(interval);
  }, []); // ISSUE 65: Missing time in deps
  
  return time;
}

// Another functional component with issues
function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    // ISSUE 66: No error handling for fetch
    fetch('/api/scores')
      .then(response => response.json())
      .then(data => {
        setScores(data);
        setLoading(false);
      });
    
    // ISSUE 67: No cleanup of effect
  }, []);
  
  // ISSUE 68: Not memoizing expensive computation
  const sortedScores = scores.sort((a, b) => b.score - a.score);
  
  // ISSUE 69: Creating new array reference every render
  const topScores = [...sortedScores].slice(0, 5);
  
  // ISSUE 70: Using ref without proper type
  const handleClick = () => {
    if (ref.current) {
      ref.current.value = 'clicked';
    }
  };
  
  // ISSUE 71: Missing accessibility attributes
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      
      {loading && <p>Loading...</p>}
      
      {/* ISSUE 72: Not handling empty state */}
      <ul>
        {topScores.map((score, index) => (
          // ISSUE 73: Index as key with potential duplicates
          <li key={index}>
            {score.name}: {score.score}
          </li>
        ))}
      </ul>
      
      {/* ISSUE 74: Form without proper validation */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input ref={ref} type="text" placeholder="Enter name" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// Utility function that should be extracted but isn't
function calculateScore(moves, time) {
  // ISSUE 75: Magic number
  const baseScore = 1000;
  const movePenalty = moves * 10;
  const timePenalty = time * 2;
  
  // ISSUE 76: Using eval for simple calculation - security risk
  const formula = 'baseScore - movePenalty - timePenalty';
  return evaluateCondition(formula);
}

// Main App component with issues
function App() {
  const [theme, setTheme] = useState('light');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // ISSUE 77: Context provider without proper value
  const gameContextValue = {
    theme: theme
    // ISSUE 78: Missing other context values
  };
  
  // ISSUE 79: Not using useMemo for context value
  // ISSUE 80: Not using useCallback for handlers
  
  const toggleTheme = () => {
    // ISSUE 81: Direct mutation potential
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };
  
  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <header className="App-header">
          {/* ISSUE 82: Inline styles */}
          <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Memory Game</h1>
            
            {/* ISSUE 83: Buttons with duplicate inline styles */}
            <button
              onClick={toggleTheme}
              style={{
                padding: '10px 20px',
                margin: '5px',
                backgroundColor: theme === 'light' ? '#333' : '#fff',
                color: theme === 'light' ? '#fff' : '#333'
              }}
            >
              Toggle Theme
            </button>
            
            <button
              onClick={toggleLeaderboard}
              style={{
                padding: '10px 20px',
                margin: '5px',
                backgroundColor: '#2196F3',
                color: 'white'
              }}
            >
              {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
            </button>
          </div>
          
          <MemoryGame difficulty="medium" />
          
          {showLeaderboard && <Leaderboard />}
        </header>
      </div>
    </GameContext.Provider>
  );
}

// ISSUE 84: Export issue - using default and named together incorrectly
export { MemoryGame };
export default App;