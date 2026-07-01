import React, { Component, useEffect, useState } from 'react';
import './App.css';

const MAX_COUNT = 100;
const MIN_COUNT = -50;

class Counter extends Component {
  constructor(props) {
    super(props);

    const initialCount = Number.isFinite(props.initialValue) ? props.initialValue : 0;

    this.state = {
      count: initialCount,
      history: [initialCount],
    };
  }

  componentDidMount() {
    this.props.onHistoryChange(this.state.history);
  }

  componentDidUpdate(_, prevState) {
    if (prevState.history !== this.state.history) {
      this.props.onHistoryChange(this.state.history);
    }
  }

  updateCount = (nextCount) => {
    this.setState((prevState) => ({
      count: nextCount,
      history: [...prevState.history, nextCount],
    }));
  };

  increment = () => {
    this.setState((prevState) => {
      if (prevState.count >= MAX_COUNT) {
        return null;
      }

      const nextCount = prevState.count + 1;

      return {
        count: nextCount,
        history: [...prevState.history, nextCount],
      };
    });
  };

  decrement = () => {
    this.setState((prevState) => {
      if (prevState.count <= MIN_COUNT) {
        return null;
      }

      const nextCount = prevState.count - 1;

      return {
        count: nextCount,
        history: [...prevState.history, nextCount],
      };
    });
  };

  reset = () => {
    const initialCount = Number.isFinite(this.props.initialValue) ? this.props.initialValue : 0;
    this.setState({
      count: initialCount,
      history: [initialCount],
    });
  };

  handleInputChange = (event) => {
    const { value } = event.target;

    if (value === '') {
      return;
    }

    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    const boundedValue = Math.min(MAX_COUNT, Math.max(MIN_COUNT, parsedValue));
    this.updateCount(boundedValue);
  };

  getStatusMessage = () => {
    const { count } = this.state;

    if (count > 80) {
      return 'Excellent!';
    }

    if (count > 50) {
      return 'Good progress!';
    }

    if (count > 0) {
      return 'Keep going!';
    }

    if (count < 0) {
      return 'Negative territory';
    }

    return 'Start here';
  };

  render() {
    const { count, history } = this.state;
    const recentHistory = history.slice(-5);

    return (
      <section className="counter-container">
        <h2 className="counter-title">Counter App</h2>

        <div className="counter-panel">
          <p className="counter-value" aria-live="polite">
            {count}
          </p>

          <div className="history-preview" aria-label="Recent counter history">
            {recentHistory.map((item, index) => (
              <span key={`${item}-${history.length - recentHistory.length + index}`} className="history-chip">
                {item}
              </span>
            ))}
          </div>

          <p className="status-message">{this.getStatusMessage()}</p>

          <div className="button-row">
            <button type="button" onClick={this.increment} disabled={count >= MAX_COUNT}>
              + Increment
            </button>
            <button type="button" onClick={this.decrement} disabled={count <= MIN_COUNT}>
              - Decrement
            </button>
            <button type="button" onClick={this.reset}>
              Reset
            </button>
          </div>

          <div className="input-row">
            <label htmlFor="counter-input">Set value</label>
            <input
              id="counter-input"
              type="number"
              min={MIN_COUNT}
              max={MAX_COUNT}
              onChange={this.handleInputChange}
              placeholder="Set value"
            />
          </div>
        </div>
      </section>
    );
  }
}

function HistoryTracker({ history }) {
  return (
    <section className="history-section">
      <h2>History</h2>
      <div className="history-list">
        {history.map((item, index) => (
          <div key={`${item}-${index}`} className="history-item">
            Step {index + 1}: {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [showCounter, setShowCounter] = useState(true);
  const [history, setHistory] = useState([0]);

  useEffect(() => {
    if (!showCounter) {
      setHistory([]);
    }
  }, [showCounter]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Counter Application</h1>
        <button type="button" onClick={() => setShowCounter((currentValue) => !currentValue)}>
          Toggle Counter
        </button>
      </header>

      <main className="app-content">
        {showCounter ? (
          <Counter initialValue={0} onHistoryChange={setHistory} />
        ) : (
          <p className="counter-hidden-message">Counter is hidden.</p>
        )}

        <HistoryTracker history={history} />
      </main>
    </div>
  );
}

export default App;
