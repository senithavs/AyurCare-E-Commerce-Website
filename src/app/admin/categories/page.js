'use client';

import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { AdminProvider } from '@/lib/AdminContext';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CategoriesPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Product Categories">
          <AdminCategories />
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
