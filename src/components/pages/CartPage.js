'use client';

import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button, QtyBox } from '@/components/ui';
import { EmptyState } from '@/components/utility';
import { useCart } from '@/lib/CartContext';

const cartStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '30px',
    margin: '24px 0',
  },
  cartTable: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 100px 100px 80px',
    gap: '16px',
    padding: '14px 0',
    borderBottom: '1px solid var(--line)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--green-900)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 100px 100px 80px',
    gap: '16px',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid var(--line)',
  },
  productCell: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  productImage: {
    fontSize: '40px',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--sage-100)',
    borderRadius: '8px',
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  productName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-900)',
  },
  productCategory: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
  },
  price: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-700)',
    textAlign: 'center',
  },
  subtotal: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-900)',
    textAlign: 'center',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  summary: {
    background: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    position: 'sticky',
    top: '100px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--green-900)',
    paddingTop: '14px',
    borderTop: '1px solid var(--line)',
    marginTop: '8px',
  },
  divider: {
    height: '1px',
    background: 'var(--line)',
    margin: '8px 0',
  },
};

export default function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
        <Section>
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Continue shopping to add products to your cart."
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </Section>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 500; // Fixed shipping
  const total = subtotal + tax + shipping;

  return (

      <Section title="Shopping Cart" subtitle={`${cartItems.length} items`}>
        <div style={cartStyles.container}>
          {/* Cart Items */}
          <div>
            <div style={cartStyles.tableHeader}>
              <div>Product</div>
              <div></div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} style={cartStyles.tableRow}>
                <div style={cartStyles.productImage}>{item.image}</div>
                <div style={cartStyles.productInfo}>
                  <div style={cartStyles.productName}>{item.name}</div>
                  <div style={cartStyles.productCategory}>{item.category}</div>
                </div>
                <div style={cartStyles.price}>Rs. {item.price.toLocaleString()}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <QtyBox 
                    value={item.quantity} 
                    onChange={(value) => updateQuantity(item.id, value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={cartStyles.subtotal}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    style={cartStyles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F5DCDC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={cartStyles.summary}>
            <h3 style={{ margin: '0 0 14px', color: 'var(--green-900)', fontSize: '16px', fontWeight: 600 }}>
              Order Summary
            </h3>

            <div style={cartStyles.summaryRow}>
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div style={cartStyles.summaryRow}>
              <span>Tax (10%):</span>
              <span>Rs. {Math.round(tax).toLocaleString()}</span>
            </div>

            <div style={cartStyles.summaryRow}>
              <span>Shipping:</span>
              <span>Rs. {shipping.toLocaleString()}</span>
            </div>

            <div style={cartStyles.divider}></div>

            <div style={cartStyles.summaryTotal}>
              <span>Total:</span>
              <span>Rs. {Math.round(total).toLocaleString()}</span>
            </div>

            <Button variant="primary" block>
              Proceed to Checkout
            </Button>

            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" block>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Section>
  );
}
