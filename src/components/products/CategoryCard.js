'use client';

const categoryCardStyles = {
  card: {
    background: '#fff',
    borderRadius: 'var(--radius-m)',
    overflow: 'hidden',
    border: '1px solid var(--line)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  imageContainer: {
    width: '100%',
    height: '150px',
    background: 'var(--sage-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  icon: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
  },
  content: {
    padding: '20px 16px',
    textAlign: 'center',
  },
  name: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--green-900)',
  },
};

export default function CategoryCard({
  icon = '🌱',
  image,
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
      <div style={categoryCardStyles.imageContainer}>
        {image ? (
          <img src={image} alt={name} style={categoryCardStyles.image} />
        ) : (
          <div style={categoryCardStyles.icon}>{icon}</div>
        )}
      </div>
      <div style={categoryCardStyles.content}>
        <div style={categoryCardStyles.name}>{name}</div>
      </div>
    </div>
  );
}
