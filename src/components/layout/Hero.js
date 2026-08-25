'use client';

import { Button } from '@/components/ui';

export default function Hero({
  badge,
  title,
  description,
  ctaButtons = [],
  backgroundImage,
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        background: 'var(--sage-100)',
        minHeight: '420px',
      }}
    >
      {/* Copy Section */}
      <div style={{ padding: '64px 56px' }}>
        {badge && (
          <span
            style={{
              display: 'inline-block',
              background: 'var(--gold-100)',
              color: '#8A6423',
              fontSize: '11px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '999px',
              letterSpacing: '0.04em',
            }}
          >
            {badge}
          </span>
        )}
        <h1
          style={{
            fontSize: '38px',
            lineHeight: 1.15,
            color: 'var(--green-900)',
            margin: '18px 0 14px',
            fontWeight: 600,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '14.5px',
            color: 'var(--charcoal-60)',
            lineHeight: 1.7,
            maxWidth: '420px',
            margin: '0 0 26px',
          }}
        >
          {description}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          {ctaButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant={btn.variant || 'gold'}
              onClick={btn.onClick}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div
        style={{
          height: '100%',
          minHeight: '420px',
          background: backgroundImage
            ? `url(${backgroundImage})`
            : `
                radial-gradient(circle at 30% 30%, #7E9C7F 0%, transparent 55%),
                radial-gradient(circle at 70% 70%, #4A6B54 0%, transparent 50%),
                linear-gradient(135deg, var(--green-500), var(--green-900))`,
          backgroundSize: backgroundImage ? 'cover' : 'auto',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
            opacity: 0.5,
          }}
        >
          🌿
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          @supports (display: grid) {
            [data-hero] {
              grid-template-columns: 1fr;
            }
          }
        }
      `}</style>
    </div>
  );
}
