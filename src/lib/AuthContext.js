'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Session configuration
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  // Initialize auth state on mount and validate session
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        const userSession = localStorage.getItem('userSession');

        if (currentUser && userSession) {
          const parsedUser = JSON.parse(currentUser);
          const parsedSession = JSON.parse(userSession);

          // Check if session is expired
          const expiresAt = new Date(parsedSession.expiresAt);
          if (expiresAt < new Date()) {
            // Session expired, clear data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userSession');
            setUser(null);
            setIsAuthenticated(false);
            setSessionToken(null);
          } else {
            // Session valid
            setUser(parsedUser);
            setSessionToken(parsedSession.sessionToken);
            setIsAuthenticated(true);
            setupInactivityTimer();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Setup activity listener for inactivity timeout
    const handleActivity = () => {
      if (isAuthenticated) {
        clearInactivityTimer();
        setupInactivityTimer();
      }
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Setup inactivity timer
  const setupInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    const timer = setTimeout(() => {
      console.warn('Session inactive for 30 minutes, logging out...');
      signOut();
      window.location.href = '/signin?session=expired';
    }, INACTIVITY_TIMEOUT);

    setInactivityTimer(timer);
  };

  // Clear inactivity timer
  const clearInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  // Generate session token
  const generateSessionToken = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  // Sign up function
  const signUp = async (userData) => {
    try {
      setIsLoading(true);

      // Call sign up API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      // Create session
      const token = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + SESSION_TIMEOUT);

      const sessionData = {
        sessionToken: token,
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: true,
      };

      // Save user and session to localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      
      setUser(data.user);
      setSessionToken(token);
      setIsAuthenticated(true);
      setupInactivityTimer();

      return { success: true, user: data.user };
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

      // Call sign in API
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      // Create session
      const token = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + SESSION_TIMEOUT);

      const sessionData = {
        sessionToken: token,
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: true,
      };

      // Save user and session to localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('userSession', JSON.stringify(sessionData));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setUser(data.user);
      setSessionToken(token);
      setIsAuthenticated(true);
      setupInactivityTimer();

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    try {
      clearInactivityTimer();

      // Clear user-specific cart and wishlist if they exist
      if (user?.id) {
        localStorage.removeItem(`ayurcare_cart_user_${user.id}`);
        localStorage.removeItem(`ayurcare_wishlist_user_${user.id}`);
      }

      localStorage.removeItem('currentUser');
      localStorage.removeItem('userSession');
      localStorage.removeItem('rememberMe');
      
      setUser(null);
      setSessionToken(null);
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

      // Call update profile API
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setUser(data.user);

      return { success: true, user: data.user };
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

      // Call change password API
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password change failed');
      }

      return { success: true, message: data.message };
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

      // Find user by email and update password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Get user by ID (from database)
  const getUserById = async (userId) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { 'x-user-id': userId },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  };

  // Check if email exists
  const emailExists = async (email) => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Check if username exists
  const usernameExists = async (username) => {
    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    sessionToken,
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
