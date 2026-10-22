'use client';

import AdminCategories from '@/components/admin/AdminCategories';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CategoriesPage() {
  return (
    <AdminLayout title="Product Categories">
      <AdminCategories />
    </AdminLayout>
  );
}
