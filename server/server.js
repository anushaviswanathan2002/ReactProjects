const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./memory_app.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database');
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Register route
app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
    [email, username, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email or username already exists' });
        }
        return res.status(500).json({ error: 'Server error' });
      }

      const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, userId: this.lastID, username });
    }
  );
});

// Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, userId: user.id, username: user.username });
  });
});

// Get current user
app.get('/api/auth/me', verifyToken, (req, res) => {
  db.get('SELECT id, email, username FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// Create a memory
app.post('/api/memories', verifyToken, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO memories (userId, title, description) VALUES (?, ?, ?)',
    [req.userId, title, description || ''],
    function (err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ id: this.lastID, title, description });
    }
  );
});

// Get all memories for current user
app.get('/api/memories', verifyToken, (req, res) => {
  db.all('SELECT * FROM memories WHERE userId = ? ORDER BY createdAt DESC', [req.userId], (err, memories) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(memories || []);
  });
});

// Delete a memory
app.delete('/api/memories/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM memories WHERE id = ? AND userId = ?', [id, req.userId], function (err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Memory not found' });
    res.json({ message: 'Memory deleted' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
