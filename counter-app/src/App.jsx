import { useState } from 'react'
import './App.css'

const MIN = -100
const MAX = 100
const STEP_OPTIONS = [1, 5, 10]

function App() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  const increment = () => setCount((c) => Math.min(c + step, MAX))
  const decrement = () => setCount((c) => Math.max(c - step, MIN))
  const reset = () => setCount(0)

  const getCounterColor = () => {
    if (count > 0) return 'positive'
    if (count < 0) return 'negative'
    return 'zero'
  }

  const isAtMax = count === MAX
  const isAtMin = count === MIN

  return (
    <div className="app-wrapper">
      <div className="counter-card">
        <h1 className="app-title">Counter App</h1>

        {/* Limit Indicator */}
        <div className="limit-bar">
          <span className={`limit-label ${isAtMin ? 'limit-active' : ''}`}>
            MIN: {MIN}
          </span>
          <span className={`limit-label ${isAtMax ? 'limit-active' : ''}`}>
            MAX: {MAX}
          </span>
        </div>

        {/* Progress Track */}
        <div className="progress-track">
          <div
            className={`progress-fill ${getCounterColor()}`}
            style={{
              width: `${((count - MIN) / (MAX - MIN)) * 100}%`,
            }}
          />
        </div>

        {/* Counter Display */}
        <div className={`counter-display ${getCounterColor()}`}>
          {count > 0 ? `+${count}` : count}
        </div>

        {/* Status Badge */}
        <div className={`status-badge ${getCounterColor()}`}>
          {count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}
        </div>

        {/* Step Selector */}
        <div className="step-selector">
          <span className="step-label">Step Size:</span>
          <div className="step-buttons">
            {STEP_OPTIONS.map((s) => (
              <button
                key={s}
                className={`step-btn ${step === s ? 'step-btn-active' : ''}`}
                onClick={() => setStep(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-decrement"
            onClick={decrement}
            disabled={isAtMin}
            title={isAtMin ? `Minimum value reached (${MIN})` : `Decrement by ${step}`}
          >
            − {step}
          </button>

          <button
            className="btn btn-reset"
            onClick={reset}
            disabled={count === 0}
            title="Reset to zero"
          >
            Reset
          </button>

          <button
            className="btn btn-increment"
            onClick={increment}
            disabled={isAtMax}
            title={isAtMax ? `Maximum value reached (${MAX})` : `Increment by ${step}`}
          >
            + {step}
          </button>
        </div>

        {/* Boundary Warnings */}
        {(isAtMax || isAtMin) && (
          <div className={`boundary-warning ${isAtMax ? 'warning-max' : 'warning-min'}`}>
            {isAtMax
              ? `⚠ Maximum limit of ${MAX} reached`
              : `⚠ Minimum limit of ${MIN} reached`}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
