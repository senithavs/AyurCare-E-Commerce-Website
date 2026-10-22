'use client';

import { QtyBox, Button } from '@/components/ui';

const cartRowStyles = {
  row: {
    display: 'grid',
    gridTemplateColumns: '70px 1fr auto auto auto',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid var(--line)',
    fontSize: '13px',
  },
  thumb: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    background: 'var(--sage-100)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  name: {
    fontWeight: 600,
    fontSize: '13px',
  },
  meta: {
    fontSize: '11px',
    color: 'var(--charcoal-60)',
  },
  price: {
    fontWeight: 600,
  },
  remove: {
    color: 'var(--danger)',
    fontSize: '12px',
    cursor: 'pointer',
  },
};

export default function CartRow({
  id,
  image,
  name,
  meta,
  qty,
  onQtyChange,
  price,
  onRemove,
}) {
  return (
    <div style={cartRowStyles.row}>
      <div style={cartRowStyles.thumb} />
      <div style={cartRowStyles.info}>
        <div style={cartRowStyles.name}>{name}</div>
        <div style={cartRowStyles.meta}>{meta}</div>
      </div>
      <QtyBox value={qty} onChange={onQtyChange} />
      <div style={cartRowStyles.price}>Rs. {price.toLocaleString()}</div>
      <button
        onClick={() => onRemove?.(id)}
        style={cartRowStyles.remove}
        aria-label="Remove item"
      >
        Remove
      </button>
    </div>
  );
}
