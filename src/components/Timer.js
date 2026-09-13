import React, { useState, useEffect } from 'react';

function Timer({ todoId, timeSpent = 0, onTimeUpdate }) {
  const [seconds, setSeconds] = useState(timeSpent);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    onTimeUpdate(0);
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className="timer-icon">⏱️</span>
        <span className="timer-time">{formatTime(seconds)}</span>
        {isRunning && <span className="timer-running-indicator">●</span>}
      </div>
      <div className="timer-controls">
        {!isRunning ? (
          <button
            className="timer-button play-button"
            onClick={handleStart}
            title="Start timer"
          >
            ▶
          </button>
        ) : (
          <button
            className="timer-button pause-button"
            onClick={handlePause}
            title="Pause timer"
          >
            ⏸
          </button>
        )}
        <button
          className="timer-button reset-button"
          onClick={handleReset}
          title="Reset timer"
        >
          ↺
        </button>
      </div>
    </div>
  );
}

export default Timer;
