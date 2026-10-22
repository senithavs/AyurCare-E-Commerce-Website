'use client';

const topBarStyles = {
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '22px',
  },
  title: {
    fontSize: '18px',
    margin: 0,
    color: 'var(--green-900)',
  },
  searchbox: {
    border: '1px solid var(--line)',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '12px',
    color: 'var(--charcoal-60)',
    width: '220px',
  },
};

export default function AdminTopBar({
  title = 'Dashboard',
  onSearch,
  searchPlaceholder = 'Search...',
}) {
  return (
    <div style={topBarStyles.bar}>
      <h2 style={topBarStyles.title}>{title}</h2>
      {onSearch && (
        <input
          type="text"
          style={topBarStyles.searchbox}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      )}
    </div>
  );
}
