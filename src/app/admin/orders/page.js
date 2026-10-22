'use client';

import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminOrdersPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Orders Management">
          <AdminOrders />
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
