'use client';

import Link from 'next/link';
import styles from '@/styles/layout.module.css';

export default function Sidebar({
  items = [],
  activeItem,
  onItemClick,
  type = 'default',
}) {
  const sidebarClass = type === 'admin' ? styles.adminSidebar : styles.sidebar;

  if (type === 'admin') {
    return (
      <aside className={sidebarClass}>
        <div className={styles.adminLogo}>🌿 AyurCare Admin</div>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${styles.adminItem} ${
              item.id === activeItem ? styles.adminItemActive : ''
            }`}
            onClick={() => onItemClick?.(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </aside>
    );
  }

  return (
    <aside className={sidebarClass}>
      {items.map((item, index) => (
        <button
          key={index}
          className={`${styles.sidebarItem} ${
            item.id === activeItem ? styles.sidebarItemActive : ''
          }`}
          onClick={() => onItemClick?.(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
