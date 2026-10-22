'use client';

import { Button } from '@/components/ui';
import styles from '@/styles/components.module.css';

export default function EmptyState({
  icon = '🔍',
  title = 'No items found',
  description = 'Try adjusting your search or filters',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.emptyStateIcon}>{icon}</div>
      <h4 className={styles.emptyStateTitle}>{title}</h4>
      <p className={styles.emptyStateText}>{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
