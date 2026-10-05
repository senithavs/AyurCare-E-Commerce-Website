'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { validateCheckoutData } from '@/lib/payment/payhere';

/**
 * PayHere Payment Button Component
 * 
 * Handles payment initialization and redirects to PayHere payment gateway.
 * The Merchant Secret is NEVER exposed to the client - all hashing is done server-side.
 * 
 * Flow:
 * 1. User clicks "Pay with PayHere"
 * 2. Component validates checkout data
 * 3. Calls /api/payment/payhere to get payment parameters
 * 4. Submits form to PayHere gateway
 * 5. User completes payment on PayHere
 * 6. Redirected to success/cancel page
 */
export default function PayHereButton({
  formData,
  cartItems,
  orderTotal,
  onError,
  onSubmitting,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate checkout data
    const { valid, errors } = validateCheckoutData(formData);
    if (!valid) {
      const errorMessages = Object.values(errors).join(', ');
      onError(`Please fill in all required fields: ${errorMessages}`);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      onError('Your cart is empty');
      return;
    }

    setIsLoading(true);
    onSubmitting?.(true);

    try {
      // Call server-side API to initialize payment
      // This API will:
      // - Validate the request
      // - Recalculate the order total (server-side)
      // - Generate the PayHere hash (using Merchant Secret)
      // - Return payment parameters
      const response = await fetch('/api/payment/payhere', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutData: formData,
          cartItems,
          orderTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Get the payment parameters from the response
      const {
        merchant_id,
        order_id,
        items,
        currency,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        country,
        amount,
        hash,
        return_url,
        cancel_url,
        notify_url,
      } = data.paymentData;

      // Create a hidden form to submit to PayHere
      // PayHere requires form-based POST submission
      const form = document.createElement('form');
      form.method = 'POST';
      
      // Determine PayHere gateway URL based on environment
      // For sandbox testing: https://sandbox.payhere.lk/pay/checkout
      // For production: https://www.payhere.lk/pay/checkout
      // Using sandbox for development
      form.action = 'https://sandbox.payhere.lk/pay/checkout';
      form.style.display = 'none';

      // Add payment parameters to form
      const fields = {
        merchant_id,
        return_url,
        cancel_url,
        notify_url,
        order_id,
        items,
        currency,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        country,
        amount,
        hash,
      };

      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();

      // Clean up (won't actually execute as page will redirect)
      document.body.removeChild(form);
    } catch (err) {
      console.error('Payment initialization error:', err);
      onError(err.message || 'Failed to initialize payment. Please try again.');
      setIsLoading(false);
      onSubmitting?.(false);
    }
  };

  return (
    <Button
      variant="primary"
      block
      onClick={handlePayment}
      disabled={isLoading}
      type="button"
    >
      {isLoading ? 'Processing...' : 'Pay with PayHere'}
    </Button>
  );
}
