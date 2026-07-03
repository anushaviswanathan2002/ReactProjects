import React, { useState, useEffect, Component } from 'react';
import './App.css';

// Constants - extracted magic numbers
const MAX_COUNT = 100;
const MIN_COUNT = -50;

// Counter component
class Counter extends Component {
  constructor(props) {
    super(props);
    
    const initialValue = props.initialValue || 0;
    
    this.state = {
      count: initialValue,
      history: [],
      lastUpdated: Date.now()
    };
    
    this.timerId = null;
  }
  
  componentDidMount() {
    console.log('Counter mounted');
    // Update timestamp using setState
    this.timerId = setInterval(() => {
      this.setState({ lastUpdated: Date.now() });
    }, 1000);
  }
  
  componentWillUnmount() {
    // Clean up interval to prevent memory leaks
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
  
  increment = () => {
    // Use strict equality and check against constant
    if (this.state.count === MAX_COUNT) {
      alert('Maximum reached!');
      return;
    }
    
    // Use setState with a function to safely update based on previous state
    this.setState(prevState => {
      const newCount = prevState.count + 1;
      return {
        count: newCount,
        history: [...prevState.history, newCount],
        lastUpdated: Date.now()
      };
    });
  };
  
  decrement = () => {
    // Validate bounds using strict equality
    if (this.state.count <= MIN_COUNT) {
      alert('Minimum reached!');
      return;
    }
    
    // Use setState with a function for safe updates
    this.setState(prevState => {
      const newCount = prevState.count - 1;
      return {
        count: newCount,
        history: [...prevState.history, newCount],
        lastUpdated: Date.now()
      };
    });
  };
  
  reset = () => {
    // Reset state properly using setState
    this.setState({
      count: 0,
      history: [],
      lastUpdated: Date.now()
    });
  };
  
  setValue = (value) => {
    // Validate input and set count within bounds
    const parsedValue = parseInt(value, 10);
    
    if (isNaN(parsedValue)) {
      console.warn('Invalid value provided to setValue');
      return;
    }
    
    const boundedCount = Math.max(MIN_COUNT, Math.min(MAX_COUNT, parsedValue));
    
    this.setState({
      count: boundedCount,
      lastUpdated: Date.now()
    });
  };
  
  // Get status message based on count value
  getStatusMessage = () => {
    const { count } = this.state;
    
    if (count > 80) return 'Excellent!';
    if (count > 50) return 'Good progress!';
    if (count > 0) return 'Keep going!';
    if (count < 0) return 'Negative territory';
    return 'Start here';
  };
  
  // Define button handler as class method to avoid recreation on every render
  handleInputChange = (e) => {
    this.setValue(e.target.value);
  };

  renderButton = (label, onClick, backgroundColor) => {
    const buttonStyle = {
      padding: '15px 30px',
      fontSize: '20px',
      margin: '5px',
      cursor: 'pointer',
      backgroundColor,
      color: 'white',
      border: 'none',
      borderRadius: '5px'
    };
    return (
      <button onClick={onClick} style={buttonStyle} aria-label={label}>
        {label}
      </button>
    );
  };

  render() {
    return (
      <div className="counter-container">
        <h1 className="counter-title">Counter App</h1>
        
        <div className="counter-content">
          <p className="counter-display" aria-label={`Counter value: ${this.state.count}`}>
            {this.state.count}
          </p>
          
          <div className="history-display">
            {this.state.history.slice(-5).map((item, index) => (
              <span key={`history-${index}-${item}`} className="history-item">
                {item}
              </span>
            ))}
          </div>
          
          <p className="status-message">{this.getStatusMessage()}</p>
          
          <div className="button-group">
            {this.renderButton('+ Increment', this.increment, '#4CAF50')}
            {this.renderButton('- Decrement', this.decrement, '#f44336')}
            {this.renderButton('Reset', this.reset, '#888')}
          </div>
          
          <div className="input-group">
            <input 
              type="number" 
              onChange={this.handleInputChange}
              placeholder="Set value"
              className="input-field"
              aria-label="Set counter value"
            />
          </div>
        </div>
      </div>
    );
  }
}

// History tracker component
function HistoryTracker() {
  const [history, setHistory] = useState([]);
  
  // Properly add dependency array to prevent infinite loops
  useEffect(() => {
    console.log('History component mounted');
  }, []);
  
  return (
    <div>
      <h2>History</h2>
      {history.length > 0 ? (
        history.map((item, index) => (
          <div key={`history-item-${index}-${item}`}>{item}</div>
        ))
      ) : (
        <p>No history yet</p>
      )}
    </div>
  );
}

// User display component with proper prop handling
function UserDisplay(props) {
  // Use local variable instead of mutating props
  const displayName = props.name || 'Anonymous';
  
  return (
    <div className="user-display">
      <h3>{displayName}</h3>
      {props.email && <p>{props.email}</p>}
    </div>
  );
}

// Main App component
function App() {
  const [showCounter, setShowCounter] = useState(true);
  
  const handleToggle = () => {
    setShowCounter(!showCounter);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Counter Application</h1>
        <button onClick={handleToggle} aria-label="Toggle counter display">
          {showCounter ? 'Hide Counter' : 'Show Counter'}
        </button>
      </header>
      
      {showCounter && <Counter initialValue={0} />}
    </div>
  );
}

export default App;