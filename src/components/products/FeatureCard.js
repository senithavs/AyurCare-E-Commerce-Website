'use client';

const featureCardStyles = {
  card: {
    textAlign: 'center',
    padding: '26px 16px',
  },
  icon: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'var(--sage-100)',
    margin: '0 auto 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    color: 'var(--green-700)',
  },
  title: {
    fontSize: '13.5px',
    margin: '0 0 6px',
    color: 'var(--green-900)',
    fontWeight: 600,
  },
  description: {
    fontSize: '11.5px',
    color: 'var(--charcoal-60)',
    lineHeight: 1.6,
    margin: 0,
  },
};

export default function FeatureCard({
  icon = '🌿',
  title = 'Feature Title',
  description = 'Feature description',
}) {
  return (
    <div style={featureCardStyles.card}>
      <div style={featureCardStyles.icon}>{icon}</div>
      <h4 style={featureCardStyles.title}>{title}</h4>
      <p style={featureCardStyles.description}>{description}</p>
    </div>
  );
}
