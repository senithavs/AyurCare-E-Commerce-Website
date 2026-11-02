'use client';

import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { AdminProvider } from '@/lib/AdminContext';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminLayout from '@/components/admin/AdminLayout';

export default function UsersPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
