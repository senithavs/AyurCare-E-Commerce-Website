'use client';

import FeatureCard from './FeatureCard';

export default function FeatureGrid({
  features = [],
  className = '',
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  return (
    <>
      <div style={gridStyle} className={className}>
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          [data-feature-grid] {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          [data-feature-grid] {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}
