'use client';

import styles from '@/styles/components.module.css';

export default function Badge({
  children,
  variant = 'pending',
  className = '',
  ...props
}) {
  const variantClass = {
    pending: styles.badgePending,
    processing: styles.badgeProcessing,
    shipped: styles.badgeShipped,
    delivered: styles.badgeDelivered,
    cancelled: styles.badgeCancelled,
    active: styles.badgeActive,
    low: styles.badgeLow,
    out: styles.badgeOut,
  }[variant] || styles.badgePending;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
