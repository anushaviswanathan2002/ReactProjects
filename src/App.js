import React, { useState, useEffect } from 'react';
import './App.css';

const CARDS_EMOJIS = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎮', '🎳'];
const GRID_SIZE = 4;

function Card({ card, onClick, isDisabled }) {
  return (
    <button
      className={`card ${card.isFlipped ? 'flipped' : ''} ${
        card.isMatched ? 'matched' : ''
      }`}
      onClick={() => !isDisabled && !card.isMatched && !card.isFlipped && onClick(card.id)}
      disabled={isDisabled}
      aria-label={`Card ${card.id}`}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card.emoji}</div>
      </div>
    </button>
  );
}

function GameBoard({ cards, onCardClick, isCheckingMatch, gameWon }) {
  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          isDisabled={isCheckingMatch || gameWon}
        />
      ))}
    </div>
  );
}

function GameStats({ moves, matchedPairs, totalPairs, isGameWon }) {
  return (
    <div className="game-stats">
      <div className="stat">
        <span className="stat-label">Moves:</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Matched:</span>
        <span className="stat-value">
          {matchedPairs}/{totalPairs}
        </span>
      </div>
      {isGameWon && <div className="win-message">🎉 You Won! 🎉</div>}
    </div>
  );
}

function App() {
  const [cards, setCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  const totalPairs = (GRID_SIZE * GRID_SIZE) / 2;

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsCheckingMatch(true);
      const timeout = setTimeout(() => {
        const [id1, id2] = flippedCards;
        const card1 = cards.find(c => c.id === id1);
        const card2 = cards.find(c => c.id === id2);

        if (card1 && card2 && card1.emoji === card2.emoji) {
          // Match found
          setCards(prev =>
            prev.map(card =>
              card.id === id1 || card.id === id2
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs(prev => prev + 1);
        } else {
          // No match - flip back
          setCards(prev =>
            prev.map(card =>
              card.id === id1 || card.id === id2
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }

        setFlippedCards([]);
        setMoves(prev => prev + 1);
        setIsCheckingMatch(false);
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [flippedCards, cards]);

  // Check if game is won
  useEffect(() => {
    if (matchedPairs === totalPairs && matchedPairs > 0) {
      setGameWon(true);
    }
  }, [matchedPairs, totalPairs]);

  const initializeGame = () => {
    const shuffledEmojis = [];
    CARDS_EMOJIS.forEach((emoji) => {
      shuffledEmojis.push(emoji, emoji);
    });

    // Shuffle array using Fisher-Yates algorithm
    for (let i = shuffledEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledEmojis[i], shuffledEmojis[j]] = [
        shuffledEmojis[j],
        shuffledEmojis[i],
      ];
    }

    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isMatched: false,
      isFlipped: false,
    }));

    setCards(newCards);
    setMoves(0);
    setMatchedPairs(0);
    setFlippedCards([]);
    setGameWon(false);
  };

  const handleCardClick = (cardId) => {
    // Prevent clicking if already checking, card already flipped, or card already matched
    if (
      isCheckingMatch ||
      flippedCards.includes(cardId) ||
      cards.some(c => c.id === cardId && c.isMatched)
    ) {
      return;
    }

    // Flip the card
    setCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards(prev => [...prev, cardId]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Memory Game</h1>
        <p className="subtitle">Match all pairs to win!</p>
      </header>

      <main className="app-main">
        <GameStats
          moves={moves}
          matchedPairs={matchedPairs}
          totalPairs={totalPairs}
          isGameWon={gameWon}
        />

        <GameBoard
          cards={cards}
          onCardClick={handleCardClick}
          isCheckingMatch={isCheckingMatch}
          gameWon={gameWon}
        />

        <button className="reset-button" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </main>
    </div>
  );
}

export default App;
