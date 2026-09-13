import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './AuthContext';
import { Login } from './Login';
import { Signup } from './Signup';
import './App.css';

const SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'];
const PAIRS = SYMBOLS.length;

function generateCards() {
  const cards = [];
  SYMBOLS.forEach((symbol, index) => {
    cards.push({ id: index * 2, value: symbol });
    cards.push({ id: index * 2 + 1, value: symbol });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function Card({ id, value, isFlipped, isMatched, onClick }) {
  const revealed = isFlipped || isMatched;
  return (
    <button
      type="button"
      className={`card${revealed ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}
      onClick={onClick}
      aria-label={revealed ? `Card ${value}` : 'Hidden card'}
      aria-pressed={revealed}
    >
      {revealed ? value : '?'}
    </button>
  );
}

function MemoryGame({ onGameComplete }) {
  const [cards, setCards] = useState(generateCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (gameCompleted) return undefined;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [gameCompleted]);

  const resetGame = useCallback(() => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setSeconds(0);
    setGameCompleted(false);
  }, []);

  const handleCardClick = (cardId) => {
    if (gameCompleted) return;
    if (flippedCards.length >= 2 || flippedCards.includes(cardId)) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isMatched) return;

    setMoves((m) => m + 1);
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));
    setFlippedCards((prev) => [...prev, cardId]);
  };

  // Check for match whenever two cards are flipped
  useEffect(() => {
    if (flippedCards.length !== 2) return;

    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);
    const isMatch = firstCard && secondCard && firstCard.value === secondCard.value;

    const timeout = setTimeout(() => {
      if (isMatch) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true, isFlipped: false }
              : c
          )
        );
        setMatchedPairs((prev) => {
          const updated = prev + 1;
          if (updated === PAIRS) {
            setGameCompleted(true);
          }
          return updated;
        });
      } else {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          )
        );
      }
      setFlippedCards([]);
    }, isMatch ? 400 : 900);

    return () => clearTimeout(timeout);
  }, [flippedCards, cards]);

  // Save score once when game completes
  useEffect(() => {
    if (gameCompleted && onGameComplete) {
      onGameComplete({ moves, time: seconds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCompleted]);

  return (
    <div className="memory-game">
      <h2>🧠 Memory Game</h2>
      <div className="game-stats">
        <span>Moves: {moves}</span>
        <span>Time: {seconds}s</span>
        <span>Pairs: {matchedPairs}/{PAIRS}</span>
      </div>

      {gameCompleted ? (
        <div className="game-complete">
          <p className="completion-message">
            🎉 You matched all pairs in {moves} moves and {seconds}s!
          </p>
          <div className="game-buttons">
            <button type="button" className="btn btn-primary" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cards-grid">
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                value={card.value}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
          <div className="game-buttons">
            <button type="button" className="btn btn-secondary" onClick={resetGame}>
              Reset Game
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('/api/scores', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setScores(res.data.scores || []))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="leaderboard">
      <h3>📊 Your Scores</h3>
      {loading ? (
        <p>Loading...</p>
      ) : scores.length === 0 ? (
        <p>No scores yet — complete a game to see your results!</p>
      ) : (
        <ol>
          {scores.map((s) => (
            <li key={s.id}>
              {s.moves} moves · {s.time}s · score {s.score}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function App() {
  const [authScreen, setAuthScreen] = useState('login');
  const { user, loading, logout } = useAuth();

  const saveScore = useCallback(({ moves, time }) => {
    const token = localStorage.getItem('token');
    axios
      .post('/api/scores', { moves, time }, { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => {});
  }, []);

  if (loading) {
    return <div className="App loading">Loading…</div>;
  }

  if (!user) {
    return authScreen === 'login' ? (
      <Login onSwitchToSignup={() => setAuthScreen('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  return (
    <div className="game-page">
      <header className="game-header">
        <h1>🧠 Memory Game</h1>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {user.username}!</span>
          <button type="button" className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="game-main">
        <MemoryGame onGameComplete={saveScore} />
        <Scoreboard />
      </main>
    </div>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
