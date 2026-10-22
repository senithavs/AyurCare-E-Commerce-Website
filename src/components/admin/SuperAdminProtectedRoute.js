'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';

export default function SuperAdminProtectedRoute({ children }) {
  const router = useRouter();
  const { admin, isAdminLoggedIn, isHydrated } = useAdminAuth();

  useEffect(() => {
    // Only check after hydration to avoid hydration mismatch
    if (isHydrated) {
      if (!isAdminLoggedIn) {
        // Not logged in, redirect to login
        router.push('/admin/login');
      } else if (admin?.role !== 'super_admin') {
        // Logged in but not super admin, redirect to dashboard
        router.push('/admin');
      }
    }
  }, [isAdminLoggedIn, admin?.role, isHydrated, router]);

  // Show loading state while hydrating or redirecting
  if (!isHydrated || !isAdminLoggedIn || admin?.role !== 'super_admin') {
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

  return children;
}
