import React, { useContext } from 'react';
import { TimerContext } from './TimerContext';
import './Timer.css';

const Timer = ({ taskId }) => {
  const {
    getTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime,
    formatTime
  } = useContext(TimerContext);

  const timer = getTimer(taskId);

  const handleStart = () => {
    if (!timer.isRunning) {
      startTimer(taskId);
    }
  };

  const handlePause = () => {
    pauseTimer(taskId);
  };

  const handleResume = () => {
    resumeTimer(taskId);
  };

  const handleReset = () => {
    resetTimer(taskId);
  };

  const handleAddTime = (seconds) => {
    addTime(taskId, seconds);
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <div className={`timer-time ${timer.isRunning ? 'running' : ''}`}>
          {formatTime(timer.seconds)}
        </div>
        <div className="timer-stats">
          <span className="timer-label">Total: {formatTime(timer.totalSeconds)}</span>
        </div>
      </div>

      <div className="timer-controls">
        {!timer.isRunning ? (
          <button
            className="timer-btn timer-btn-start"
            onClick={handleStart}
            title="Start Timer"
          >
            ▶ Start
          </button>
        ) : (
          <>
            <button
              className="timer-btn timer-btn-pause"
              onClick={handlePause}
              title="Pause Timer"
            >
              ⏸ Pause
            </button>
          </>
        )}

        {timer.isRunning && timer.seconds > 0 && (
          <button
            className="timer-btn timer-btn-resume"
            onClick={handleResume}
            title="Resume Timer"
          >
            ▶ Resume
          </button>
        )}

        {timer.seconds > 0 && (
          <button
            className="timer-btn timer-btn-reset"
            onClick={handleReset}
            title="Reset Timer"
          >
            ⟲ Reset
          </button>
        )}
      </div>

      <div className="timer-quick-add">
        <button
          className="timer-quick-btn"
          onClick={() => handleAddTime(60)}
          title="Add 1 minute"
        >
          +1m
        </button>
        <button
          className="timer-quick-btn"
          onClick={() => handleAddTime(300)}
          title="Add 5 minutes"
        >
          +5m
        </button>
        <button
          className="timer-quick-btn"
          onClick={() => handleAddTime(900)}
          title="Add 15 minutes"
        >
          +15m
        </button>
      </div>
    </div>
  );
};

export default Timer;
