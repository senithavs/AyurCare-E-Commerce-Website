'use client';

import styles from '@/styles/components.module.css';

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...props
}) {
  if (type === 'textarea') {
    return (
      <div className={`${styles.formField} ${className}`}>
        {label && <label className={styles.formLabel}>{label}</label>}
        <textarea
          className={styles.formTextarea}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
        {error && <div style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px' }}>{error}</div>}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className={`${styles.formField} ${className}`}>
        {label && <label className={styles.formLabel}>{label}</label>}
        <select
          className={styles.formSelect}
          value={value}
          onChange={onChange}
          {...props}
        >
          {props.children}
        </select>
        {error && <div style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px' }}>{error}</div>}
      </div>
    );
  }

  return (
    <div className={`${styles.formField} ${className}`}>
      {label && <label className={styles.formLabel}>{label}</label>}
      <input
        type={type}
        className={styles.formInput}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && <div style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
}
