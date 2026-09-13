# 🚀 Getting Started with Memory App

This guide will help you get the Memory App up and running on your machine.

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# From the project root
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Step 2: Start the Backend Server

Open a terminal and run:

```bash
cd server
npm start
```

You should see:
```
Server running on http://localhost:5000
Connected to SQLite database
```

### Step 3: Start the Frontend (in a new terminal)

```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

### Step 4: Login or Sign Up

Use the demo account:
- **Email**: demo@example.com
- **Password**: demo123

Or create a new account!

---

## Detailed Setup Guide

### For Windows Users

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Open Command Prompt or PowerShell
3. Navigate to the project folder:
   ```
   cd path\to\ReactProjects
   ```
4. Follow the Quick Start steps above

### For Mac/Linux Users

1. Ensure you have Node.js installed:
   ```bash
   node --version  # Should be v14 or higher
   ```
2. Open Terminal
3. Navigate to the project:
   ```bash
   cd ~/ReactProjects
   ```
4. Follow the Quick Start steps above

---

## Project Layout

```
📁 ReactProjects
├── 📁 server/              ← Backend (Node.js + Express)
│   ├── server.js           
│   ├── package.json        
│   ├── .env                
│   └── memory_app.db       (Created automatically)
│
├── 📁 src/                 ← Frontend (React)
│   ├── 📁 pages/           (Login, Signup, Dashboard)
│   ├── 📁 components/      (MemoryGame, MemoryNotes)
│   ├── 📁 styles/          (CSS files)
│   ├── App.js
│   └── index.js
│
├── 📁 public/              (Static files)
├── 📁 build/               (Production build)
├── package.json            
└── README.md
```

---

## Features Overview

### 🔐 Authentication System
- **Register**: Create new account with email and password
- **Login**: Secure login with JWT tokens
- **Logout**: Clear session and return to login
- **Persistent Sessions**: Stay logged in even after closing browser

### 🎮 Memory Game
- Classic card-matching game
- Real-time score tracking
- Win detection and celebration
- Responsive mobile-friendly design

### 📚 Memory Notes
- Create titled memories with descriptions
- View all memories in a beautiful card grid
- Delete unwanted memories
- Timestamps for each memory
- Personal space (private to your account)

---

## Common Tasks

### Reset Everything
If you want to start fresh:

```bash
# Stop the servers (Ctrl+C in both terminals)

# Delete the database to clear all users and memories
rm server/memory_app.db

# Restart the server
cd server
npm start

# Demo account will be recreated automatically
```

### Change the Port
If port 5000 or 3000 is already in use:

**Backend (Change port 5000)**:
Edit `.env` in the server folder:
```
PORT=5001
JWT_SECRET=your-secret-key
```

**Frontend**: The app will prompt you to use a different port if 3000 is busy.

### Add More Demo Data
You can create more test accounts:

```bash
# In another terminal, while server is running:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "john",
    "password": "password123"
  }'
```

---

## Troubleshooting

### "Port 5000 already in use"
```bash
# Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### "Cannot GET /" error
- Make sure frontend is built: `npm run build`
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R)

### "ERR_CONNECTION_REFUSED" on login
- Backend server is not running
- Check if running on correct port
- Look at server logs: `tail /tmp/server.log`

### "Module not found" errors
```bash
# Clear and reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

### Database is locked
```bash
# Remove the database file and let it recreate
rm server/memory_app.db

# Restart the server
cd server
npm start
```

---

## Development Tips

### Hot Reloading
When you edit React files, the browser automatically refreshes. This doesn't work for backend changes - you need to restart the server.

### Browser DevTools
- Press `F12` to open developer tools
- Use Console tab to see JavaScript errors
- Use Network tab to see API calls

### Testing API Manually
Use curl or Postman to test the backend:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Get memories (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/memories
```

---

## Project Structure Explained

**Frontend (React):**
- Pages handle full screens (Login, Signup, Dashboard)
- Components handle smaller UI pieces (MemoryGame, MemoryNotes)
- Styles contain all CSS for consistent design
- Context stores authentication state

**Backend (Node.js):**
- Single `server.js` file with all routes
- SQLite database for persistent storage
- JWT for secure authentication
- CORS enabled for frontend communication

---

## What's Next?

### Try These:
1. ✅ Sign up with your own account
2. ✅ Play the memory game (beat 10 moves!)
3. ✅ Create multiple memories
4. ✅ Logout and login again
5. ✅ Delete a memory to test removal

### Want to Customize?
- Change colors in `/src/styles/`
- Modify game difficulty in `/src/components/MemoryGame.js`
- Add new emojis to the game
- Change UI text and labels

### Want to Deploy?
- Backend: Deploy `/server` to Heroku, AWS, or DigitalOcean
- Frontend: Build with `npm run build` and deploy `/build` folder to Vercel, Netlify, or AWS S3

---

## Need Help?

Check the main README.md for more detailed information about:
- API Endpoints
- Security features
- Technology stack
- Deployment options

---

**Happy coding! 🎉**
