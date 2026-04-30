import React, { useState } from 'react';
import './Counter.css';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter-container">
      <h1>Counter App</h1>
      <div className="counter-display">
        <p className="counter-number">{count}</p>
      </div>
      <div className="button-group">
        <button 
          className="btn btn-decrease" 
          onClick={decrement}
        >
          Decrease
        </button>
        <button 
          className="btn btn-reset" 
          onClick={reset}
        >
          Reset
        </button>
        <button 
          className="btn btn-increase" 
          onClick={increment}
        >
          Increase
        </button>
      </div>
      <p className="footer-text">Click buttons to change the counter</p>
    </div>
  );
}

export default Counter;
