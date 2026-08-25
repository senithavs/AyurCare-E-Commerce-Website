'use client';

import Link from 'next/link';
import styles from '@/styles/components.module.css';

export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav className={`${styles.breadcrumb} ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className={styles.breadcrumbActive}>{item.label}</span>
          )}
          {index < items.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
}
