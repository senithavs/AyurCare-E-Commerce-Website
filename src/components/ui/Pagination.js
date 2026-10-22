'use client';

import styles from '@/styles/components.module.css';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  const items = [];

  // Previous button
  if (currentPage > 1) {
    items.push(
      <button
        key="prev"
        className={styles.paginationItem}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        ‹
      </button>
    );
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    items.push(
      <button
        key={i}
        className={`${styles.paginationItem} ${
          i === currentPage ? styles.paginationItemActive : ''
        }`}
        onClick={() => onPageChange?.(i)}
      >
        {i}
      </button>
    );
  }

  // Next button
  if (currentPage < totalPages) {
    items.push(
      <button
        key="next"
        className={styles.paginationItem}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        ›
      </button>
    );
  }

  return <div className={`${styles.pagination} ${className}`}>{items}</div>;
}
