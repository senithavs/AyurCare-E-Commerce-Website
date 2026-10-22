import AdminUsers from '@/components/admin/AdminUsers';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'User Management | Admin - AyurCare',
  description: 'Manage system users and their accounts',
};

export default function UsersPage() {
  return (
    <AdminLayout>
      <AdminUsers />
    </AdminLayout>
  );
}
