'use client';

import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminProductsPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Products Management">
          <AdminProducts />
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
