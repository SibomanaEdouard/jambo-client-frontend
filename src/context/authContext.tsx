import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type User } from './authContextType';
import type { AuthResponse } from '../services/authService';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [deviceVerified, setDeviceVerified] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedDeviceVerified = localStorage.getItem('deviceVerified');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setDeviceVerified(storedDeviceVerified === 'true');
    }
  }, []);

  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    setToken(authData.token);
    setDeviceVerified(authData.deviceVerified);
    
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('deviceVerified', authData.deviceVerified.toString());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setDeviceVerified(false);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('deviceVerified');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      deviceVerified,
      login,
      logout,
      updateBalance,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};