'use client';

import { Button } from '@/components/ui';

const promoCardStyles = {
  card: {
    background: 'linear-gradient(120deg, var(--green-700), var(--green-900))',
    borderRadius: 'var(--radius-l)',
    padding: '44px 48px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30px',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    margin: '0 0 8px',
  },
  description: {
    fontSize: '13px',
    color: '#CBDBCC',
    margin: 0,
  },
};

export default function PromoCard({
  title = 'Promo Title',
  description = 'Promo description',
  buttonLabel = 'Learn More',
  onButtonClick,
}) {
  return (
    <>
      <div style={promoCardStyles.card} data-promo-card>
        <div style={promoCardStyles.content}>
          <h3 style={promoCardStyles.title}>{title}</h3>
          <p style={promoCardStyles.description}>{description}</p>
        </div>
        <Button variant="gold" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-promo-card] {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 32px 24px !important;
            gap: 20px !important;
          }
          [data-promo-card] h3 {
            font-size: 20px !important;
          }
          [data-promo-card] button {
            align-self: flex-start !important;
          }
        }
        @media (max-width: 480px) {
          [data-promo-card] {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 24px 16px !important;
            gap: 16px !important;
          }
          [data-promo-card] h3 {
            font-size: 18px !important;
            margin: 0 0 6px !important;
          }
          [data-promo-card] p {
            font-size: 12px !important;
          }
          [data-promo-card] button {
            width: 100% !important;
            align-self: stretch !important;
          }
        }
      `}</style>
    </>
  );
}
