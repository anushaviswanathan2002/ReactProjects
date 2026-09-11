const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users = new Map();
const memories = new Map();
let sessionStore = {};

const PORT = 5000;

// Helper function to generate simple session token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = Date.now().toString();
  
  users.set(email, {
    id: userId,
    username,
    email,
    password: hashedPassword
  });

  const token = generateToken();
  sessionStore[token] = { userId, email };

  res.json({
    success: true,
    token,
    user: { id: userId, username, email }
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken();
  sessionStore[token] = { userId: user.id, email: user.email };

  res.json({
    success: true,
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const { token } = req.body;
  if (token) {
    delete sessionStore[token];
  }
  res.json({ success: true });
});

// Verify Token
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !sessionStore[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = sessionStore[token];
  const user = users.get(session.email);
  
  res.json({
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// Get all memories for user
app.get('/api/memories', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !sessionStore[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = sessionStore[token];
  const userMemories = memories.get(session.userId) || [];
  
  res.json({ memories: userMemories });
});

// Add a new memory
app.post('/api/memories', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !sessionStore[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const session = sessionStore[token];
  const memory = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  if (!memories.has(session.userId)) {
    memories.set(session.userId, []);
  }

  memories.get(session.userId).push(memory);
  
  res.json({ success: true, memory });
});

// Delete a memory
app.delete('/api/memories/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !sessionStore[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = sessionStore[token];
  const userMemories = memories.get(session.userId) || [];
  
  const index = userMemories.findIndex(m => m.id === req.params.id);
  if (index > -1) {
    userMemories.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Memory not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
