import { useState, useEffect, useCallback } from "react";
import HangmanDrawing from "./components/HangmanDrawing";
import WordDisplay from "./components/WordDisplay";
import Keyboard from "./components/Keyboard";
import { getRandomWord } from "./data/words";
import "./App.css";

const MAX_WRONG_GUESSES = 6;

function App() {
  const [currentWord, setCurrentWord] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);

  const startNewGame = useCallback(() => {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  if (!currentWord) return null;

  const { word, category } = currentWord;

  const wrongGuesses = guessedLetters.filter((l) => !word.includes(l));
  const wrongGuessCount = wrongGuesses.length;

  const isWinner = word
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isLoser = wrongGuessCount >= MAX_WRONG_GUESSES;
  const isGameOver = isWinner || isLoser;

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || isGameOver) return;
    setGuessedLetters((prev) => [...prev, letter]);
  };

  // Keyboard listener
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) handleGuess(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [guessedLetters, isGameOver]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Hangman</h1>
      </header>

      <main className="game-container">
        {/* Left: Drawing + Stats */}
        <section className="left-panel">
          <HangmanDrawing wrongGuessCount={wrongGuessCount} />
          <div className="wrong-counter">
            <span className="counter-label">Wrong Guesses</span>
            <span className="counter-value">
              <span className={wrongGuessCount > 0 ? "counter-bad" : ""}>
                {wrongGuessCount}
              </span>
              <span className="counter-sep"> / </span>
              <span>{MAX_WRONG_GUESSES}</span>
            </span>
          </div>
        </section>

        {/* Right: Word + Keyboard */}
        <section className="right-panel">
          <div className="category-badge">
            <span className="category-label">Category:</span>
            <span className="category-value">{category}</span>
          </div>

          <WordDisplay
            word={word}
            guessedLetters={guessedLetters}
            gameOver={isLoser}
          />

          <Keyboard
            guessedLetters={guessedLetters}
            word={word}
            onGuess={handleGuess}
            disabled={isGameOver}
          />
        </section>
      </main>

      {/* Win / Lose Overlay */}
      {isGameOver && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="overlay-card">
            <div className={`overlay-icon ${isWinner ? "win-icon" : "lose-icon"}`}>
              {isWinner ? "🎉" : "💀"}
            </div>
            <h2 className={`overlay-title ${isWinner ? "win-text" : "lose-text"}`}>
              {isWinner ? "You Won!" : "Game Over"}
            </h2>
            <p className="overlay-message">
              {isWinner
                ? "Excellent! You guessed the word!"
                : "Better luck next time!"}
            </p>
            <p className="overlay-word">
              The word was:{" "}
              <strong className="overlay-word-value">
                {word.toUpperCase()}
              </strong>
            </p>
            <button className="new-game-btn" onClick={startNewGame}>
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Always visible New Game button */}
      {!isGameOver && (
        <div className="new-game-wrapper">
          <button className="new-game-btn secondary" onClick={startNewGame}>
            New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
