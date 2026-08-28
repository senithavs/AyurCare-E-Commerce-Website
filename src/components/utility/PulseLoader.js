'use client';

export default function PulseLoader({ size = 'md', fullScreen = false }) {
  const sizeMap = {
    sm: { width: '24px', height: '24px', borderWidth: '2px' },
    md: { width: '40px', height: '40px', borderWidth: '3px' },
    lg: { width: '56px', height: '56px', borderWidth: '4px' },
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
      background: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
    }),
  };

  const spinnerStyle = {
    ...sizeMap[size] || sizeMap.md,
    border: `${sizeMap[size]?.borderWidth || '3px'} solid var(--beige-200)`,
    borderTop: `${sizeMap[size]?.borderWidth || '3px'} solid var(--green-700)`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const dotStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--green-700)',
    animation: 'pulse 1.5s ease-in-out infinite',
    margin: '0 4px',
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
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shimmer {
          0% {
            backgroundPosition: -1000px 0;
          }
          100% {
            backgroundPosition: 1000px 0;
          }
        }
      `}</style>
      <div style={loaderStyle}>
        <div style={spinnerStyle} />
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={dotStyle} />
          <div style={{ ...dotStyle, animationDelay: '0.2s' }} />
          <div style={{ ...dotStyle, animationDelay: '0.4s' }} />
        </div>
      </div>
    </>
  );
}
