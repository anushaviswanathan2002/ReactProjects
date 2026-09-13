import React, { useState, useEffect } from 'react';

const Stopwatch = ({ isRunning, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(isRunning || false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(sec => sec + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(seconds);
    }
  }, [seconds, onTimeUpdate]);

  useEffect(() => {
    setIsActive(isRunning);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-display">
        <div className="time">{formatTime(seconds)}</div>
      </div>
      <div className="stopwatch-controls">
        <button 
          className="btn btn-small"
          onClick={toggleTimer}
        >
          {isActive ? '⏸ Pause' : '▶ Start'}
        </button>
        <button 
          className="btn btn-small btn-reset"
          onClick={resetTimer}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
