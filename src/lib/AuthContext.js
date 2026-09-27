'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign up function
  const signUp = async (userData) => {
    try {
      setIsLoading(true);

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(
        (u) => u.email === userData.email || u.username === userData.username
      );

      if (userExists) {
        throw new Error('Email or username already registered');
      }

      // Create new user
      const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Log in the user
      const loggedInUser = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
      };

      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsAuthenticated(true);

      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);

      // Find user by email and password
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user session
      const loggedInUser = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        name: foundUser.name,
      };

      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setUser(loggedInUser);
      setIsAuthenticated(true);

      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberMe');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('No user logged in');
      }

      // Update in users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));

      // Update current session
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('No user logged in');
      }

      // Verify current password
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u) => u.id === user.id);

      if (!foundUser || foundUser.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const userIndex = users.findIndex((u) => u.id === user.id);
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password (forgot password)
  const resetPassword = async (email, newPassword) => {
    try {
      setIsLoading(true);

      // Find user by email
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u) => u.email === email);

      if (userIndex === -1) {
        throw new Error('No account found with this email');
      }

      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Get user by ID
  const getUserById = (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.find((u) => u.id === userId) || null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  };

  // Check if email exists
  const emailExists = (email) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.some((u) => u.email === email);
    } catch (error) {
      return false;
    }
  };

  // Check if username exists
  const usernameExists = (username) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.some((u) => u.username === username);
    } catch (error) {
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    resetPassword,
    getUserById,
    emailExists,
    usernameExists,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthContext };
