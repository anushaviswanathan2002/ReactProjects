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

function Card({ card, onClick, disabled }) {
  const handleClick = useCallback(() => {
    if (!disabled && !card.isMatched && !card.isFlipped) {
      onClick(card.id);
    }
  }, [card.id, card.isFlipped, card.isMatched, disabled, onClick]);

  return (
    <button
      className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      disabled={disabled || card.isMatched}
      aria-label={`Card ${card.id}`}
    >
      {(card.isFlipped || card.isMatched) && <span className="emoji">{card.emoji}</span>}
    </button>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState(createCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true);
      setMoves(m => m + 1);

      const [first, second] = flipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        setMatched(m => [...m, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  // Check for win
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  // Update card states
  useEffect(() => {
    setCards(prevCards =>
      prevCards.map(card => ({
        ...card,
        isFlipped: flipped.includes(card.id),
        isMatched: matched.includes(card.id),
      }))
    );
  }, [flipped, matched]);

  const handleCardClick = useCallback((cardId) => {
    if (!flipped.includes(cardId) && flipped.length < 2) {
      setFlipped(f => [...f, cardId]);
    }
  }, [flipped]);

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
