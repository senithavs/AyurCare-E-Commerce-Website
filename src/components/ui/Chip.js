'use client';

import styles from '@/styles/components.module.css';

export default function Chip({
  children,
  active = false,
  onClick,
  className = '',
  ...props
}) {
  const activeClass = active ? styles.chipActive : '';

  return (
    <button
      className={`${styles.chip} ${activeClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
