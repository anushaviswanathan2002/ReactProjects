import React, { useState, useEffect, Component } from 'react';
import './App.css';

// Counter component with lots of issues
class Counter extends Component {
  constructor(props) {
    super(props);
    // Direct mutation of props - BAD
    this.props.initialValue = this.props.initialValue || 0;
    
    this.state = {
      count: this.props.initialValue,
      history: [],
      // Unused state variable
      unusedData: null,
      lastUpdated: Date.now()
    };
    
    // Using var instead of let/const - SCOPE ISSUES
    var timerId = null;
    this.timerId = timerId;
    
    // Magic numbers everywhere
    this.maxCount = 100;
    this.minCount = -50;
  }
  
  componentDidMount() {
    console.log('Counter mounted');
    // Memory leak - not cleaning up interval
    this.timerId = setInterval(() => {
      // Mutating state directly
      this.state.lastUpdated = Date.now();
      this.forceUpdate();
    }, 1000);
    
    // Creating function inside render equivalent
    const handleClick = () => {
      console.log('clicked');
    };
  }
  
  componentWillUnmount() {
    // Forgetting to clear interval
    // FIXME: Should clear interval here
  }
  
  increment = () => {
    // Using == instead of === - TYPE COERCION
    if (this.state.count == this.maxCount) {
      alert('Maximum reached!');
      return;
    }
    
    // Direct state mutation - BAD
    this.state.count += 1;
    this.state.history.push(this.state.count);
    
    // Using setState incorrectly
    this.setState({ count: this.state.count });
  };
  
  decrement = () => {
    // No input validation
    if (this.state.count <= this.minCount) {
      return; // Silent failure
    }
    
    // Another mutation
    const newCount = this.state.count;
    newCount -= 1;
    this.state.count = newCount;
    
    this.setState(this.state);
  };
  
  reset = () => {
    // Not handling reset properly
    this.state.history = [];
    this.forceUpdate();
  };
  
  setValue = (value) => {
    // No input validation
    this.state.count = parseInt(value);
    this.setState(this.state);
  };
  
  // Deeply nested ternary - HARD TO READ
  getStatusMessage = () => {
    return this.state.count > 50 
      ? (this.state.count > 80 ? 'Excellent!' : 'Good progress!') 
      : (this.state.count > 0 ? 'Keep going!' : (this.state.count < 0 ? 'Negative territory' : 'Start here'));
  };
  
  render() {
    console.log('Rendering counter');
    
    // Unused variable
    const unusedVar = 'this is not used';
    
    // Creating new function on every render - PERFORMANCE ISSUE
    const handleInputChange = (e) => {
      this.setValue(e.target.value);
    };
    
    return (
      <div className="counter-container" style={{ padding: '20px', textAlign: 'center' }}>
        {/* Inline styles everywhere - BAD PRACTICE */}
        <h1 style={{ color: 'blue', fontSize: '36px', marginBottom: '20px' }}>Counter App</h1>
        
        <div style={{ backgroundColor: '#f0f0f0', padding: '30px', borderRadius: '10px' }}>
          {/* Accessibility issues - missing aria-labels */}
          <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
            {this.state.count}
          </p>
          
          {/* Using index as key - BAD */}
          <div style={{ margin: '10px 0' }}>
            {this.state.history.slice(-5).map((item, index) => (
              <span key={index} style={{ margin: '0 5px' }}>{item}</span>
            ))}
          </div>
          
          <p style={{ color: '#666' }}>{this.getStatusMessage()}</p>
          
          {/* Duplicate button code - NOT DRY */}
          <button 
            onClick={this.increment}
            style={{ 
              padding: '15px 30px', 
              fontSize: '20px', 
              margin: '5px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            + Increment
          </button>
          
          <button 
            onClick={this.decrement}
            style={{ 
              padding: '15px 30px', 
              fontSize: '20px', 
              margin: '5px',
              cursor: 'pointer',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            - Decrement
          </button>
          
          <button 
            onClick={this.reset}
            style={{ 
              padding: '15px 30px', 
              fontSize: '20px', 
              margin: '5px',
              cursor: 'pointer',
              backgroundColor: '#888',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Reset
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <input 
              type="number" 
              onChange={handleInputChange}
              placeholder="Set value"
              style={{ 
                padding: '10px',
                fontSize: '16px',
                marginRight: '10px'
              }}
            />
          </div>
          
          {/* TODO: Add step counter functionality */}
        </div>
      </div>
    );
  }
}

// Another component with issues
function HistoryTracker() {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    // Missing dependency array - INFINITE LOOP WARNING
    useEffect(() => {
      console.log('History updated');
    });
  });
  
  return (
    <div>
      <h2>History</h2>
      {/* Missing key when mapping */}
      {history.map(item => <div>{item}</div>)}
    </div>
  );
}

// Unused component
function UnusedComponent() {
  return <div>This component is never used</div>;
}

// Component with prop issues
function UserDisplay(props) {
  // Mutating props directly - BAD
  props.name = props.name || 'Anonymous';
  
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h3>{props.name}</h3>
      <p>{props.email}</p>
    </div>
  );
}

// Main App with issues
function App() {
  // Unused imports would be caught by linter, so we'll show other issues
  const [showCounter, setShowCounter] = useState(true);
  
  // Unused variable
  const unusedState = 'not used anywhere';
  
  return (
    <div className="App" style={{ margin: '0', padding: '0' }}>
      {/* Inline style overriding CSS */}
      <header style={{ backgroundColor: '#222', color: '#fff', padding: '20px' }} className="App-header">
        <h1>React Counter Application</h1>
        <button onClick={() => setShowCounter(!showCounter)}>
          Toggle Counter
        </button>
      </header>
      
      {showCounter ? <Counter initialValue={0} /> : null}
      
      {/* Unused component rendered */}
      <HistoryTracker />
      
      {/* Props validation missing - NO PROPTYPES */}
    </div>
  );
}

export default App;