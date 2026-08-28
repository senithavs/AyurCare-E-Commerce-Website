'use client';

import { Button } from '@/components/ui';

export default function Hero({
  badge,
  title,
  description,
  ctaButtons = [],
  backgroundImage = '/backgroundImage.jpeg',
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        minHeight: '600px',
        padding: '20px',
        background: `url(${backgroundImage}) center/cover no-repeat`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      {/* Copy Section */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '64px 56px',
          maxWidth: '800px',
          color: '#fff',
          textAlign: 'left',
        }}
      >
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
            fontSize: '45px',
            lineHeight: 1.15,
            color: '#fff',
            margin: '18px 0 14px',
            fontWeight: 600,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '14.5px',
            color: '#E8E8E8',
            lineHeight: 1.7,
            margin: '0 0 26px',
          }}
        >
          {description}
        </p>
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'left' }}>
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

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          [data-hero-section] {
            minHeight: 350px;
            padding: 40px 20px;
          }
          [data-hero-content] {
            padding: 40px 20px !important;
          }
        }
        @media (max-width: 480px) {
          [data-hero-section] {
            minHeight: 280px;
          }
          [data-hero-content] h1 {
            fontSize: 28px !important;
          }
          [data-hero-content] p {
            fontSize: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}
