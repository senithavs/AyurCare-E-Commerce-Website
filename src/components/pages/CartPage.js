'use client';

import { useState } from 'react';
import { Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { CartRow, OrderSummary, EmptyState, LeafDivider } from '@/components/utility';

const cartStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '30px',
  },
  heading: {
    fontSize: '16px',
    fontWeight: 600,
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
};

const mockCartItems = [
  {
    id: 1,
    name: 'Ashwagandha Capsules',
    meta: '60ct bottle',
    qty: 1,
    price: 1450,
  },
  {
    id: 2,
    name: 'Bhringraj Hair Oil',
    meta: '100ml',
    qty: 2,
    price: 1960,
  },
  {
    id: 3,
    name: 'Chamomile Wellness Tea',
    meta: '25 bags',
    qty: 1,
    price: 650,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(mockCartItems);
  const [isEmpty, setIsEmpty] = useState(false);

  const handleQtyChange = (itemId, newQty) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, qty: newQty } : item)));
  };

  const handleRemove = (itemId) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    if (newItems.length === 0) setIsEmpty(true);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = 350;
  const discount = 260;
  const total = subtotal + deliveryFee - discount;

  if (isEmpty) {
    return (
      <Section title="Shopping Cart">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Explore our collections to find your next wellness essential."
          actionLabel="Continue Shopping"
          onAction={() => window.location.href = '/shop'}
        />
      </Section>
    );
  }

  return (
    <Section title="Shopping Cart">
      <div style={cartStyles.grid} data-cart-grid>
        {/* Cart Items */}
        <div>
          <h2 style={cartStyles.heading}>Your Cart ({items.length} items)</h2>
          {items.map((item) => (
            <CartRow
              key={item.id}
              {...item}
              onQtyChange={(newQty) => handleQtyChange(item.id, newQty)}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Order Summary */}
        <OrderSummary
          items={[]}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          discount={discount}
          total={total}
        />
      </div>

      <div style={cartStyles.buttonRow} data-cart-buttons>
        <Button variant="outline" onClick={() => window.location.href = '/shop'}>
          Continue Shopping
        </Button>
        <Button variant="primary" onClick={() => window.location.href = '/checkout'}>
          Proceed to Checkout
        </Button>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* TABLET: 768px */
        @media (max-width: 768px) {
          [data-cart-grid] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          [data-cart-buttons] {
            justify-content: stretch !important;
            gap: 8px !important;
          }
          [data-cart-buttons] button {
            flex: 1 !important;
            font-size: 12px !important;
          }
        }

        /* MOBILE: 480px */
        @media (max-width: 480px) {
          [data-cart-grid] {
            gap: 16px !important;
          }
          [data-cart-buttons] {
            flex-direction: column !important;
            justify-content: stretch !important;
          }
          [data-cart-buttons] button {
            width: 100% !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </Section>
  );
}
