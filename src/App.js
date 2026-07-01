import React, { useEffect, useState, Component } from 'react';
import './App.css';

const MAX_COUNT = 100;
const MIN_COUNT = -50;
const HISTORY_LIMIT = 5;

class Counter extends Component {
  constructor(props) {
    super(props);

    const initialCount = Number.isFinite(props.initialValue) ? props.initialValue : 0;

    this.state = {
      count: initialCount,
      history: [],
      lastUpdated: Date.now(),
      inputValue: String(initialCount)
    };

    this.timerId = null;
  }

  componentDidMount() {
    this.props.onHistoryChange([]);

    this.timerId = setInterval(() => {
      this.setState({ lastUpdated: Date.now() });
    }, 1000);
  }

  componentDidUpdate(_, prevState) {
    if (prevState.history !== this.state.history) {
      this.props.onHistoryChange(this.state.history);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
    this.props.onHistoryChange([]);
  }

  updateCount = (nextCount) => {
    this.setState((prevState) => ({
      count: nextCount,
      history: [...prevState.history, nextCount],
      inputValue: String(nextCount)
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
        inputValue: String(nextCount)
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
        inputValue: String(nextCount)
      };
    });
  };

  reset = () => {
    const resetCount = Number.isFinite(this.props.initialValue) ? this.props.initialValue : 0;

    this.setState({
      count: resetCount,
      history: [],
      inputValue: String(resetCount)
    });
  };

  setValue = (value) => {
    if (value === '') {
      this.setState({ inputValue: '' });
      return;
    }

    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    const boundedValue = Math.min(MAX_COUNT, Math.max(MIN_COUNT, parsedValue));
    this.updateCount(boundedValue);
  };

  handleInputChange = (event) => {
    this.setValue(event.target.value);
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
    const { count, history, inputValue, lastUpdated } = this.state;

    return (
      <section className="counter-container">
        <h2 className="counter-title">Counter App</h2>

        <div className="counter-card">
          <p className="counter-value" aria-live="polite">
            {count}
          </p>

          <div className="counter-history" aria-label="Recent counter history">
            {history.slice(-HISTORY_LIMIT).map((item, index) => (
              <span key={`${item}-${index}`} className="history-item">
                {item}
              </span>
            ))}
          </div>

          <p className="counter-status">{this.getStatusMessage()}</p>

          <div className="button-row">
            <button type="button" onClick={this.increment} aria-label="Increment counter">
              + Increment
            </button>
            <button type="button" onClick={this.decrement} aria-label="Decrement counter">
              - Decrement
            </button>
            <button type="button" onClick={this.reset} aria-label="Reset counter">
              Reset
            </button>
          </div>

          <div className="input-row">
            <label className="sr-only" htmlFor="counter-value-input">
              Set counter value
            </label>
            <input
              id="counter-value-input"
              type="number"
              value={inputValue}
              onChange={this.handleInputChange}
              placeholder="Set value"
              min={MIN_COUNT}
              max={MAX_COUNT}
            />
          </div>

          <p className="counter-timestamp">Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
        </div>
      </section>
    );
  }
}

function HistoryTracker({ history }) {
  useEffect(() => {
    document.title = history.length > 0
      ? `Counter updates (${history.length})`
      : 'React Counter Application';

    return () => {
      document.title = 'React Counter Application';
    };
  }, [history]);

  return (
    <section className="history-panel">
      <h2>History</h2>
      {history.length === 0 ? (
        <p>No changes recorded yet.</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function App() {
  const [showCounter, setShowCounter] = useState(true);
  const [history, setHistory] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Counter Application</h1>
        <button type="button" onClick={() => setShowCounter((current) => !current)}>
          Toggle Counter
        </button>
      </header>

      {showCounter ? <Counter initialValue={0} onHistoryChange={setHistory} /> : null}
      <HistoryTracker history={history} />
    </div>
  );
}

export default App;
