const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file path (simple JSON storage)
const dbPath = path.join(__dirname, 'users.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], scores: [] }, null, 2));
}

// Helper functions to read/write database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], scores: [] };
  }
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes

// Sign up
app.post('/api/auth/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const db = readDatabase();
  
  // Check if user already exists
  if (db.users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDatabase(db);

  // Generate token
  const token = jwt.sign({ userId: newUser.id, username }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: { id: newUser.id, username }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, username }
  });
});

// Get current user
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({
    user: {
      id: req.userId,
      username: req.username
    }
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Save game score
app.post('/api/scores', verifyToken, (req, res) => {
  const { moves, time, difficulty } = req.body;

  if (!moves || !time) {
    return res.status(400).json({ message: 'Moves and time are required' });
  }

  const db = readDatabase();
  
  const score = {
    id: Date.now().toString(),
    userId: req.userId,
    username: req.username,
    moves,
    time,
    difficulty: difficulty || 'medium',
    score: Math.max(0, 1000 - moves * 10 - Math.floor(time / 10)),
    completedAt: new Date().toISOString()
  };

  db.scores.push(score);
  writeDatabase(db);

  res.status(201).json({
    message: 'Score saved successfully',
    score
  });
});

// Get user's scores
app.get('/api/scores', verifyToken, (req, res) => {
  const db = readDatabase();
  const userScores = db.scores.filter(s => s.userId === req.userId);

  res.json({
    scores: userScores.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
  });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const db = readDatabase();
  
  // Group by user and get best score
  const leaderboard = {};
  
  db.scores.forEach(score => {
    if (!leaderboard[score.userId]) {
      leaderboard[score.userId] = {
        username: score.username,
        bestScore: score.score,
        gamesPlayed: 0
      };
    }
    leaderboard[score.userId].gamesPlayed++;
    leaderboard[score.userId].bestScore = Math.max(leaderboard[score.userId].bestScore, score.score);
  });

  const sorted = Object.values(leaderboard)
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, 10);

  res.json({ leaderboard: sorted });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
