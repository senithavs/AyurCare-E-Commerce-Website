'use client';

const summaryStyles = {
  card: {
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-m)',
    padding: '22px',
    background: 'var(--beige-200)',
    height: 'fit-content',
  },
  title: {
    marginTop: 0,
    fontSize: '14px',
  },
  line: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    padding: '8px 0',
    color: 'var(--charcoal-60)',
  },
  lineTotal: {
    fontWeight: 700,
    color: 'var(--green-900)',
    fontSize: '15px',
    borderTop: '1px solid var(--line)',
    marginTop: '6px',
    paddingTop: '14px',
  },
};

export default function OrderSummary({
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  discount = 0,
  total = 0,
}) {
  return (
    <div style={summaryStyles.card}>
      <h4 style={summaryStyles.title}>Order Summary</h4>
      {items.map((item, idx) => (
        <div key={idx} style={summaryStyles.line}>
          <span>{item.label}</span>
          <span>Rs. {item.amount.toLocaleString()}</span>
        </div>
      ))}
      {subtotal > 0 && (
        <div style={summaryStyles.line}>
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
      )}
      {deliveryFee > 0 && (
        <div style={summaryStyles.line}>
          <span>Delivery Fee</span>
          <span>Rs. {deliveryFee.toLocaleString()}</span>
        </div>
      )}
      {discount > 0 && (
        <div style={summaryStyles.line}>
          <span>Discount</span>
          <span>– Rs. {discount.toLocaleString()}</span>
        </div>
      )}
      <div style={summaryStyles.lineTotal}>
        <span>Total</span>
        <span style={{ marginLeft: 'auto' }}>Rs. {total.toLocaleString()}</span>
      </div>
    </div>
  );
}
