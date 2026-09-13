# Memory Todo App

A full-stack React application with user authentication and a comprehensive todo management system.

## Features

### Authentication
- **User Sign Up**: Create a new account with email, password, and name
- **User Login**: Secure login with JWT token authentication
- **Session Persistence**: Tokens stored in localStorage for persistent sessions
- **Token Verification**: Automatic token validation on app load

### Todo Management
- **Create Todos**: Add new tasks with title and optional description
- **Edit Todos**: Update task title and description
- **Mark Complete**: Toggle task completion status
- **Delete Todos**: Remove tasks permanently
- **Filter Todos**: View all tasks, active only, or completed only

### Dashboard
- **User Welcome**: Personalized greeting with logged-in user's name
- **Stats Display**: Shows total, active, and completed task counts
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Architecture

### Backend (Node.js + Express)
**File**: `server.js`

**Endpoints:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/todos` - Fetch user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

**Technologies:**
- Express.js - HTTP server
- JWT (jsonwebtoken) - Token-based authentication
- CORS - Cross-origin resource sharing
- In-memory storage (can be replaced with MongoDB/PostgreSQL)

### Frontend (React)
**Key Files:**
- `src/App.js` - Main app component
- `src/AuthContext.js` - Authentication state management
- `src/Login.js` - Login form component
- `src/SignUp.js` - Registration form component
- `src/TodoApp.js` - Todo management interface
- `src/Auth.css` - Authentication styling
- `src/TodoApp.css` - Todo app styling

**Technologies:**
- React 18 - UI library
- React Context API - State management
- Fetch API - HTTP requests
- CSS3 - Styling with responsive design

## Setup & Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the App

**Start Backend Server:**
```bash
npm run server
```
The server runs on `http://localhost:5000`

**Start React Frontend:**
```bash
npm start
```
The app runs on `http://localhost:3000`

**Run Both Simultaneously (requires concurrently):**
```bash
npm run dev
```

### Environment
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- JWT Secret: Configured in `server.js` (change for production)

## Usage

### First Time User
1. Open the app in your browser
2. Click "Sign up" on the login page
3. Enter your name, email, and password
4. You're automatically logged in after signup

### Adding a Todo
1. Enter task title in the input field
2. Optionally add a description
3. Click "Add Task" button

### Managing Todos
- **Check box**: Mark a task as complete/incomplete
- **Edit**: Click Edit to modify task details
- **Delete**: Click Delete to remove the task

### Filtering
Use the filter buttons to view:
- **All**: All tasks
- **Active**: Incomplete tasks only
- **Completed**: Completed tasks only

### Logout
Click the "Logout" button in the top right to end your session

## Database

Currently uses in-memory storage for demonstration. For production, replace with:
- MongoDB with Mongoose
- PostgreSQL with Sequelize/TypeORM
- Firebase Firestore
- Any other database of choice

## Security Notes

⚠️ **Important for Production:**
- Change JWT secret in `server.js`
- Implement proper password hashing (bcrypt)
- Add HTTPS for all connections
- Validate and sanitize all inputs
- Implement rate limiting
- Add CSRF protection
- Use environment variables for secrets
- Implement proper error handling

## File Structure

```
ReactProjects/
├── server.js                 # Express backend
├── package.json              # Dependencies
├── public/                   # Static files
└── src/
    ├── App.js               # Main component
    ├── App.css              # Main styles
    ├── AuthContext.js       # Auth state
    ├── Login.js             # Login form
    ├── Auth.css             # Auth styles
    ├── SignUp.js            # Signup form
    ├── TodoApp.js           # Todo interface
    ├── TodoApp.css          # Todo styles
    ├── index.js             # React entry
    └── index.css            # Global styles
```

## API Examples

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123",
    "name":"John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123"
  }'
```

### Add Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title":"Buy groceries",
    "description":"Milk, eggs, bread"
  }'
```

## Styling

The app features a modern gradient design with:
- Purple-blue gradient background
- Clean white cards with shadows
- Responsive grid layouts
- Smooth transitions and hover effects
- Accessible color contrasts
- Mobile-optimized interface

## Future Enhancements

- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Priority levels
- [ ] Recurring tasks
- [ ] Task sharing with other users
- [ ] Database persistence
- [ ] Dark mode
- [ ] Offline mode with sync
- [ ] Task search and sorting
- [ ] Notifications

## License

MIT
