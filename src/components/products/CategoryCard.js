'use client';

const categoryCardStyles = {
  card: {
    background: 'var(--beige-200)',
    borderRadius: 'var(--radius-m)',
    padding: '20px 14px',
    textAlign: 'center',
    border: '1px solid var(--line)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  icon: {
    width: '48px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--sage-100)',
    margin: '0 auto 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  name: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--green-900)',
  },
};

export default function CategoryCard({
  icon = '🌱',
  name = 'Category',
  onClick,
}) {
  return (
    <div
      style={categoryCardStyles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
      role="button"
      tabIndex={0}
    >
      <div style={categoryCardStyles.icon}>{icon}</div>
      <div style={categoryCardStyles.name}>{name}</div>
    </div>
  );
}
