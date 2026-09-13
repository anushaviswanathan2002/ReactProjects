import React, { useState, useEffect } from 'react';

const MemoryGame = ({ onBack }) => {
  const emojis = ['🍎', '🍌', '🍒', '🍕', '🎮', '⚽', '🎸', '📚'];
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize game
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if game is won
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length && gameStarted) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [matched, cards.length, gameStarted]);

  const initializeGame = () => {
    const doubledEmojis = [...emojis, ...emojis];
    const shuffled = doubledEmojis
      .map((emoji, index) => ({ id: index, emoji, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setGameStarted(false);
    setGameWon(false);
    setMoves(0);
  };

  const handleCardClick = (id) => {
    if (!gameStarted && !flipped.includes(id)) {
      setGameStarted(true);
    }

    // Don't allow more than 2 cards to be flipped
    if (flipped.length >= 2) return;
    
    // Don't flip already matched or flipped cards
    if (matched.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const handleReplay = () => {
    initializeGame();
  };

  const isCardFlipped = (id) => flipped.includes(id) || matched.includes(id);

  return (
    <div className="memory-game-container">
      <div className="game-header">
        <h2>🎮 Memory Matching Game</h2>
        <button className="btn btn-back" onClick={onBack}>← Back to Dashboard</button>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched:</span>
          <span className="stat-value">{matched.length / 2} / {cards.length / 2}</span>
        </div>
      </div>

      {gameWon && (
        <div className="game-won">
          <div className="won-content">
            <h3>🎉 You Won!</h3>
            <p>Completed in {moves} moves!</p>
            <button className="btn btn-primary" onClick={handleReplay}>
              🔄 Play Again
            </button>
          </div>
        </div>
      )}

      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${isCardFlipped(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="game-instructions">
        <p>Click cards to find matching pairs. Try to complete the game in minimum moves and time!</p>
      </div>
    </div>
  );
};

export default MemoryGame;
