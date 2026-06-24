import { useState, useEffect, useRef } from "react";
import "./Timer.css";

export default function Timer() {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartStop = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prev) => [time, ...prev]);
    }
  };

  const format = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  };

  return (
    <div className="timer-wrapper">
      <div className="timer-card">
        <h1 className="timer-title">Stopwatch</h1>

        <div className="timer-display">{format(time)}</div>

        <div className="timer-controls">
          <button
            className={`btn btn-primary ${isRunning ? "btn-stop" : "btn-start"}`}
            onClick={handleStartStop}
          >
            {isRunning ? "Stop" : "Start"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleLap}
            disabled={!isRunning}
          >
            Lap
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isRunning && time === 0}
          >
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="laps-container">
            <h2 className="laps-title">Laps</h2>
            <ul className="laps-list">
              {laps.map((lap, index) => (
                <li key={index} className="lap-item">
                  <span className="lap-number">Lap {laps.length - index}</span>
                  <span className="lap-time">{format(lap)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
