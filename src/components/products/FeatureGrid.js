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
  );
}
