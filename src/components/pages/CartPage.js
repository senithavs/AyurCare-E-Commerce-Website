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
      <div style={cartStyles.grid}>
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

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button variant="outline" onClick={() => window.location.href = '/shop'}>
          Continue Shopping
        </Button>
        <Button variant="primary" onClick={() => window.location.href = '/checkout'}>
          Proceed to Checkout
        </Button>
      </div>
    </Section>
  );
}
