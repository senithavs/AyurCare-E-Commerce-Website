'use client';

const kpiStyles = {
  card: {
    border: '1px solid var(--line)',
    borderRadius: '12px',
    padding: '16px 14px',
    background: '#fff',
  },
  label: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--charcoal-60)',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  value: {
    fontSize: '19px',
    fontWeight: 700,
    color: 'var(--green-900)',
    margin: '8px 0 4px',
  },
  trend: {
    fontSize: '10.5px',
    color: 'var(--green-700)',
  },
};

export default function KPICard({
  label = 'Metric',
  value = '0',
  trend,
  icon,
}) {
  return (
    <div style={kpiStyles.card}>
      {icon && <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>}
      <div style={kpiStyles.label}>{label}</div>
      <div style={kpiStyles.value}>{value}</div>
      {trend && <div style={kpiStyles.trend}>{trend}</div>}
    </div>
  );
}
