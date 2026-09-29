'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import styles from '@/styles/layout.module.css';
import '@/styles/admin-animations.css';

const sidebarStyles = {
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  linkActive: {
    background: 'rgba(170, 229, 184, 0.15)',
    color: '#fff',
    fontWeight: 600,
  },
  icon: {
    fontSize: '16px',
  },
  section: {
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(161, 146, 146, 0.5)',
    padding: '8px 16px',
    marginTop: '8px',
  },
};

const getMenuItems = (isSuperAdmin) => {
  const mainItems = [
    { icon: '📊', label: 'Dashboard', href: '/admin' },
  ];

  // Only show Admin Management to super admin
  if (isSuperAdmin) {
    mainItems.push({ icon: '🔐', label: 'Admin Management', href: '/admin/management' });
  }

  return [
    {
      section: 'Main',
      items: mainItems,
    },
    {
      section: 'Management',
      items: [
        { icon: '👥', label: 'Users', href: '/admin/users' },
        { icon: '📦', label: 'Products', href: '/admin/products' },
        { icon: '📋', label: 'Orders', href: '/admin/orders' },
        { icon: '📈', label: 'Stock', href: '/admin/stock' },
        { icon: '📊', label: 'Sales Analytics', href: '/admin/analytics' }
      ],
    },
  ];
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const { admin, isHydrated } = useAdminAuth();
  const isSuperAdmin = admin?.role === 'super_admin';
  const menuItems = getMenuItems(isSuperAdmin);

  return (
    <aside style={{ padding: '20px 0' }}>
      <nav style={sidebarStyles.nav}>
        {menuItems.map((section) => (
          <div key={section.section} style={sidebarStyles.section}>
            <div style={sidebarStyles.sectionTitle}>{section.section}</div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-sidebar-link"
                  style={{
                    ...sidebarStyles.link,
                    ...(isActive ? sidebarStyles.linkActive : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = '#dfdf1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                >
                  <span style={sidebarStyles.icon}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
