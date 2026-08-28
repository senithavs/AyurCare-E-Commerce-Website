'use client';

const skeletonStyles = {
  skeleton: {
    background: 'linear-gradient(90deg, var(--beige-200) 25%, var(--line) 50%, var(--beige-200) 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite',
    borderRadius: '8px',
  },
  card: {
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-m)',
    overflow: 'hidden',
    background: '#fff',
  },
  image: {
    height: '150px',
    marginBottom: '12px',
  },
  title: {
    height: '16px',
    marginBottom: '8px',
    width: '80%',
  },
  text: {
    height: '12px',
    marginBottom: '6px',
    width: '100%',
  },
  button: {
    height: '36px',
    marginTop: '12px',
  },
};

export default function SkeletonLoader({ count = 4, type = 'product' }) {
  if (type === 'product') {
    return (
      <>
        <style>{`
          @keyframes loading {
            0% {
              backgroundPosition: 200% 0;
            }
            100% {
              backgroundPosition: -200% 0;
            }
          }
        `}</style>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} style={{ ...skeletonStyles.card, padding: '12px' }}>
              <div style={{ ...skeletonStyles.skeleton, ...skeletonStyles.image }} />
              <div style={{ ...skeletonStyles.skeleton, ...skeletonStyles.title }} />
              <div style={{ ...skeletonStyles.skeleton, ...skeletonStyles.text }} />
              <div style={{ ...skeletonStyles.skeleton, ...skeletonStyles.text, width: '60%' }} />
              <div style={{ ...skeletonStyles.skeleton, ...skeletonStyles.button }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes loading {
          0% {
            backgroundPosition: 200% 0;
          }
          100% {
            backgroundPosition: -200% 0;
          }
        }
      `}</style>
      <div>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              height: '60px',
              marginBottom: '12px',
              ...skeletonStyles.skeleton,
            }}
          />
        ))}
      </div>
    </>
  );
}
