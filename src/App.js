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
    if (flipped.length !== 2) return;

    setDisabled(true);
    const [firstId, secondId] = flipped;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    // Increment moves
    setMoves(m => m + 1);

    // Check if they match
    if (firstCard.emoji === secondCard.emoji) {
      // Match found - add to matched
      setMatched(prev => [...prev, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      // No match - flip back after delay
      const timer = setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flipped, cards]);

  // Check for win
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const handleCardClick = useCallback((cardId) => {
    // Don't allow if disabled or already have 2 flipped
    if (disabled || flipped.length >= 2) return;
    
    // Don't allow clicking same card twice
    if (flipped.includes(cardId)) return;
    
    // Add card to flipped
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
