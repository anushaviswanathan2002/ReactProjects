import React, { useState, useEffect } from 'react';
import './App.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎳'];
const GRID_SIZE = 4;

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check if player won
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  // Handle matching logic
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves]);

  const initializeGame = () => {
    const shuffled = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE / 2; i++) {
      shuffled.push(EMOJIS[i % EMOJIS.length]);
      shuffled.push(EMOJIS[i % EMOJIS.length]);
    }
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setCards(shuffled.map((emoji, id) => ({ id, emoji })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
  };

  const handleCardClick = (id) => {
    if (matched.includes(id) || flipped.includes(id) || flipped.length === 2) {
      return;
    }
    setFlipped([...flipped, id]);
  };

  const isCardFlipped = (id) => flipped.includes(id) || matched.includes(id);

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🧠 Memory Game</h1>
        <div className="game-stats">
          <span>Moves: <strong>{moves}</strong></span>
          <span>Matched: <strong>{matched.length / 2}</strong> / {cards.length / 2}</span>
        </div>
      </header>

      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${isCardFlipped(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
            role="button"
            tabIndex={0}
            aria-label={`Memory card ${card.id}`}
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {gameWon && (
        <div className="win-message">
          <h2>🎉 You Won!</h2>
          <p>Completed in {moves} moves</p>
          <button onClick={initializeGame} className="reset-btn">Play Again</button>
        </div>
      )}

      {!gameStarted && (
        <div className="start-prompt">
          <button onClick={initializeGame} className="start-btn">Start Game</button>
        </div>
      )}
    </div>
  );
}
