import React from 'react';

const AuthContext = React.createContext({
  user: null,
  handleLogout: () => {}
});

export default AuthContext;
