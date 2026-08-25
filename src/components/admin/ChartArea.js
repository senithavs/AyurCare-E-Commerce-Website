'use client';

const chartStyles = {
  area: {
    height: '180px',
    borderRadius: '8px',
    background: `
      linear-gradient(0deg, var(--sage-100) 0%, transparent 60%),
      repeating-linear-gradient(90deg, transparent, transparent 38px, var(--line) 38px, var(--line) 39px)
    `,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    inset: '16px 8px 20px',
    background: `
      linear-gradient(120deg, transparent 55%, var(--sage-100) 55%)
    `,
    clipPath: 'polygon(0 80%,15% 60%,30% 70%,45% 40%,60% 55%,75% 25%,90% 35%,100% 15%,100% 100%,0 100%)',
  },
};

export default function ChartArea({ label = 'Revenue Trend' }) {
  return (
    <div style={{ marginTop: '14px' }}>
      <div style={chartStyles.area}>
        <div style={chartStyles.line} />
      </div>
      <div style={{ fontSize: '11px', color: 'var(--charcoal-60)', marginTop: '8px' }}>
        {label}
      </div>
    </div>
  );
}
