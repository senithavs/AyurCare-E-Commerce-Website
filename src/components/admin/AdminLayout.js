'use client';

import Link from 'next/link';
import AdminSidebar from './AdminSidebar';
import AdminProfile from './AdminProfile';

const layoutStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    minHeight: '100vh',
    background: 'var(--beige-200)',
  },
  sidebar: {
    background: 'var(--green-900)',
    borderRight: '1px solid var(--line)',
    overflowY: 'auto',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  header: {
    background: 'var(--cream)',
    borderBottom: '1px solid var(--line)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--green-900)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    padding: '24px',
    flex: 1,
    background: 'var(--beige-200)',
  },
};

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  return (
    <div style={layoutStyles.container}>
      {/* Sidebar - Static */}
      <div style={layoutStyles.sidebar}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
              🌿 AyurCare Admin
            </div>
          </Link>
        </div>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div style={layoutStyles.content}>
        {/* Header */}
        <div style={layoutStyles.header}>
          <h1 style={layoutStyles.title}>{title}</h1>
          <AdminProfile />
        </div>

        {/* Content */}
        <div style={layoutStyles.main}>{children}</div>
      </div>
    </div>
  );
}
