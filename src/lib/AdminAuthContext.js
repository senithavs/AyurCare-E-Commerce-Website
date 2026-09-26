'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        console.error('Failed to parse admin session:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when admin changes
  useEffect(() => {
    if (isHydrated) {
      if (admin) {
        localStorage.setItem('admin_session', JSON.stringify(admin));
      } else {
        localStorage.removeItem('admin_session');
      }
    }
  }, [admin, isHydrated]);

  const login = (email, password, name) => {
    // Simple demo login - in production use proper authentication
    const adminData = {
      id: 'admin-001',
      name: name || 'Admin User',
      email: email,
      role: 'administrator',
      avatar: '👤',
      loginTime: new Date().toISOString(),
    };
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    setAdmin(null);
  };

  const updateProfile = (updates) => {
    if (admin) {
      const updatedAdmin = { ...admin, ...updates };
      setAdmin(updatedAdmin);
      return updatedAdmin;
    }
  };

  const isAdminLoggedIn = !!admin;

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAdminLoggedIn,
        login,
        logout,
        updateProfile,
        isHydrated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
