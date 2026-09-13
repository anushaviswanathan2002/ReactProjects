import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// ==================== AUTH CONTEXT ====================
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('memoryAppUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signup = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('memoryAppUsers') || '{}');
    if (users[email]) {
      throw new Error('User already exists');
    }
    users[email] = { email, password, name };
    localStorage.setItem('memoryAppUsers', JSON.stringify(users));
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('memoryAppUser', JSON.stringify(newUser));
    return newUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('memoryAppUsers') || '{}');
    const user = users[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    const loggedInUser = { email: user.email, name: user.name };
    setUser(loggedInUser);
    localStorage.setItem('memoryAppUser', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('memoryAppUser');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// ==================== TODO CONTEXT ====================
const TodoContext = createContext(null);

function TodoProvider({ children }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState(() => {
    if (!user) return [];
    const saved = localStorage.getItem(`memoryAppTodos_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`memoryAppTodos_${user.email}`, JSON.stringify(todos));
    }
  }, [todos, user]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id, text) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodos() {
  return useContext(TodoContext);
}

// ==================== LOGIN COMPONENT ====================
function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        signup(email, password, name);
      } else {
        login(email, password);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>✓ MemoryApp</h1>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Loading...' : (isSignup ? 'Create Account' : 'Login')}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

// ==================== TODO ITEM COMPONENT ====================
function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="todo-edit-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          <span className="todo-text">{todo.text}</span>
        )}
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-save" title="Save">✓</button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel" title="Cancel">✕</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-edit" title="Edit">✎</button>
            <button onClick={() => onDelete(todo.id)} className="btn-delete" title="Delete">🗑</button>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== TODO LIST COMPONENT ====================
function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>My Tasks</h2>
        <div className="todo-stats">
          <span className="stat">{activeCount} active</span>
          <span className="stat">{completedCount} completed</span>
        </div>
      </div>

      <form onSubmit={handleAddTodo} className="todo-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="btn-add-todo">Add</button>
      </form>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>
              {todos.length === 0
                ? 'No tasks yet. Add one to get started!'
                : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ==================== APP COMPONENT ====================
function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>✓ MemoryApp</h1>
          <p>Task Manager</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
