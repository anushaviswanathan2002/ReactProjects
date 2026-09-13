// Simple authentication service using localStorage
const USERS_STORAGE_KEY = 'app_users';

export const authService = {
  // Get all registered users
  getAllUsers: () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  },

  // Register a new user
  signup: (email, password, name) => {
    const users = authService.getAllUsers();
    
    if (users[email]) {
      return { success: false, error: 'User already exists' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    users[email] = {
      email,
      password, // In production, this should be hashed
      name,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return {
      success: true,
      user: {
        id: email,
        email,
        name,
        createdAt: users[email].createdAt
      }
    };
  },

  // Login user
  login: (email, password) => {
    const users = authService.getAllUsers();
    const user = users[email];

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    return {
      success: true,
      user: {
        id: email,
        email,
        name: user.name,
        createdAt: user.createdAt
      }
    };
  }
};
