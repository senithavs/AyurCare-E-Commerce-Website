'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button, FormField } from '@/components/ui';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { EmptyState } from '@/components/utility';
import PayHereButton from '@/components/payment/PayHereButton';

const checkoutStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '30px',
    margin: '24px 0',
  },
  form: {
    background: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    padding: '24px',
  },
  formSection: {
    marginBottom: '28px',
  },
  formSectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '16px',
    borderBottom: '2px solid var(--green-200)',
    paddingBottom: '12px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
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
  summarySection: {
    marginBottom: '16px',
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '8px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: 'var(--charcoal-60)',
    padding: '6px 0',
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
  errorMessage: {
    background: '#FFEBEE',
    border: '1px solid #FFCDD2',
    borderRadius: 'var(--radius-s)',
    padding: '12px',
    color: '#C62828',
    fontSize: '13px',
    marginBottom: '16px',
  },
  successMessage: {
    background: '#E8F5E9',
    border: '1px solid #C8E6C9',
    borderRadius: 'var(--radius-s)',
    padding: '12px',
    color: '#2E7D32',
    fontSize: '13px',
    marginBottom: '16px',
  },
};

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  // Auto-fill user data on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user, isAuthenticated]);

  if (cartItems.length === 0) {
    return (
      <LayoutWrapper>
        <Section>
          <EmptyState
            icon="📦"
            title="Your cart is empty"
            description="Add products to your cart before proceeding to checkout."
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </Section>
      </LayoutWrapper>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user starts typing
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const deliveryFee = 350; // Fixed delivery fee
  const total = subtotal + tax + deliveryFee;

  return (
    <LayoutWrapper>
      <Section title="Checkout" subtitle="Complete your order">
        <div style={checkoutStyles.container}>
          {/* Checkout Form */}
          <div>
            <div style={checkoutStyles.form}>
              {error && <div style={checkoutStyles.errorMessage}>{error}</div>}

              {/* Shipping Information */}
              <div style={checkoutStyles.formSection}>
                <h3 style={checkoutStyles.formSectionTitle}>Shipping Information</h3>
                <div style={checkoutStyles.formGrid}>
                  <div style={checkoutStyles.fullWidth}>
                    <FormField
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div style={checkoutStyles.fullWidth}>
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div style={checkoutStyles.fullWidth}>
                    <FormField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+94 70 123 4567"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div style={checkoutStyles.formSection}>
                <h3 style={checkoutStyles.formSectionTitle}>Address</h3>
                <div style={checkoutStyles.formGrid}>
                  <div style={checkoutStyles.fullWidth}>
                    <FormField
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Order Summary & Payment */}
          <div style={checkoutStyles.summary}>
            <h3 style={{ margin: '0 0 14px', color: 'var(--green-900)', fontSize: '16px', fontWeight: 600 }}>
              Order Summary
            </h3>

            {/* Order Items */}
            <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', gap: '8px' }}>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--charcoal-60)', minWidth: '40px' }}>x{item.quantity}</span>
                  <span style={{ fontWeight: 600, minWidth: '80px', textAlign: 'right' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={checkoutStyles.summarySection}>
              <div style={checkoutStyles.summaryRow}>
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div style={checkoutStyles.summaryRow}>
                <span>Tax (10%):</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>

              <div style={checkoutStyles.summaryRow}>
                <span>Delivery:</span>
                <span>Rs. {deliveryFee.toLocaleString()}</span>
              </div>
            </div>

            <div style={checkoutStyles.divider}></div>

            <div style={checkoutStyles.summaryTotal}>
              <span>Total:</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>

            {/* Payment Button */}
            <PayHereButton
              formData={formData}
              cartItems={cartItems}
              orderTotal={total}
              onError={setError}
              onSubmitting={setIsSubmitting}
            />

            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <Button
                variant="ghost"
                block
                disabled={isSubmitting}
              >
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </LayoutWrapper>
  );
}
