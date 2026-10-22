'use client';

import styles from '@/styles/components.module.css';

export default function Card({
  children,
  padded = true,
  hover = false,
  className = '',
  ...props
}) {
  const paddedClass = padded ? styles.cardPadded : '';
  const hoverClass = hover ? styles.cardHover : '';

  return (
    <div className={`${styles.card} ${paddedClass} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
