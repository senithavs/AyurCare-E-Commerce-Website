'use client';

import { Button } from '@/components/ui';

const SUPABASE_IMAGE_URL = 'https://xrejvwbivhtfnblavofv.supabase.co/storage/v1/object/public/Images/Home%20page/BackgroundImage/backgroundImage.jpeg';

export default function Hero({
  badge,
  title,
  description,
  ctaButtons = [],
  backgroundImage = SUPABASE_IMAGE_URL,
}) {
  return (
    <div
      data-hero-section
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        minHeight: '600px',
        padding: '20px',
        transform: 'translateY(0)',
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
        data-hero-content
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
        @media (max-width: 1024px) {
          [data-hero-section] {
            minHeight: 450px;
            padding: 30px 20px;
          }
          [data-hero-content] {
            padding: 50px 40px !important;
          }
          [data-hero-content] h1 {
            fontSize: 36px !important;
          }
        }
        @media (max-width: 768px) {
          [data-hero-section] {
            minHeight: 380px;
            padding: 25px 16px;
          }
          [data-hero-content] {
            padding: 40px 24px !important;
            maxWidth: 100% !important;
          }
          [data-hero-content] h1 {
            fontSize: 32px !important;
            margin: 14px 0 12px !important;
          }
          [data-hero-content] p {
            fontSize: 13.5px !important;
            margin: 0 0 20px !important;
          }
          [data-hero-content] button {
            font-size: 13px !important;
            padding: 10px 16px !important;
          }
        }
        @media (max-width: 480px) {
          [data-hero-section] {
            minHeight: 300px;
            padding: 20px 12px;
          }
          [data-hero-content] {
            padding: 30px 16px !important;
          }
          [data-hero-content] h1 {
            fontSize: 24px !important;
            lineHeight: 1.2 !important;
            margin: 12px 0 10px !important;
          }
          [data-hero-content] p {
            fontSize: 12px !important;
            lineHeight: 1.6 !important;
            margin: 0 0 16px !important;
          }
          [data-hero-content] > div {
            gap: 10px !important;
          }
          [data-hero-content] button {
            font-size: 12px !important;
            padding: 8px 12px !important;
            flex: 1 1 calc(50% - 5px) !important;
            min-width: 100px !important;
          }
        }
      `}</style>
    </div>
  );
}
