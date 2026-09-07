'use client';

import { useState } from 'react';
import { FormField, Button, Badge } from '@/components/ui';

const checkoutStyles = {
  stepper: {
    display: 'flex',
    justifyContent: 'center',
    gap: 0,
    marginBottom: '38px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
  },
  circ: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    border: '1px solid var(--sage)',
  },
  circActive: {
    background: 'var(--green-700)',
    color: '#fff',
    borderColor: 'var(--green-700)',
  },
  stxt: {
    fontSize: '11.5px',
    marginLeft: '8px',
    color: 'var(--charcoal-60)',
    fontWeight: 600,
  },
  stepLine: {
    width: '56px',
    height: '1px',
    background: 'var(--line)',
    margin: '0 12px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
  fullWidth: {
    gridColumn: '1/-1',
  },
};

export default function CheckoutForm({
  currentStep = 1,
  onStepChange,
  onSubmit,
  totalPrice = 0,
  orderItems = [],
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const steps = [
    { number: 1, label: 'Delivery' },
    { number: 2, label: 'Review' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Confirmation' },
  ];

  return (
    <div>
      {/* Stepper */}
      <div style={checkoutStyles.stepper} data-stepper>
        {steps.map((step, idx) => (
          <div key={step.number} style={checkoutStyles.step} data-step>
            <div
              style={{
                ...checkoutStyles.circ,
                ...(currentStep >= step.number ? checkoutStyles.circActive : {}),
              }}
              data-circ
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <div
              style={{
                ...checkoutStyles.stxt,
                color: currentStep >= step.number ? 'var(--green-900)' : 'var(--charcoal-60)',
              }}
              data-stxt
            >
              {step.label}
            </div>
            {idx < steps.length - 1 && <div style={checkoutStyles.stepLine} data-step-line /></}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }} data-checkout-grid>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <>
              <h3 style={{ fontSize: '14px' }}>Delivery Information</h3>
              <div style={checkoutStyles.formGrid} data-form-grid>
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Amara Perera"
                  required
                />
                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 7X XXX XXXX"
                  required
                />
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="No. 12, Herbal Lane"
                  style={checkoutStyles.fullWidth}
                  required
                />
                <FormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Colombo"
                  required
                />
                <FormField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="00300"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3 style={{ fontSize: '14px' }}>Payment (Sandbox)</h3>
              <div style={checkoutStyles.formGrid} data-form-grid>
                <FormField
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="4242 4242 4242 4242"
                  style={checkoutStyles.fullWidth}
                  required
                />
                <FormField
                  label="Expiry"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
                <FormField
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="•••"
                  required
                />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--charcoal-60)', marginTop: '12px' }}>
                🔒 This is a demo payment flow — no real transaction is processed.
              </p>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }} data-form-buttons>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onStepChange?.(currentStep - 1)}
              >
                ← Back
              </Button>
            )}
            {currentStep < 4 && (
              <Button
                type="button"
                variant="primary"
                onClick={() => onStepChange?.(currentStep + 1)}
              >
                Next →
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="submit" variant="primary">
                Place Order
              </Button>
            )}
          </div>
        </form>

        {/* Order Summary */}
        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-m)',
            padding: '22px',
            background: 'var(--beige-200)',
            height: 'fit-content',
          }}
          data-order-summary
        >
          <h4 style={{ marginTop: 0 }}>Order Summary</h4>
          {orderItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                padding: '8px 0',
                color: 'var(--charcoal-60)',
              }}
            >
              <span>{item.name} ×{item.qty}</span>
              <span>Rs. {item.total.toLocaleString()}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              color: 'var(--green-900)',
              fontSize: '15px',
              borderTop: '1px solid var(--line)',
              marginTop: '6px',
              paddingTop: '14px',
            }}
          >
            <span>Total</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* TABLET: 768px */
        @media (max-width: 768px) {
          [data-checkout-grid] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          [data-stepper] {
            gap: 4px !important;
          }
          [data-stepper] [data-step-line] {
            width: 40px !important;
            margin: 0 6px !important;
          }
          [data-form-buttons] {
            flex-direction: column !important;
          }
          [data-form-buttons] button {
            width: 100% !important;
            font-size: 12px !important;
          }
          [data-order-summary] {
            height: auto !important;
          }
        }

        /* MOBILE: 480px */
        @media (max-width: 480px) {
          [data-form-grid] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          [data-stepper] {
            gap: 0 !important;
            font-size: 10px !important;
          }
          [data-stepper] [data-circ] {
            width: 24px !important;
            height: 24px !important;
            font-size: 10px !important;
          }
          [data-stepper] [data-stxt] {
            display: none !important;
          }
          [data-stepper] [data-step-line] {
            width: 24px !important;
            margin: 0 2px !important;
          }
          [data-form-buttons] {
            flex-direction: column !important;
          }
          [data-form-buttons] button {
            width: 100% !important;
            font-size: 11px !important;
            padding: 8px 16px !important;
          }
        }

        /* SMALL MOBILE: < 375px */
        @media (max-width: 374px) {
          [data-checkout-grid] {
            gap: 12px !important;
          }
          [data-stepper] {
            margin-bottom: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
