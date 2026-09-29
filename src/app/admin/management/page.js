'use client';

import { Suspense } from 'react';
import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminManagement from '@/components/admin/AdminManagement';
import SuperAdminProtectedRoute from '@/components/admin/SuperAdminProtectedRoute';

export default function AdminManagementPage() {
  return (
    <SuperAdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Admin Management">
          <Suspense fallback={<div>Loading...</div>}>
            <AdminManagement />
          </Suspense>
        </AdminLayout>
      </AdminProvider>
    </SuperAdminProtectedRoute>
  );
}
