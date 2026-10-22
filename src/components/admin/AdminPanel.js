'use client';

const panelStyles = {
  panel: {
    border: '1px solid var(--line)',
    borderRadius: '12px',
    padding: '20px',
    background: '#fff',
  },
  title: {
    fontSize: '12.5px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    margin: 0,
  },
};

export default function AdminPanel({
  title,
  children,
  className = '',
}) {
  return (
    <div style={panelStyles.panel} className={className}>
      {title && <h3 style={panelStyles.title}>{title}</h3>}
      {children}
    </div>
  );
}
