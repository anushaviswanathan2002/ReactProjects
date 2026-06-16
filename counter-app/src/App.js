import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const MAX_HISTORY = 5;
const DEFAULT_MIN = -100;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;

function getCountColor(count) {
  if (count > 0) return 'positive';
  if (count < 0) return 'negative';
  return 'zero';
}

function formatOperation(op) {
  const sign = op.delta > 0 ? `+${op.delta}` : `${op.delta}`;
  return `${op.prevCount} → ${op.newCount}  (${sign})`;
}

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(DEFAULT_STEP);
  const [min, setMin] = useState(DEFAULT_MIN);
  const [max, setMax] = useState(DEFAULT_MAX);
  const [history, setHistory] = useState([]);
  const [animClass, setAnimClass] = useState('');
  const [stepError, setStepError] = useState('');
  const [rangeError, setRangeError] = useState('');

  // Validate step input
  const handleStepChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val <= 0) {
      setStepError('Step must be a positive integer.');
      setStep(e.target.value);
    } else {
      setStepError('');
      setStep(val);
    }
  };

  // Validate min/max inputs
  const handleMinChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setMin(isNaN(val) ? e.target.value : val);
    if (!isNaN(val) && val >= max) {
      setRangeError('Min must be less than Max.');
    } else {
      setRangeError('');
    }
  };

  const handleMaxChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setMax(isNaN(val) ? e.target.value : val);
    if (!isNaN(val) && val <= min) {
      setRangeError('Max must be greater than Min.');
    } else {
      setRangeError('');
    }
  };

  const triggerAnimation = useCallback((direction) => {
    setAnimClass(direction === 'up' ? 'anim-up' : 'anim-down');
    setTimeout(() => setAnimClass(''), 350);
  }, []);

  const pushHistory = useCallback((prevCount, newCount, delta) => {
    setHistory((prev) => {
      const entry = {
        id: Date.now(),
        prevCount,
        newCount,
        delta,
        label: delta === 0 ? 'Reset' : delta > 0 ? 'Increment' : 'Decrement',
      };
      return [entry, ...prev].slice(0, MAX_HISTORY);
    });
  }, []);

  const increment = useCallback(() => {
    const validStep = typeof step === 'number' && step > 0 ? step : DEFAULT_STEP;
    setCount((prev) => {
      const next = Math.min(prev + validStep, max);
      if (next !== prev) {
        triggerAnimation('up');
        pushHistory(prev, next, next - prev);
      }
      return next;
    });
  }, [step, max, triggerAnimation, pushHistory]);

  const decrement = useCallback(() => {
    const validStep = typeof step === 'number' && step > 0 ? step : DEFAULT_STEP;
    setCount((prev) => {
      const next = Math.max(prev - validStep, min);
      if (next !== prev) {
        triggerAnimation('down');
        pushHistory(prev, next, next - prev);
      }
      return next;
    });
  }, [step, min, triggerAnimation, pushHistory]);

  const reset = useCallback(() => {
    setCount((prev) => {
      if (prev !== 0) {
        triggerAnimation(prev > 0 ? 'down' : 'up');
        pushHistory(prev, 0, -prev);
      }
      return 0;
    });
  }, [triggerAnimation, pushHistory]);

  // Clamp count if min/max change
  useEffect(() => {
    setCount((prev) => {
      const clamped = Math.min(Math.max(prev, min), max);
      return clamped;
    });
  }, [min, max]);

  const validStep = typeof step === 'number' && step > 0 ? step : DEFAULT_STEP;
  const atMax = count >= max;
  const atMin = count <= min;
  const colorClass = getCountColor(count);

  // Percentage bar for visual range indicator
  const rangeSpan = max - min;
  const fillPercent = rangeSpan > 0 ? ((count - min) / rangeSpan) * 100 : 50;

  return (
    <div className="app-wrapper">
      <div className="card">
        {/* Header */}
        <header className="card-header">
          <span className="header-icon">🔢</span>
          <h1 className="header-title">Counter App</h1>
        </header>

        {/* Count Display */}
        <div className={`count-display ${colorClass} ${animClass}`}>
          <span className="count-value">{count}</span>
          <span className={`count-badge ${colorClass}`}>
            {count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}
          </span>
        </div>

        {/* Range Progress Bar */}
        <div className="range-bar-container" title={`Range: ${min} to ${max}`}>
          <span className="range-label">{min}</span>
          <div className="range-bar">
            <div
              className={`range-fill ${colorClass}`}
              style={{ width: `${Math.max(0, Math.min(fillPercent, 100))}%` }}
            />
            <div
              className="range-thumb"
              style={{ left: `${Math.max(0, Math.min(fillPercent, 100))}%` }}
            />
          </div>
          <span className="range-label">{max}</span>
        </div>

        {/* Main Buttons */}
        <div className="button-row">
          <button
            className="btn btn-decrement"
            onClick={decrement}
            disabled={atMin}
            title={atMin ? `Already at minimum (${min})` : `Decrement by ${validStep}`}
          >
            <span className="btn-icon">−</span>
            <span className="btn-label">-{validStep}</span>
          </button>

          <button
            className="btn btn-reset"
            onClick={reset}
            title="Reset to 0"
          >
            <span className="btn-icon">↺</span>
            <span className="btn-label">Reset</span>
          </button>

          <button
            className="btn btn-increment"
            onClick={increment}
            disabled={atMax}
            title={atMax ? `Already at maximum (${max})` : `Increment by ${validStep}`}
          >
            <span className="btn-icon">+</span>
            <span className="btn-label">+{validStep}</span>
          </button>
        </div>

        {/* Limit indicators */}
        <div className="limit-indicators">
          {atMin && <span className="limit-badge limit-min">⚠ Min limit reached ({min})</span>}
          {atMax && <span className="limit-badge limit-max">⚠ Max limit reached ({max})</span>}
        </div>

        {/* Settings Panel */}
        <div className="settings-panel">
          <h2 className="settings-title">⚙ Settings</h2>
          <div className="settings-grid">
            {/* Step Size */}
            <div className="setting-group">
              <label htmlFor="step-input" className="setting-label">
                Step Size
              </label>
              <input
                id="step-input"
                className={`setting-input ${stepError ? 'input-error' : ''}`}
                type="number"
                min="1"
                value={step}
                onChange={handleStepChange}
              />
              {stepError && <span className="error-msg">{stepError}</span>}
            </div>

            {/* Min */}
            <div className="setting-group">
              <label htmlFor="min-input" className="setting-label">
                Min Value
              </label>
              <input
                id="min-input"
                className={`setting-input ${rangeError ? 'input-error' : ''}`}
                type="number"
                value={min}
                onChange={handleMinChange}
              />
            </div>

            {/* Max */}
            <div className="setting-group">
              <label htmlFor="max-input" className="setting-label">
                Max Value
              </label>
              <input
                id="max-input"
                className={`setting-input ${rangeError ? 'input-error' : ''}`}
                type="number"
                value={max}
                onChange={handleMaxChange}
              />
              {rangeError && <span className="error-msg">{rangeError}</span>}
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="history-panel">
          <h2 className="settings-title">📋 History <span className="history-sub">(last {MAX_HISTORY})</span></h2>
          {history.length === 0 ? (
            <p className="history-empty">No operations yet. Start counting!</p>
          ) : (
            <ul className="history-list">
              {history.map((entry, idx) => (
                <li
                  key={entry.id}
                  className={`history-item ${idx === 0 ? 'history-latest' : ''}`}
                >
                  <span className={`history-op-badge ${entry.delta > 0 ? 'op-inc' : entry.delta < 0 ? 'op-dec' : 'op-reset'}`}>
                    {entry.label}
                  </span>
                  <span className="history-detail">{formatOperation(entry)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="card-footer">
          Built with React Hooks · useState · useEffect · useCallback
        </footer>
      </div>
    </div>
  );
}
