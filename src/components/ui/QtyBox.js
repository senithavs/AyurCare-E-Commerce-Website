'use client';

import styles from '@/styles/components.module.css';

export default function QtyBox({
  value = 1,
  onChange,
  min = 1,
  max,
  className = '',
}) {
  const handleDecrement = () => {
    if (value > min) {
      onChange?.(value - 1);
    }
  };

  const handleIncrement = () => {
    if (!max || value < max) {
      onChange?.(value + 1);
    }
  };

  return (
    <div className={`${styles.qtyBox} ${className}`}>
      <button className={styles.qtyButton} onClick={handleDecrement}>
        –
      </button>
      <div className={styles.qtyValue}>{value}</div>
      <button className={styles.qtyButton} onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}
