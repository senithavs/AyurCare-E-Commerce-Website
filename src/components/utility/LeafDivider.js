'use client';

import styles from '@/styles/components.module.css';

export default function LeafDivider({
  label = '🌿',
  className = '',
}) {
  return (
    <div className={`${styles.leafDivider} ${className}`}>
      <div className={styles.stem} />
      <span className={styles.leafMark}>{label}</span>
      <div className={styles.stem} />
    </div>
  );
}
