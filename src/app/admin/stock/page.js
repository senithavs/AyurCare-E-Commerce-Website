'use client';

import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminStock from '@/components/admin/AdminStock';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminStockPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Stock Management">
          <AdminStock />
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
