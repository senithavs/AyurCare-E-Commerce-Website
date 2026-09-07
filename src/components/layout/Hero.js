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
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'left', flexWrap: 'wrap' }}>
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
        /* Tablet: 1024px */
        @media (max-width: 1024px) {
          [data-hero-container] {
            min-height: 500px;
          }
          [data-hero-content] {
            padding: 48px 40px !important;
            max-width: 700px !important;
          }
          [data-hero-content] h1 {
            font-size: 36px !important;
          }
        }

        /* Tablet: 768px */
        @media (max-width: 768px) {
          [data-hero-container] {
            min-height: 380px;
            background-attachment: scroll;
          }
          [data-hero-content] {
            padding: 32px 24px !important;
            max-width: 100% !important;
          }
          [data-hero-content] h1 {
            font-size: 28px !important;
            margin: 12px 0 10px !important;
          }
          [data-hero-content] p {
            font-size: 12px !important;
            margin: 0 0 18px !important;
          }
          [data-hero-buttons] {
            gap: 12px !important;
          }
        }

        /* Mobile: 480px */
        @media (max-width: 480px) {
          [data-hero-container] {
            min-height: 280px;
            padding: 12px;
          }
          [data-hero-content] {
            padding: 20px 16px !important;
            max-width: 100% !important;
          }
          [data-hero-content] h1 {
            font-size: 20px !important;
            margin: 10px 0 8px !important;
          }
          [data-hero-content] p {
            font-size: 11px !important;
            margin: 0 0 14px !important;
          }
          [data-hero-buttons] {
            gap: 8px !important;
            flex-direction: column;
          }
          [data-hero-buttons] button {
            width: 100%;
            font-size: 11px !important;
          }
        }

        /* Small Mobile: < 375px */
        @media (max-width: 374px) {
          [data-hero-container] {
            min-height: 240px;
            padding: 8px;
          }
          [data-hero-content] {
            padding: 16px 12px !important;
          }
          [data-hero-content] h1 {
            font-size: 18px !important;
          }
          [data-hero-content] p {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
