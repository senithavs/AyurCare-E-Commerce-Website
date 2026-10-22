'use client';

import { useEffect, useState } from 'react';

const toastStyles = {
  container: {
    position: 'fixed',
    top: '80px',
    right: '20px',
    zIndex: 9999,
  },
  toast: {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '300px',
    animation: 'slideIn 0.3s ease forwards',
  },
  icon: {
    fontSize: '16px',
  },
  close: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0 4px',
    marginLeft: 'auto',
  },
};

export function Toast({ message, duration = 3000, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const bgColors = {
    success: 'var(--green-700)',
    error: 'var(--danger)',
    info: 'var(--green-700)',
    warning: '#F59E0B',
  };

  return (
    <div style={toastStyles.container}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div
        style={{
          ...toastStyles.toast,
          background: bgColors[type] || toastStyles.toast.background,
        }}
      >
        <span style={toastStyles.icon}>{icons[type]}</span>
        <span>{message}</span>
        <button
          style={toastStyles.close}
          onClick={() => setIsVisible(false)}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
