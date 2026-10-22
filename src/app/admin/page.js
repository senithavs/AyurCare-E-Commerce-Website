'use client';

import { Suspense } from 'react';
import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Dashboard">
          <Suspense fallback={<div>Loading...</div>}>
            <AdminDashboard />
          </Suspense>
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
