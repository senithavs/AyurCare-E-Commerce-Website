'use client';

import { useState, useEffect } from 'react';

const featureCardStyles = {
  card: {
    textAlign: 'center',
    padding: '26px 16px',
  },
  icon: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: 'var(--sage-100)',
    margin: '0 auto 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'var(--green-700)',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
  },
  iconImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '4px',
    boxSizing: 'border-box',
    display: 'block',
  },
  fallbackEmoji: {
    fontSize: '40px',
    lineHeight: 1,
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
  const [showImage, setShowImage] = useState(false);

  // Check if imageUrl is provided and valid
  const hasImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';

  // Debug: Log when component mounts and when imageUrl changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setShowImage(false);
    
    if (hasImageUrl) {
      console.log(`[FeatureCard] Component updated for "${title}":`, imageUrl);
      setShowImage(true);
    }
  }, [imageUrl, title, hasImageUrl]);

  const handleImageLoad = () => {
    console.log(`✅ [FeatureCard] Image LOADED for "${title}"`);
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.error(`❌ [FeatureCard] Image FAILED for "${title}"`);
    console.error('URL:', imageUrl);
    console.error('Error:', e);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div style={featureCardStyles.card}>
      <div style={featureCardStyles.icon}>
        {showImage && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              style={{
                ...featureCardStyles.iconImage,
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
            {!imageLoaded && (
              <span style={featureCardStyles.fallbackEmoji}>
                {icon}
              </span>
            )}
          </>
        ) : (
          <span style={featureCardStyles.fallbackEmoji}>
            {icon}
          </span>
        )}
      </div>
      <h4 style={featureCardStyles.title}>{title}</h4>
      <p style={featureCardStyles.description}>{description}</p>
    </div>
  );
}
