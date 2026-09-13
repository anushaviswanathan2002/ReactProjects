import React, { useState, useEffect } from 'react';
import '../styles/MemoryGame.css';

const EMOJIS = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎤'];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check if game is won
  useEffect(() => {
    if (matched.size === EMOJIS.length * 2 && matched.size > 0) {
      setGameWon(true);
    }
  }, [matched]);

  const initializeGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    setCards(shuffledEmojis.map((emoji, index) => ({ id: index, emoji })));
    setFlipped(new Set());
    setMatched(new Set());
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (id) => {
    if (flipped.has(id) || matched.has(id)) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(id);
    setFlipped(newFlipped);

    if (newFlipped.size === 2) {
      const [id1, id2] = Array.from(newFlipped);
      if (cards[id1].emoji === cards[id2].emoji) {
        const newMatched = new Set(matched);
        newMatched.add(id1);
        newMatched.add(id2);
        setMatched(newMatched);
        setFlipped(new Set());
      } else {
        setTimeout(() => setFlipped(new Set()), 600);
      }
      setMoves((m) => m + 1);
    }
  };

  return (
    <div className="memory-game">
      <div className="game-info">
        <div className="stats">
          <h2>Moves: {moves}</h2>
          <h2>Matched: {matched.size / 2}/{EMOJIS.length}</h2>
        </div>
        {gameWon && (
          <div className="win-message">
            🎉 You won in {moves} moves! 🎉
          </div>
        )}
        <button className="reset-btn" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </div>

      <div className="game-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${flipped.has(card.id) || matched.has(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="game-instructions">Click on cards to find matching pairs!</p>
    </div>
  );
}
