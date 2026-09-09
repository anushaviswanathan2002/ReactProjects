import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Memory Game - A classic card matching game
const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎸', '🎹', '🎺'];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createCards() {
  const cards = EMOJIS.map((emoji, index) => ({
    id: index * 2,
    emoji,
    isFlipped: false,
    isMatched: false,
  })).concat(
    EMOJIS.map((emoji, index) => ({
      id: index * 2 + 1,
      emoji,
      isFlipped: false,
      isMatched: false,
    }))
  );
  return shuffleArray(cards);
}

function Card({ card, onClick, disabled, isFlipped, isMatched }) {
  const handleClick = useCallback(() => {
    if (!disabled && !isMatched && !isFlipped) {
      onClick(card.id);
    }
  }, [card.id, isFlipped, isMatched, disabled, onClick]);

  return (
    <button
      className={`card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      disabled={disabled || isMatched}
      aria-label={`Card ${card.id}`}
    >
      {(isFlipped || isMatched) && <span className="emoji">{card.emoji}</span>}
    </button>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState(() => createCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Check for match when 2 cards are flipped
  useEffect(() => {
    // Only process when we have exactly 2 cards flipped
    if (flipped.length !== 2) return;

    // Prevent further clicks while we check
    setDisabled(true);
    setMoves(m => m + 1);

    // Get the flipped card IDs and find the actual card objects
    const [firstId, secondId] = flipped;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    // If either card not found, reset and return
    if (!firstCard || !secondCard) {
      setFlipped([]);
      setDisabled(false);
      return;
    }

    // Check if they match
    if (firstCard.emoji === secondCard.emoji) {
      // Match found! Add to matched array and keep cards flipped
      setMatched(prev => [...prev, firstId, secondId]);
      setFlipped([]); // Clear flipped to allow more clicks
      setDisabled(false); // Re-enable clicks
    } else {
      // No match - flip cards back after delay
      const timer = setTimeout(() => {
        setFlipped([]); // Reset flipped cards
        setDisabled(false); // Re-enable clicks
      }, 1000);

      // Cleanup function to clear timer if effect runs again
      return () => clearTimeout(timer);
    }
  }, [flipped, cards]);

  // Check for win condition
  useEffect(() => {
    // Win when all cards are matched
    if (matched.length > 0 && matched.length === cards.length) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  // Handle card click
  const handleCardClick = useCallback((cardId) => {
    // Can't click if game is disabled (checking for match)
    if (disabled) return;
    
    // Can't click if we already have 2 cards flipped
    if (flipped.length >= 2) return;
    
    // Can't click the same card twice
    if (flipped.includes(cardId)) return;
    
    // Add this card to the flipped array
    setFlipped(prev => [...prev, cardId]);
  }, [flipped, disabled]);

  const resetGame = useCallback(() => {
    setCards(createCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setDisabled(false);
  }, []);

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Memory Game</h1>
        <div className="stats">
          <p>Moves: <span>{moves}</span></p>
          <p>Matched: <span>{matched.length / 2} / {cards.length / 2}</span></p>
        </div>
      </header>

      <div className="game-board">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={disabled}
            isFlipped={flipped.includes(card.id)}
            isMatched={matched.includes(card.id)}
          />
        ))}
      </div>

      {gameWon && (
        <div className="win-modal">
          <div className="modal-content">
            <h2>🎉 You Won!</h2>
            <p>You completed the game in <strong>{moves}</strong> moves!</p>
            <button onClick={resetGame} className="reset-button">Play Again</button>
          </div>
        </div>
      )}

      <button onClick={resetGame} className="reset-button-main">Reset Game</button>
    </div>
  );
}

export default MemoryGame;
