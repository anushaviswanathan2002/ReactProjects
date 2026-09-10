import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const CARDS_EMOJIS = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎮', '🎳'];
const GRID_SIZE = 4;

function Card({ card, onClick, isDisabled }) {
  const handleClick = useCallback(() => {
    if (!isDisabled && !card.isMatched && !card.isFlipped) {
      onClick(card.id);
    }
  }, [card, onClick, isDisabled]);

  return (
    <button
      className={`card ${card.isFlipped ? 'flipped' : ''} ${
        card.isMatched ? 'matched' : ''
      }`}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={`Card ${card.id}${card.isFlipped ? ` showing ${card.emoji}` : ''}`}
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
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  const totalPairs = (GRID_SIZE * GRID_SIZE) / 2;

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsCheckingMatch(true);
      const timer = setTimeout(() => {
        const [firstId, secondId] = flippedIndices;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.emoji === secondCard.emoji) {
          // Match found
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
        } else {
          // No match - flip back
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }

        setFlippedIndices([]);
        setMoves((prev) => prev + 1);
        setIsCheckingMatch(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [flippedIndices, cards]);

  // Check if game is won
  useEffect(() => {
    if (matchedPairs === totalPairs && matchedPairs > 0) {
      setGameWon(true);
    }
  }, [matchedPairs, totalPairs]);

  const initializeGame = useCallback(() => {
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
    setFlippedIndices([]);
    setGameWon(false);
  }, []);

  const handleCardClick = useCallback(
    (cardId) => {
      if (
        flippedIndices.length >= 2 ||
        flippedIndices.includes(cardId) ||
        cards[cardId]?.isMatched
      ) {
        return;
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );

      setFlippedIndices((prev) => [...prev, cardId]);
    },
    [flippedIndices, cards]
  );

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
