'use client';

import styles from '@/styles/layout.module.css';

export default function Section({
  children,
  title,
  subtitle,
  id,
  className = '',
}) {
  return (
    <>
      <section className={`${styles.inner} ${className}`} id={id} data-section>
        {(title || subtitle) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '22px',
                  color: 'var(--green-900)',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <div
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--charcoal-60)',
                    marginTop: '4px',
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        )}
        {children}
      </section>
      <style>{`
        @media (max-width: 768px) {
          [data-section] {
            padding: 32px 16px;
          }
          [data-section] h2 {
            font-size: 18px !important;
          }
        }
        @media (max-width: 480px) {
          [data-section] {
            padding: 24px 12px;
          }
          [data-section] h2 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
