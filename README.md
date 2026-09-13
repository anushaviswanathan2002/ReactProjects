# 📝 Memory App - Full Stack React Application

A full-stack memory management application built with React and Node.js featuring user authentication, a memory game, and a note-taking system.

## ✨ Features

### 🔐 Authentication
- **User Registration** - Create a new account with email and password
- **User Login** - Secure login with JWT authentication
- **Session Management** - Automatic session persistence using localStorage
- **Password Security** - Passwords are hashed using bcryptjs

### 🎮 Memory Game
- **Interactive Card Matching Game** - Flip cards to find matching pairs
- **Score Tracking** - Track moves and matched pairs
- **Win Detection** - Celebrate when you complete the game
- **Responsive Grid** - Adapts to different screen sizes

### 📚 Memory Notes
- **Create Memories** - Save important memories with title and description
- **View All Memories** - See all your saved memories in a card grid
- **Delete Memories** - Remove memories you no longer need
- **Timestamps** - Each memory shows when it was created
- **Personal Space** - All memories are private to your account

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations
- **React Context API** - State management

### Backend
- **Node.js & Express.js** - Web server framework
- **SQLite3** - Lightweight database
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    MEMORY APP                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │   React (Port    │         │  Express Server  │    │
│  │    3000)         │◄───────►│  (Port 5000)     │    │
│  │                  │         │                  │    │
│  │ ├─ Login         │         │ ├─ Auth Routes  │    │
│  │ ├─ Signup        │         │ ├─ Memory API   │    │
│  │ ├─ Dashboard     │         │ └─ Middleware   │    │
│  │ ├─ Game          │         │                  │    │
│  │ └─ Notes         │         │                  │    │
│  └──────────────────┘         └────────┬─────────┘    │
│          │                              │              │
│          └──────────────────────────────┘              │
│                                                         │
│                   JWT Authentication                   │
│              (Secure Token Exchange)                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │           SQLite Database                       │  │
│  │  ┌──────────────────┐  ┌──────────────────┐    │  │
│  │  │  Users Table     │  │  Memories Table  │    │  │
│  │  │  - id            │  │  - id            │    │  │
│  │  │  - email         │  │  - userId (FK)   │    │  │
│  │  │  - username      │  │  - title         │    │  │
│  │  │  - password      │  │  - description   │    │  │
│  │  │  - createdAt     │  │  - createdAt     │    │  │
│  │  └──────────────────┘  └──────────────────┘    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📋 Project Structure

```
/home/user/ReactProjects/
├── server/                     # Backend Express server
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables
├── src/                       # Frontend React app
│   ├── pages/                 # Page components
│   │   ├── Login.js          # Login page
│   │   ├── Signup.js         # Signup page
│   │   └── Dashboard.js      # Main dashboard
│   ├── components/            # React components
│   │   ├── MemoryGame.js     # Card matching game
│   │   └── MemoryNotes.js    # Notes management
│   ├── styles/               # CSS files
│   │   ├── Auth.css          # Authentication styling
│   │   ├── Dashboard.css     # Dashboard styling
│   │   ├── MemoryGame.css    # Game styling
│   │   └── MemoryNotes.css   # Notes styling
│   ├── context/              # React Context
│   │   └── AuthContext.js    # Authentication context
│   ├── App.js                # Main App component
│   └── index.js              # React entry point
├── public/                   # Static files
├── build/                    # Production build
└── package.json             # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies**
```bash
npm install
cd server && npm install
```

2. **Start the backend server** (from project root)
```bash
cd server
npm start
```
The backend will run on `http://localhost:5000`

3. **In a new terminal, start the React development server**
```bash
npm start
```
The app will open at `http://localhost:3000`

### Quick Demo

A demo account is pre-created for testing:
- **Email**: demo@example.com
- **Password**: demo123

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires token)

#### Memories
- `GET /api/memories` - Get all user memories (requires token)
- `POST /api/memories` - Create a new memory (requires token)
- `DELETE /api/memories/:id` - Delete a memory (requires token)

## 🎮 How to Use

### Sign Up
1. Click "Sign up" on the login page
2. Enter email, username, and password
3. Click "Sign Up"
4. You'll be redirected to the dashboard

### Login
1. Enter your email and password
2. Click "Login"
3. Access your personalized dashboard

### Play Memory Game
1. Go to the "🎮 Memory Game" tab
2. Click on cards to flip them
3. Find all matching pairs
4. Try to beat your record (lowest moves wins!)

### Save Memories
1. Go to the "📚 My Memories" tab
2. Click "➕ Add New Memory"
3. Enter a title and optional description
4. Click "Save Memory"
5. Your memories appear in a grid below

### Delete Memories
1. In the "📚 My Memories" tab
2. Find the memory you want to delete
3. Click the "🗑️" button on the memory card
4. Confirm the deletion

## 🔒 Security Features

- ✅ JWT-based authentication with 24-hour expiration
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Protected API endpoints requiring valid tokens
- ✅ No sensitive data stored in localStorage (only JWT token)

## 🎨 UI/UX Features

- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🎨 **Modern Gradients** - Beautiful purple gradient theme
- ✨ **Smooth Animations** - Card flips, button transitions, and slide-ins
- 🌈 **Intuitive Interface** - Clear navigation between features
- 💫 **Visual Feedback** - Hover effects, loading states, error messages

## 🧪 Testing

### Manual Testing Checklist
- ✅ Register new account
- ✅ Login with credentials
- ✅ Play memory game (find all pairs)
- ✅ Create multiple memories
- ✅ Delete a memory
- ✅ Logout and login again
- ✅ Verify persistent session
- ✅ Test responsive design on mobile

## 📝 Environment Variables

### Server (.env)
```
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build folder contains optimized production files.

### Backend Deployment
Deploy the `/server` directory to:
- Heroku
- AWS Lambda
- DigitalOcean
- Vercel serverless functions

### Frontend Deployment
Deploy the `/build` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js is installed: `node --version`
- Check logs: `cat /tmp/server.log`

### Frontend build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Delete build folder: `rm -rf build`
- Try building again: `npm run build`

### CORS errors
- Ensure backend is running on localhost:5000
- Check that CORS is enabled in server.js
- Verify frontend API_BASE_URL is correct

### Can't login after registration
- Check that backend server is running
- Verify database file exists: `server/memory_app.db`
- Check server logs for errors

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [JWT Authentication](https://jwt.io)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Remembering! 🎉**
