'use client';

import styles from '@/styles/components.module.css';

export default function QtyBox({
  value = 1,
  onChange,
  min = 1,
  max,
  className = '',
}) {
  // Ensure value is always a valid number
  const numValue = typeof value === 'number' && !isNaN(value) ? value : 1;

  const handleDecrement = () => {
    if (numValue > min) {
      onChange?.(numValue - 1);
    }
  };

  const handleIncrement = () => {
    if (!max || numValue < max) {
      onChange?.(numValue + 1);
    }
  };

  return (
    <div className={`${styles.qtyBox} ${className}`}>
      <button className={styles.qtyButton} onClick={handleDecrement}>
        –
      </button>
      <div className={styles.qtyValue}>{numValue}</div>
      <button className={styles.qtyButton} onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}
