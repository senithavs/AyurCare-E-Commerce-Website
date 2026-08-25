'use client';

import styles from '@/styles/components.module.css';

export default function Avatar({
  size = 'sm',
  src,
  alt = 'Avatar',
  initials,
  className = '',
  ...props
}) {
  const sizeClass = size === 'lg' ? styles.avatarLg : styles.avatarSm;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} ${className}`}
        style={{ objectFit: 'cover' }}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'lg' ? '20px' : '14px',
        fontWeight: 600,
        color: 'var(--green-700)',
      }}
      {...props}
    >
      {initials}
    </div>
  );
}
