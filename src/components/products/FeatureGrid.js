'use client';

import FeatureCard from './FeatureCard';

export default function FeatureGrid({
  features = [],
  className = '',
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  };

  return (
    <div style={gridStyle} className={className} data-feature-grid>
      {features.map((feature, idx) => (
        <FeatureCard
          key={idx}
          icon={feature.icon}
          imageUrl={feature.imageUrl}
          title={feature.title}
          description={feature.description}
        />
      ))}

      <style>{`
        @media (max-width: 1024px) {
          [data-feature-grid] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          [data-feature-grid] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          [data-feature-grid] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
