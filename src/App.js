import React, { useState, Component } from 'react';
import './App.css';

// Counter component - Fixed version
class Counter extends Component {
  constructor(props) {
    super(props);
    
    // Validate and use default value without mutating props
    const initialCount = typeof props.initialValue === 'number' ? props.initialValue : 0;
    
    this.state = {
      count: initialCount,
      history: []
    };
    
    this.maxCount = 100;
    this.minCount = -50;
    
    // Bind methods to preserve 'this' context
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
    this.setValue = this.setValue.bind(this);
  }
  
  componentDidMount() {
    console.log('Counter mounted');
  }
  
  componentWillUnmount() {
    // Cleanup handled via useEffect in functional component
  }
  
  increment() {
    if (this.state.count >= this.maxCount) {
      alert('Maximum reached!');
      return;
    }
    
    this.setState(prevState => ({
      count: prevState.count + 1,
      history: [...prevState.history, prevState.count + 1]
    }));
  }
  
  decrement() {
    if (this.state.count <= this.minCount) {
      return;
    }
    
    this.setState(prevState => ({
      count: prevState.count - 1,
      history: [...prevState.history, prevState.count - 1]
    }));
  }
  
  reset() {
    const initialCount = typeof this.props.initialValue === 'number' ? this.props.initialValue : 0;
    this.setState({
      count: initialCount,
      history: []
    });
  }
  
  setValue(value) {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      return;
    }
    
    this.setState({
      count: parsed,
      history: [...this.state.history, parsed]
    });
  }
  
  getStatusMessage() {
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
  }
  
  render() {
    const { count, history } = this.state;
    const lastFiveHistory = history.slice(-5);
    
    return (
      <div className="counter-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: 'blue', fontSize: '36px', marginBottom: '20px' }}>Counter App</h1>
        
        <div style={{ backgroundColor: '#f0f0f0', padding: '30px', borderRadius: '10px' }}>
          <p 
            style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}
            aria-label={`Current count: ${count}`}
          >
            {count}
          </p>
          
          <div style={{ margin: '10px 0' }} role="list" aria-label="History">
            {lastFiveHistory.map((item, index) => (
              <span 
                key={`history-${index}`} 
                style={{ margin: '0 5px' }}
                role="listitem"
              >
                {item}
              </span>
            ))}
          </div>
          
          <p style={{ color: '#666' }}>{this.getStatusMessage()}</p>
          
          <div className="button-group">
            <button 
              onClick={this.increment}
              className="btn btn-increment"
              aria-label="Increment counter"
            >
              + Increment
            </button>
            
            <button 
              onClick={this.decrement}
              className="btn btn-decrement"
              aria-label="Decrement counter"
            >
              - Decrement
            </button>
            
            <button 
              onClick={this.reset}
              className="btn btn-reset"
              aria-label="Reset counter"
            >
              Reset
            </button>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="counter-input" className="sr-only">Set counter value</label>
            <input 
              id="counter-input"
              type="number" 
              onChange={(e) => this.setValue(e.target.value)}
              placeholder="Set value"
              className="counter-input"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Counter;
