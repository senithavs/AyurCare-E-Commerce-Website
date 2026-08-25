'use client';

import styles from '@/styles/components.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  icon = null,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClass = styles.btn;
  const variantClass = {
    primary: styles.btnPrimary,
    gold: styles.btnGold,
    outline: styles.btnOutline,
    outlineLight: styles.btnOutlineLight,
    ghost: styles.btnGhost,
    danger: styles.btnDanger,
  }[variant] || styles.btnPrimary;

  const sizeClass = size === 'sm' ? styles.btnSm : '';
  const blockClass = block ? styles.btnBlock : '';
  const disabledClass = disabled ? styles.btnDisabled : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${blockClass} ${disabledClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
