# Quick Reference Card

## Command Cheat Sheet

### Starting the App
```bash
# Terminal 1: Start Backend
cd server && npm start

# Terminal 2: Start Frontend
npm start
```

### Build Commands
```bash
npm run build       # Create optimized production build
npm test           # Run tests (if available)
npm run eject      # Eject from create-react-app (not reversible!)
```

### Project Navigation
```bash
cd server          # Go to backend folder
cd ..              # Go back to root
npm list           # See installed packages
npm install        # Install all dependencies
```

---

## API Quick Reference

### Authentication Endpoints

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get Current User**
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Memory Endpoints

**Get All Memories**
```http
GET /api/memories
Authorization: Bearer YOUR_JWT_TOKEN
```

**Create Memory**
```http
POST /api/memories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Memory Title",
  "description": "Optional description"
}
```

**Delete Memory**
```http
DELETE /api/memories/MEMORY_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Demo Credentials

**Username**: demo
**Email**: demo@example.com
**Password**: demo123

---

## File Locations

| File | Purpose |
|------|---------|
| `server/server.js` | Backend logic |
| `server/.env` | Backend configuration |
| `src/App.js` | Main React app |
| `src/pages/Login.js` | Login page |
| `src/pages/Signup.js` | Signup page |
| `src/pages/Dashboard.js` | Main dashboard |
| `src/components/MemoryGame.js` | Card game component |
| `src/components/MemoryNotes.js` | Notes component |
| `src/styles/` | All CSS files |
| `build/` | Production-ready app |

---

## Key Technologies

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 18 |
| Backend | Node.js + Express |
| Database | SQLite3 |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |
| Styling | CSS3 |

---

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Developer Tools | F12 | Cmd+Option+I |
| Hard Refresh | Ctrl+Shift+R | Cmd+Shift+R |
| Open Console | Ctrl+` | Cmd+` |
| Open Terminal | Ctrl+` | Ctrl+` |

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Port 5000 in use" | Kill process or change PORT in .env |
| "Cannot connect to server" | Make sure backend is running |
| "Module not found" | Run `npm install` in correct directory |
| "CORS error" | Backend server crashed, restart it |
| "Invalid token" | Clear localStorage and login again |

---

## Memory App Features

- 📝 Create & save memories
- 🎮 Play card matching game
- 👤 User authentication
- 📱 Mobile responsive
- 🔒 Secure JWT tokens
- 💾 Persistent storage

---

## Useful Links

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [JWT Intro](https://jwt.io/introduction)
- [SQLite Guide](https://www.sqlite.org/docs.html)

---

## File Size Goals

- Production Build: < 100 KB
- Main JS Bundle: < 70 KB
- CSS Bundle: < 10 KB

---

Generated for the Memory App - Full Stack React Application
