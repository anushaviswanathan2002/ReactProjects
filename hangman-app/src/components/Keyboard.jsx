const KEYS = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Keyboard({ guessedLetters, word, onGuess, disabled }) {
  return (
    <div className="keyboard">
      {KEYS.map((letter) => {
        const isCorrect = guessedLetters.includes(letter) && word.includes(letter);
        const isWrong = guessedLetters.includes(letter) && !word.includes(letter);
        const isUsed = guessedLetters.includes(letter);

        return (
          <button
            key={letter}
            className={`key-btn ${isCorrect ? "correct" : ""} ${
              isWrong ? "wrong" : ""
            }`}
            onClick={() => onGuess(letter)}
            disabled={isUsed || disabled}
            aria-label={`Letter ${letter.toUpperCase()}`}
          >
            {letter.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
