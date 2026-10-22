'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const { isAdminLoggedIn, isHydrated } = useAdminAuth();

  useEffect(() => {
    // Only check after hydration to avoid hydration mismatch
    if (isHydrated && !isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, isHydrated, router]);

  // Show loading state while hydrating or redirecting
  if (!isHydrated || !isAdminLoggedIn) {
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
