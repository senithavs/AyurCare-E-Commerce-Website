'use client';

import Link from 'next/link';
import AdminSidebar from './AdminSidebar';
import AdminProfile from './AdminProfile';
import '@/styles/admin-animations.css';

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
  logoStrip: {
    background: 'linear-gradient(135deg, #7cb7a2 0%, #2d5a4a 50%, #1a3a2e 100%)',
    padding: '0px 10px',
    borderBottom: '3px solid #d4a574',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImage: {
    width: '180px',
    height: '100px',
    objectFit: 'contain',
    flexShrink: 0,
    cursor: 'pointer',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    textAlign: 'center',
  },
  logoSubtext: {
    fontSize: '14px',
    color: '#d4a574',
    fontWeight: 600,
    letterSpacing: '1px',
    textAlign: 'center',
  },
  header: {
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
    borderBottom: '2px solid #e8dcc8',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a3a2e',
    letterSpacing: '-0.3px',
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
        <div style={layoutStyles.logoStrip}>
          <Link href="/" style={layoutStyles.logoContent}>
            <img 
              src='/logo.png'
              alt="AyurCare Logo"
              style={layoutStyles.logoImage}
            />
            <div>
              <div style={layoutStyles.logoText}>AyurCare</div>
              <div style={layoutStyles.logoSubtext}>ADMIN</div>
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
