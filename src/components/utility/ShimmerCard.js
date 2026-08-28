'use client';

export default function ShimmerCard({ width = '100%', height = '200px' }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            backgroundPosition: -1000px 0;
          }
          100% {
            backgroundPosition: 1000px 0;
          }
        }
      `}</style>
      <div
        style={{
          width,
          height,
          background: 'linear-gradient(90deg, var(--beige-200) 25%, var(--line) 50%, var(--beige-200) 75%)',
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite',
          borderRadius: '8px',
        }}
      />
    </>
  );
}
