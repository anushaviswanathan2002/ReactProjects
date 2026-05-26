const HEAD = (
  <circle
    key="head"
    cx="140"
    cy="60"
    r="22"
    stroke="#e0e0e0"
    strokeWidth="4"
    fill="none"
  />
);

const BODY = (
  <line
    key="body"
    x1="140"
    y1="82"
    x2="140"
    y2="165"
    stroke="#e0e0e0"
    strokeWidth="4"
    strokeLinecap="round"
  />
);

const LEFT_ARM = (
  <line
    key="left-arm"
    x1="140"
    y1="105"
    x2="100"
    y2="140"
    stroke="#e0e0e0"
    strokeWidth="4"
    strokeLinecap="round"
  />
);

const RIGHT_ARM = (
  <line
    key="right-arm"
    x1="140"
    y1="105"
    x2="180"
    y2="140"
    stroke="#e0e0e0"
    strokeWidth="4"
    strokeLinecap="round"
  />
);

const LEFT_LEG = (
  <line
    key="left-leg"
    x1="140"
    y1="165"
    x2="100"
    y2="210"
    stroke="#e0e0e0"
    strokeWidth="4"
    strokeLinecap="round"
  />
);

const RIGHT_LEG = (
  <line
    key="right-leg"
    x1="140"
    y1="165"
    x2="180"
    y2="210"
    stroke="#e0e0e0"
    strokeWidth="4"
    strokeLinecap="round"
  />
);

const BODY_PARTS = [HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG];

export default function HangmanDrawing({ wrongGuessCount }) {
  return (
    <svg
      className="hangman-svg"
      viewBox="0 0 220 260"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Hangman drawing with ${wrongGuessCount} wrong guesses`}
    >
      {/* Gallows */}
      {/* Base */}
      <line
        x1="10"
        y1="250"
        x2="210"
        y2="250"
        stroke="#7c8cad"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Vertical pole */}
      <line
        x1="60"
        y1="250"
        x2="60"
        y2="10"
        stroke="#7c8cad"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Horizontal beam */}
      <line
        x1="60"
        y1="10"
        x2="140"
        y2="10"
        stroke="#7c8cad"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Rope */}
      <line
        x1="140"
        y1="10"
        x2="140"
        y2="38"
        stroke="#7c8cad"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Support brace */}
      <line
        x1="60"
        y1="50"
        x2="100"
        y2="10"
        stroke="#7c8cad"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Body parts rendered based on wrong guess count */}
      {BODY_PARTS.slice(0, wrongGuessCount)}
    </svg>
  );
}
