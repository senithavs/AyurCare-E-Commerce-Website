'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

// Main admin credentials - this is the super admin account
const MAIN_ADMIN = {
  id: 'admin-001',
  email: 'admin@ayurcare.com',
  password: 'Se@admin@123',
  name: 'Admin',
  username: 'admin',
  phone: '0000000000',
  role: 'super_admin',
};

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [allAdmins, setAllAdmins] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin_session');
    const savedAdmins = localStorage.getItem('all_admins');
    
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        console.error('Failed to parse admin session:', e);
      }
    }

    if (savedAdmins) {
      try {
        setAllAdmins(JSON.parse(savedAdmins));
      } catch (e) {
        console.error('Failed to parse all admins:', e);
        // Initialize with main admin if no admins exist
        setAllAdmins([MAIN_ADMIN]);
      }
    } else {
      // Initialize with main admin if no admins exist
      setAllAdmins([MAIN_ADMIN]);
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
      localStorage.setItem('all_admins', JSON.stringify(allAdmins));
    }
  }, [admin, allAdmins, isHydrated]);

  const validateCredentials = (email, password) => {
    // Check against all stored admins
    const foundAdmin = allAdmins.find(
      (a) => a.email === email && a.password === password
    );
    return foundAdmin || null;
  };

  const login = (email, password) => {
    const validAdmin = validateCredentials(email, password);
    
    if (!validAdmin) {
      throw new Error('Invalid email or password');
    }

    const adminData = {
      ...validAdmin,
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

  // Admin Management Functions (only callable by super_admin)
  const createAdmin = (adminData) => {
    if (admin?.role !== 'super_admin') {
      throw new Error('Only super admin can create admins');
    }

    // Check if email already exists
    if (allAdmins.some((a) => a.email === adminData.email)) {
      throw new Error('Admin with this email already exists');
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      ...adminData,
      role: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: admin.email,
    };

    setAllAdmins([...allAdmins, newAdmin]);
    return newAdmin;
  };

  const updateAdmin = (adminId, updates) => {
    if (admin?.role !== 'super_admin') {
      throw new Error('Only super admin can update admins');
    }

    // Prevent updating super admin
    if (adminId === MAIN_ADMIN.id) {
      throw new Error('Cannot update main admin account');
    }

    setAllAdmins(
      allAdmins.map((a) =>
        a.id === adminId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      )
    );

    // If updating current admin, update session too
    if (admin?.id === adminId) {
      setAdmin((prev) => ({ ...prev, ...updates }));
    }
  };

  const deleteAdmin = (adminId) => {
    if (admin?.role !== 'super_admin') {
      throw new Error('Only super admin can delete admins');
    }

    // Prevent deleting super admin
    if (adminId === MAIN_ADMIN.id) {
      throw new Error('Cannot delete main admin account');
    }

    setAllAdmins(allAdmins.filter((a) => a.id !== adminId));
  };

  const getAdmins = () => {
    return allAdmins;
  };

  const getAdminById = (adminId) => {
    return allAdmins.find((a) => a.id === adminId);
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
        createAdmin,
        updateAdmin,
        deleteAdmin,
        getAdmins,
        getAdminById,
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
