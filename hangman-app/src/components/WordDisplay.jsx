export default function WordDisplay({ word, guessedLetters, gameOver }) {
  return (
    <div className="word-display">
      {word.split("").map((letter, index) => {
        const isGuessed = guessedLetters.includes(letter);
        const reveal = gameOver && !isGuessed;

        return (
          <span key={index} className="letter-box">
            <span
              className={`letter ${isGuessed ? "guessed" : ""} ${
                reveal ? "reveal" : ""
              }`}
            >
              {isGuessed || reveal ? letter.toUpperCase() : ""}
            </span>
            <span className="underline" />
          </span>
        );
      })}
    </div>
  );
}
