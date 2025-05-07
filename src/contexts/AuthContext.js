import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Demo users - trong thực tế nên gọi API
    const adminUser = { id: 1, username: 'admin', role: 'admin', name: 'Admin' };
    const clientUser = { id: 2, username: 'client', role: 'client', name: 'Client' };

    if (username === 'admin' && password === 'admin') {
      setUser(adminUser);
      return true;
    } else if (username === 'client' && password === 'client') {
      setUser(clientUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
