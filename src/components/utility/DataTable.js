'use client';

const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    fontSize: '10.5px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--charcoal-60)',
    padding: '10px 12px',
    borderBottom: '1px solid var(--line)',
    background: 'var(--beige-200)',
  },
  td: {
    fontSize: '12.5px',
    padding: '12px',
    borderBottom: '1px solid var(--line)',
    color: 'var(--charcoal)',
  },
};

export default function DataTable({
  columns = [],
  data = [],
  className = '',
}) {
  return (
    <table style={tableStyles.table} className={className}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={tableStyles.th}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((col) => (
              <td key={`${rowIdx}-${col.key}`} style={tableStyles.td}>
                {col.render
                  ? col.render(row[col.key], row, rowIdx)
                  : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
