import React, { useState, useEffect } from 'react';
import '../styles/MemoryCard.css';

function MemoryGame() {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for win condition
  useEffect(() => {
    if (matched.length === emojis.length && matched.length > 0) {
      setGameWon(true);
    }
  }, [matched, emojis.length]);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (clickedId) => {
    if (flipped.includes(clickedId) || matched.includes(clickedId) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, clickedId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [id1, id2] = newFlipped;
      if (cards[id1].emoji === cards[id2].emoji) {
        setMatched([...matched, id1, id2]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
    }
  };

  return (
    <div className="memory-game">
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched:</span>
          <span className="stat-value">{Math.floor(matched.length / 2)}/{emojis.length}</span>
        </div>
      </div>

      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`game-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {gameWon && (
        <div className="game-won">
          <div className="won-message">
            <h3>🎉 Congratulations! 🎉</h3>
            <p>You won in {moves} moves!</p>
            <button className="btn btn-primary" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <button className="btn btn-secondary" onClick={initializeGame}>
        Reset Game
      </button>
    </div>
  );
}

export default MemoryGame;
