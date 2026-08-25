'use client';

const barChartStyles = {
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  label: {
    width: '80px',
    fontSize: '11px',
    color: 'var(--charcoal-60)',
  },
  track: {
    flex: 1,
    height: '8px',
    background: 'var(--beige-200)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: 'var(--green-700)',
    borderRadius: '4px',
  },
};

export default function BarChart({
  data = [],
  maxValue = 100,
}) {
  return (
    <div>
      {data.map((item, idx) => (
        <div key={idx} style={barChartStyles.barRow}>
          <div style={barChartStyles.label}>{item.label}</div>
          <div style={barChartStyles.track}>
            <div
              style={{
                ...barChartStyles.fill,
                width: `${(item.value / maxValue) * 100}%`,
              }}
            />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green-900)', minWidth: '40px' }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
