'use client';

import { AdminProvider } from '@/lib/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminAnalyticsPage() {
  return (
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminLayout title="Sales Analytics">
          <AdminAnalytics />
        </AdminLayout>
      </AdminProvider>
    </AdminProtectedRoute>
  );
}
