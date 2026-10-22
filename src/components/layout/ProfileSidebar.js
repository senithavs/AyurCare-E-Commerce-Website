'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import '@/styles/admin-animations.css';

const sidebarStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8f9fa',
    position: 'relative',
  },
  toggleButton: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000,
    background: 'var(--green-700)',
    color: '#fff',
    border: 'none',
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  sidebar: {
    width: '280px',
    background: '#fff',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: 'var(--line)',
    padding: '32px 24px',
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    transition: 'all 0.3s ease',
    zIndex: 999,
  },
  sidebarClosed: {
    transform: 'translateX(-100%)',
  },
  sidebarMobileOpen: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--charcoal-60)',
    padding: '8px',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  content: {
    flex: 1,
    marginLeft: '280px',
    overflowY: 'auto',
    transition: 'all 0.3s ease',
  },
  contentShifted: {
    marginLeft: 0,
  },
  userCard: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
    textAlign: 'center',  
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'var(--green-700)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px',
    margin: '0 auto 12px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'var(--charcoal-60)',
    marginBottom: '12px',
    marginTop: '24px',
    paddingTop: '12px',
  },
  sectionTitleFirst: {
    marginTop: 0,
    paddingTop: 0,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'var(--charcoal)',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    marginBottom: '8px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  navItemActive: {
    background: 'rgba(106, 168, 79, 0.1)',
    color: 'var(--green-700)',
    fontWeight: 600,
  },
  navItemHover: {
    background: 'var(--cream)',
    color: 'var(--green-700)',
  },
  icon: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center',
    flexShrink: 0,
  },
  signOutButton: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'var(--line)',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'var(--green-700)',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    marginBottom: '24px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  backButtonHover: {
    background: 'rgba(106, 168, 79, 0.1)',
  },
};

export default function ProfileSidebar({ children, currentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Handle window resize
  if (typeof window !== 'undefined') {
    React.useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth > 768) {
          setSidebarOpen(false); // Close sidebar on desktop
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  }

  const menuItems = [
    {
      label: 'My Profile',
      icon: '👤',
      href: '/profile',
      id: 'profile',
    },
    {
      label: 'My Orders',
      icon: '📦',
      href: '/orders',
      id: 'orders',
    },
    {
      label: 'Settings',
      icon: '⚙️',
      href: '/settings',
      id: 'settings',
    },
  ];

  const handleSignOut = () => {
    signOut();
    // Refresh the page after sign out
    window.location.href = '/';
  };

  const isActive = (href) => {
    return pathname === href;
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={sidebarStyles.container}>
      {/* Mobile Toggle Button - Only show when sidebar is closed */}
      {isMobile && !sidebarOpen && (
        <button
          style={sidebarStyles.toggleButton}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      )}

      {/* Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          style={sidebarStyles.overlay}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...sidebarStyles.sidebar,
          ...(isMobile && !sidebarOpen ? sidebarStyles.sidebarClosed : {}),
          ...(isMobile && sidebarOpen ? sidebarStyles.sidebarMobileOpen : {}),
        }}
      >
        {/* Close Button for Mobile */}
        {isMobile && (
          <button
            style={sidebarStyles.closeButton}
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}

        {/* Back to Home Button */}
        <Link
          href="/"
          style={{
            ...sidebarStyles.backButton,
            marginTop: isMobile ? '32px' : 0,
          }}
          onClick={closeSidebar}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = sidebarStyles.backButtonHover.background;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* User Card */}
        {user && (
          <div style={sidebarStyles.userCard}>
            <div style={sidebarStyles.avatar}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={sidebarStyles.userName}>{user.name}</div>
            <div style={sidebarStyles.userEmail}>{user.email}</div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav>
          <div style={{ ...sidebarStyles.sectionTitle, ...sidebarStyles.sectionTitleFirst }}>
            Account
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                ...sidebarStyles.navItem,
                ...(isActive(item.href) ? sidebarStyles.navItemActive : {}),
              }}
              onClick={closeSidebar}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.background = sidebarStyles.navItemHover.background;
                  e.currentTarget.style.color = sidebarStyles.navItemHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--charcoal)';
                }
              }}
            >
              <span style={sidebarStyles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Sign Out */}
          <div style={sidebarStyles.signOutButton}>
            <button
              onClick={() => {
                closeSidebar();
                handleSignOut();
              }}
              style={{
                ...sidebarStyles.navItem,
                color: '#dc2626',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={sidebarStyles.icon}>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          ...sidebarStyles.content,
          ...(isMobile ? sidebarStyles.contentShifted : {}),
        }}
      >
        {children}
      </main>
    </div>
  );
}
