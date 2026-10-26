'use client';

import { Suspense } from 'react';
import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminContactsPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Contact Requests">
          <Suspense fallback={<div>Loading...</div>}>
            <AdminContacts />
          </Suspense>
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
