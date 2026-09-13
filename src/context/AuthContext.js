import React from 'react';

const AuthContext = React.createContext({
  auth: null,
  handleLogout: () => {},
});

export default AuthContext;
