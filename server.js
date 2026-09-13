const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
const users = new Map();
const todos = new Map();
let userIdCounter = 1;

// Helper function to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  if (Array.from(users.values()).some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const userId = String(userIdCounter++);
  users.set(userId, { email, password, name });
  todos.set(userId, []);

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: userId, email, name } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = Array.from(users.values()).find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userId = Array.from(users.entries()).find(([, u]) => u.email === email)[0];
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: userId, email: user.email, name: user.name } });
});

app.post('/api/auth/verify', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  res.json({ user: { id: req.userId, email: user.email, name: user.name } });
});

// Todo Routes
app.get('/api/todos', verifyToken, (req, res) => {
  const userTodos = todos.get(req.userId) || [];
  res.json({ todos: userTodos });
});

app.post('/api/todos', verifyToken, (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }

  const userTodos = todos.get(req.userId) || [];
  const todo = {
    id: Date.now().toString(),
    title,
    description: description || '',
    completed: false,
    timeSpent: 0,
    createdAt: new Date()
  };

  userTodos.push(todo);
  todos.set(req.userId, userTodos);
  res.json(todo);
});

app.put('/api/todos/:id', verifyToken, (req, res) => {
  const { title, description, completed, timeSpent } = req.body;
  const userTodos = todos.get(req.userId) || [];
  const todo = userTodos.find(t => t.id === req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  if (timeSpent !== undefined) todo.timeSpent = timeSpent;

  todos.set(req.userId, userTodos);
  res.json(todo);
});

app.delete('/api/todos/:id', verifyToken, (req, res) => {
  const userTodos = todos.get(req.userId) || [];
  const index = userTodos.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  userTodos.splice(index, 1);
  todos.set(req.userId, userTodos);
  res.json({ message: 'Todo deleted' });
});

// Timer Routes
app.post('/api/todos/:id/timer', verifyToken, (req, res) => {
  const { timeSpent } = req.body;
  const userTodos = todos.get(req.userId) || [];
  const todo = userTodos.find(t => t.id === req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.timeSpent = timeSpent || 0;
  todos.set(req.userId, userTodos);
  res.json({ message: 'Timer saved', todo });
});

app.get('/api/todos/:id/timer', verifyToken, (req, res) => {
  const userTodos = todos.get(req.userId) || [];
  const todo = userTodos.find(t => t.id === req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json({ timeSpent: todo.timeSpent || 0 });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
