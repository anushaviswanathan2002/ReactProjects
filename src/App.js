import React, { useState, useEffect, useRef, Component } from 'react';
import './App.css';

// ============================================
// ISSUE 1: Memory leak - global event listener never cleaned up
// ============================================
window.addEventListener('scroll', () => {
  console.log('Scrolled');
});

// ============================================
// ISSUE 2: Unused variables and imports
// ============================================
const UNUSED_CONSTANT = 'this should not be here';
function unusedHelperFunction() {
  return 'not used anywhere';
}

// ============================================
// ISSUE 3: Class component with multiple state mutation bugs
// ============================================
class TodoItem extends Component {
  constructor(props) {
    super(props);
    // ISSUE 4: Direct mutation of props
    this.props.completed = this.props.completed || false;
    
    this.state = {
      text: this.props.text,
      completed: this.props.completed,
      // ISSUE 5: Unused state variable
      unusedField: null,
      createdAt: Date.now(),
      // ISSUE 6: Storing non-serializable data in state
      callback: () => {}
    };
  }

  // ISSUE 7: Not cleaning up callback in state
  componentDidMount() {
    console.log('TodoItem mounted');
  }

  toggleComplete = () => {
    // ISSUE 8: Direct state mutation
    this.state.completed = !this.state.completed;
    // ISSUE 9: setState called with mutated state
    this.setState(this.state);
    // ISSUE 10: Not calling parent's update callback
  };

  // ISSUE 11: Deeply nested ternary - hard to read
  getDisplayText = () => {
    return this.state.completed 
      ? (this.state.text.length > 20 ? '✓ Done: ' + this.state.text : '✓ ' + this.state.text)
      : (this.state.text.length > 20 ? 'In progress: ' + this.state.text : this.state.text);
  };

  render() {
    // ISSUE 12: Creating new function on every render
    const handleClick = () => {
      this.toggleComplete();
    };

    // ISSUE 13: Unused variable in render
    const temp = 'wasteful';

    return (
      <div className="todo-item">
        {/* ISSUE 14: Missing accessibility attributes */}
        <input 
          type="checkbox"
          checked={this.state.completed}
          onChange={handleClick}
        />
        <span style={{
          textDecoration: this.state.completed ? 'line-through' : 'none',
          color: this.state.completed ? '#888' : '#333'
        }}>
          {this.state.text}
        </span>
        {/* ISSUE 15: No delete button functionality */}
        <button>Delete</button>
      </div>
    );
  }
}

// ============================================
// ISSUE 16: Functional component with infinite loop
// ============================================
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef(null);

  // ISSUE 17: Missing dependency array causes infinite loop
  useEffect(() => {
    setTodos([...todos]);
  });

  // ISSUE 18: Side effect in render
  if (todos.length > 100) {
    console.log('Too many todos!');
  }

  // ISSUE 19: using == instead of ===
  const hasTodos = todos.length == 0;

  // ISSUE 20: Creating function inside render
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      // ISSUE 21: Direct state mutation
      todos.push({
        id: Date.now(),
        text: newTodo,
        completed: false
      });
      setTodos(todos);
      setNewTodo('');
    }
  };

  // ISSUE 22: Another inline function
  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
    // ISSUE 23: Accessing DOM directly
    console.log(inputRef.current.value);
  };

  // ISSUE 24: Non-idempotent key assignment
  const getTodoKey = (todo) => {
    return Math.random().toString(36);
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      {/* ISSUE 25: Missing accessibility labels */}
      <input
        ref={inputRef}
        type="text"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Add a new todo..."
      />
      <button onClick={handleAddTodo}>Add</button>
      
      <ul>
        {/* ISSUE 26: Using non-stable key from random */}
        {todos.map((todo) => (
          <li key={getTodoKey(todo)}>
            <TodoItem text={todo.text} completed={todo.completed} />
          </li>
        ))}
      </ul>
      
      {/* ISSUE 27: Magic number */}
      {todos.length > 10 && <p>You have many todos!</p>}
    </div>
  );
}

// ============================================
// ISSUE 28: Another unused component
// ============================================
function StatisticsComponent() {
  // ISSUE 29: Unused state
  const [stats, setStats] = useState({ count: 0 });
  
  return (
    <div className="statistics">
      {/* ISSUE 30: Inline style instead of CSS class */}
      <p style={{ fontSize: '14px', color: '#666' }}>
        Statistics will go here
      </p>
    </div>
  );
}

// ============================================
// ISSUE 31: Filter component with bugs
// ============================================
function FilterBar() {
  const [filter, setFilter] = useState('all');
  
  // ISSUE 32: No input sanitization
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="filter-bar">
      {/* ISSUE 33: Missing form label */}
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}

// ============================================
// ISSUE 34: Modal component with portal issue
// ============================================
function Modal(props) {
  // ISSUE 35: No proper modal implementation
  const [isOpen, setIsOpen] = useState(false);

  if (!props.show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{props.title}</h3>
        <p>{props.content}</p>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </div>
  );
}

// ============================================
// ISSUE 36: LocalStorage helper with sync issues
// ============================================
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // ISSUE 37: No error handling for JSON.parse
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // ISSUE 38: Not handling localStorage errors
  const setValue = (value) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}

// ============================================
// ISSUE 39: Main App with multiple issues
// ============================================
function App() {
  // ISSUE 40: Complex state when simpler would work
  const [appState, setAppState] = useState({
    todos: [],
    filter: 'all',
    searchQuery: '',
    showCompleted: true,
    sortBy: 'date',
    // ISSUE 41: Unused state fields
    unusedField1: null,
    unusedField2: undefined,
    unusedField3: []
  });

  // ISSUE 42: Creating new object on every render
  const newTodoState = {
    id: Date.now(),
    todos: appState.todos
  };

  // ISSUE 43: Multiple useEffects with missing dependencies
  useEffect(() => {
    console.log('App state changed');
  });

  useEffect(() => {
    // ISSUE 44: No cleanup of interval
    const interval = setInterval(() => {
      console.log('Auto-save triggered');
    }, 30000);
  });

  // ISSUE 45: Inline event handler creating new function
  const handleToggleTheme = () => {
    // ISSUE 46: No actual theme toggle implementation
    console.log('Toggle theme');
  };

  // ISSUE 47: Nested ternary - confusing
  const getStatusText = () => {
    return appState.todos.length > 0
      ? (appState.filter === 'all' 
        ? 'Showing all todos' 
        : (appState.filter === 'active' ? 'Showing active' : 'Showing completed'))
      : 'No todos yet';
  };

  // ISSUE 48: No validation for todo input
  const addTodo = (text) => {
    // ISSUE 49: Mutation of state directly
    appState.todos.push({
      id: Date.now(),
      text: text,
      completed: false
    });
    setAppState(appState);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo Application</h1>
        <button onClick={handleToggleTheme}>Toggle Theme</button>
      </header>
      
      <main>
        <FilterBar />
        <TodoList />
        <StatisticsComponent />
        <Modal show={false} title="Confirm" content="Are you sure?" />
        
        {/* ISSUE 50: Unreachable code */}
        return (
          <div>Never rendered</div>
        );
      </main>
      
      <footer>
        <p>{getStatusText()}</p>
        {/* ISSUE 51: Using index as key for footer items */}
        {[1, 2, 3].map((num, index) => (
          <span key={index}>Footer link {num}</span>
        ))}
      </footer>
    </div>
  );
}

// ISSUE 52: Export with default AND named export mixed
export default App;
export { TodoItem, TodoList };

// ISSUE 53: Code after export statement
const deadCode = 'This code is after export';
function deadFunction() {
  return deadCode;
}
