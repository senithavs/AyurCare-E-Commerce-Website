'use client';

import { useState } from 'react';

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
    overflow: 'hidden',
    position: 'relative',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '4px',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  fallbackEmoji: {
    zIndex: 1,
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
  imageUrl = null,
  title = 'Feature Title',
  description = 'Feature description',
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if imageUrl is provided and valid
  const hasImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';

  return (
    <div style={featureCardStyles.card}>
      <div style={featureCardStyles.icon}>
        {hasImageUrl && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              style={{
                ...featureCardStyles.iconImage,
                opacity: imageLoaded ? 1 : 0,
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
            {!imageLoaded && <span style={featureCardStyles.fallbackEmoji}>{icon}</span>}
          </>
        ) : (
          <span style={featureCardStyles.fallbackEmoji}>{icon}</span>
        )}
      </div>
      <h4 style={featureCardStyles.title}>{title}</h4>
      <p style={featureCardStyles.description}>{description}</p>
    </div>
  );
}
