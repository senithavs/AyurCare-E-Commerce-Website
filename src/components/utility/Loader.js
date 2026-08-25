'use client';

export default function Loader({
  size = 'md',
  fullScreen = false,
  label = 'Loading...',
}) {
  const sizeMap = {
    sm: '24px',
    md: '40px',
    lg: '56px',
  };

  const loaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    ...(fullScreen && {
      position: 'fixed',
      inset: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999,
    }),
  };

  const spinnerStyle = {
    width: sizeMap[size] || sizeMap.md,
    height: sizeMap[size] || sizeMap.md,
    border: '3px solid var(--sage-100)',
    borderTop: '3px solid var(--green-700)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div style={loaderStyle}>
        <div style={spinnerStyle} />
        {label && (
          <div style={{ fontSize: '14px', color: 'var(--charcoal-60)' }}>
            {label}
          </div>
        )}
      </div>
    </>
  );
}
