# Memory React App

A feature-rich React application with user authentication, notes management, and an interactive memory card game.

## 🎯 Features

### 1. Authentication System
- **Signup Page**: Create new user accounts with validation
  - Name (minimum 2 characters)
  - Email (valid email format required)
  - Password (minimum 6 characters)
  - Confirm password matching
- **Login Page**: Secure login with email and password
- **Session Management**: User stays logged in with persistent storage
- **Data Privacy**: Passwords are not exposed in the app (though for production, use proper backend hashing)

### 2. Memory Notes App
Store and manage your memories and thoughts:
- ✏️ **Create Notes**: Add new notes with a textarea form
- 🖊️ **Edit Notes**: Click the pencil icon to edit existing notes
- 🗑️ **Delete Notes**: Remove notes with the delete button
- 📅 **Timestamps**: Each note shows creation/update time
- 💾 **Persistent Storage**: Notes are saved per user

### 3. Memory Card Game
A classic memory matching game:
- 🎮 **4x4 Grid**: 16 cards with 8 emoji pairs
- 📊 **Statistics**: Track moves and matched pairs
- 🎯 **Game Mechanics**: Flip cards to find matching pairs
- 🎉 **Win Detection**: Congratulations screen with move count
- 🔄 **Reset**: Start a new game anytime

### 4. User Experience
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Gradient backgrounds, smooth animations, card layouts
- 🔐 **Logout**: Safely exit your account
- 🎚️ **Tab Navigation**: Switch between Notes and Memory Game

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

The app opens automatically at `http://localhost:3000`

### Test Account
You can create a new account or test with:
- Email: test@example.com
- Password: test123456

## 📁 Project Structure

```
src/
├── App.js                          # Main app component with routing
├── pages/
│   ├── LoginPage.js               # Login form
│   ├── SignupPage.js              # Registration form
│   └── MemoryApp.js               # Main app after login
├── components/
│   ├── MemoryCard.js              # Memory game component
│   └── NotesList.js               # Notes display component
├── utils/
│   └── validation.js              # Form validation helpers
├── styles/
│   ├── AuthPages.css              # Login/Signup styling
│   ├── MemoryApp.css              # Main app styling
│   ├── MemoryCard.css             # Memory game styling
│   └── NotesList.css              # Notes list styling
└── index.js                        # React entry point
```

## 🔒 Security Notes

- User data is stored in localStorage (for development only)
- For production, implement:
  - Backend authentication with JWT
  - Password hashing (bcrypt)
  - HTTPS encryption
  - Secure session management
  - Input sanitization

## 🎮 How to Play the Memory Game

1. Click "Memory Game" tab from the main app
2. Click cards to flip them
3. Remember the positions of matching pairs
4. Click pairs to match them all
5. Try to complete with minimum moves!
6. Click "Play Again" to start a new game

## 💡 How to Use Notes

1. Click "Notes" tab (default view)
2. Type your memory/note in the textarea
3. Click "Add Note" to save
4. Edit with the pencil icon
5. Delete with the trash icon
6. Notes automatically save to localStorage

## 🛠️ Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## 📝 Notes

- The app uses React Hooks for state management
- No external UI libraries required (pure CSS)
- All data persists in browser localStorage
- Each user has separate notes and game progress
