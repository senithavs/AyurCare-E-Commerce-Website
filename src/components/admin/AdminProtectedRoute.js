'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const { isAdminLoggedIn, isHydrated } = useAdminAuth();
  const [redirected, setRedirected] = useState(false);
  const [timeout, setTimeout] = useState(false);

  // Safety timeout: if hydration takes too long, assume not logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('Hydration timeout - assuming not logged in');
      setTimeout(true);
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, []);

  // Main redirect logic
  useEffect(() => {
    // If hydrated OR timed out, check auth status
    const shouldCheck = isHydrated || timeout;
    
    if (!shouldCheck) return;

    // If not logged in, redirect to login
    if (!isAdminLoggedIn && !redirected) {
      console.log('Admin not logged in, redirecting to login...');
      setRedirected(true);
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, isHydrated, router, redirected, timeout]);

  // If logged in and hydrated, show content immediately
  if (isHydrated && isAdminLoggedIn) {
    return children;
  }

  // If we've timed out or hydrated and not logged in, redirect is in progress
  if ((isHydrated || timeout) && !isAdminLoggedIn) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f9f9f9',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔄</div>
          <p style={{ color: 'var(--charcoal-60)', fontSize: '14px' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading state while hydrating
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f9f9f9',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
        <p style={{ color: 'var(--charcoal-60)', fontSize: '14px' }}>Loading...</p>
      </div>
    </div>
  );
}
