import React, { useState, useEffect } from 'react';
import './App.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎸'];
const GRID_SIZE = 4;

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      if (cards[first] === cards[second]) {
        // Cards match
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        // Cards don't match - flip back after delay
        setTimeout(() => setFlipped([]), 800);
      }
      
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves]);

  // Check for win
  useEffect(() => {
    if (matched.length > 0 && matched.length === GRID_SIZE * GRID_SIZE) {
      setGameWon(true);
    }
  }, [matched]);

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...EMOJIS, ...EMOJIS];
    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    // Don't allow clicking if already flipped, matched, or game won
    if (flipped.includes(index) || matched.includes(index) || gameWon) {
      return;
    }
    
    // Don't allow more than 2 flipped cards
    if (flipped.length >= 2) {
      return;
    }

    setFlipped([...flipped, index]);
  };

  const handleReset = () => {
    initializeGame();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Memory Game</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matched:</span>
            <span className="stat-value">{matched.length / 2} / {GRID_SIZE * GRID_SIZE / 2}</span>
          </div>
        </div>
      </header>

      <main className="game-container">
        {gameWon && (
          <div className="win-message">
            <h2>🎉 You Won! 🎉</h2>
            <p>You completed the game in {moves} moves!</p>
          </div>
        )}

        <div className="grid">
          {cards.map((card, index) => (
            <Card
              key={index}
              index={index}
              card={card}
              isFlipped={flipped.includes(index)}
              isMatched={matched.includes(index)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        <button className="reset-button" onClick={handleReset}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </main>
    </div>
  );
}

function Card({ index, card, isFlipped, isMatched, onClick }) {
  return (
    <button
      className={`card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
      disabled={isMatched}
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
