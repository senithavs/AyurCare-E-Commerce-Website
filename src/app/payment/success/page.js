'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { useCart } from '@/lib/CartContext';

const successStyles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '80px',
    marginBottom: '20px',
    animation: 'scaleIn 0.5s ease-out',
  },
  successTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '12px',
  },
  successSubtitle: {
    fontSize: '16px',
    color: 'var(--charcoal-60)',
    marginBottom: '30px',
  },
  orderDetails: {
    background: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    padding: '24px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--line)',
  },
  detailLabel: {
    fontWeight: 600,
    color: 'var(--charcoal-80)',
  },
  detailValue: {
    color: 'var(--charcoal-60)',
  },
  detailRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: 'none',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '2px solid var(--green-200)',
  },
  infoBox: {
    background: '#E8F5E9',
    border: '1px solid #C8E6C9',
    borderRadius: 'var(--radius-m)',
    padding: '16px',
    marginBottom: '30px',
    color: '#2E7D32',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  },
  keyPoints: {
    textAlign: 'left',
    background: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    padding: '20px',
    marginBottom: '20px',
  },
  keyPoint: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px',
  },
  keyPointIcon: {
    fontSize: '18px',
    minWidth: '20px',
  },
  loadingMessage: {
    fontSize: '16px',
    color: 'var(--charcoal-60)',
    marginBottom: '20px',
  },
};

function PaymentSuccessPage() {
  return (
    <LayoutWrapper>
      <Section>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: 'var(--charcoal-60)' }}>Loading...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </Section>
    </LayoutWrapper>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // Fetch order from database
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          if (response.ok) {
            const order = await response.json();
            setOrderData(order);
          }
        } catch (err) {
          console.error('Failed to fetch order:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrder();
      // Clear cart after successful payment
      clearCart();
    }
  }, [orderId, clearCart]);

  return (
    <LayoutWrapper>
      <Section>
        <div style={successStyles.container}>
          {/* Success Icon & Title */}
          <div style={successStyles.successIcon}>✓</div>
          <h1 style={successStyles.successTitle}>Payment Successful!</h1>
          <p style={successStyles.successSubtitle}>
            Your payment has been processed successfully.
          </p>

          {/* Info Box */}
          <div style={successStyles.infoBox}>
            <strong>Payment Status:</strong> The actual payment status will be validated via our secure
            server-to-server notification from PayHere. Your order status will update shortly.
          </div>

          {/* Order Details */}
          {isLoading ? (
            <div style={successStyles.loadingMessage}>Loading order details...</div>
          ) : orderData ? (
            <>
              <div style={successStyles.orderDetails}>
                <div style={successStyles.detailRow}>
                  <span style={successStyles.detailLabel}>Order ID:</span>
                  <span style={successStyles.detailValue}>{orderData.orderId}</span>
                </div>

                <div style={successStyles.detailRow}>
                  <span style={successStyles.detailLabel}>Status:</span>
                  <span
                    style={{
                      ...successStyles.detailValue,
                      color: orderData.status === 'completed' ? '#4CAF50' : '#FF9800',
                      fontWeight: 600,
                    }}
                  >
                    {orderData.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <div style={successStyles.detailRow}>
                  <span style={successStyles.detailLabel}>Payment Amount:</span>
                  <span style={successStyles.detailValue}>
                    Rs. {Math.round(orderData.total).toLocaleString()}
                  </span>
                </div>

                <div style={successStyles.detailRow}>
                  <span style={successStyles.detailLabel}>Currency:</span>
                  <span style={successStyles.detailValue}>{orderData.currency}</span>
                </div>

                <div style={successStyles.detailRow}>
                  <span style={successStyles.detailLabel}>Order Date:</span>
                  <span style={successStyles.detailValue}>
                    {orderData.createdAt
                      ? new Date(orderData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </span>
                </div>

                <div style={successStyles.detailRow}>
                  <span style={successStyles.detailLabel}>Customer Email:</span>
                  <span style={successStyles.detailValue}>{orderData.customer?.email}</span>
                </div>

                <div style={successStyles.detailRowLast}>
                  <span style={successStyles.detailLabel}>Delivery Address:</span>
                  <span style={successStyles.detailValue}>
                    {orderData.customer?.address}, Sri Lanka
                  </span>
                </div>

                {/* Items Summary */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <div style={successStyles.detailLabel} style={{ marginBottom: '12px' }}>
                    Items:
                  </div>
                  {orderData.items?.map((item, index) => (
                    <div key={index} style={{ ...successStyles.detailRow, borderBottom: 'none', paddingLeft: '12px' }}>
                      <span>{item.name}</span>
                      <span>
                        x{item.quantity} @ Rs. {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <div style={successStyles.detailRow}>
                    <span style={successStyles.detailLabel}>Subtotal:</span>
                    <span>Rs. {orderData.subtotal?.toLocaleString()}</span>
                  </div>
                  <div style={successStyles.detailRow}>
                    <span style={successStyles.detailLabel}>Tax (10%):</span>
                    <span>Rs. {orderData.tax?.toLocaleString()}</span>
                  </div>
                  <div style={successStyles.detailRow}>
                    <span style={successStyles.detailLabel}>Delivery:</span>
                    <span>Rs. {orderData.deliveryFee?.toLocaleString()}</span>
                  </div>
                  <div style={successStyles.totalRow}>
                    <span>Total:</span>
                    <span>Rs. {Math.round(orderData.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div style={successStyles.keyPoints}>
                <div style={successStyles.keyPoint}>
                  <span style={successStyles.keyPointIcon}>📧</span>
                  <span>Confirmation email will be sent to {orderData.customer?.email}</span>
                </div>
                <div style={successStyles.keyPoint}>
                  <span style={successStyles.keyPointIcon}>📦</span>
                  <span>Your order will be processed and shipped within 2-3 business days</span>
                </div>
                <div style={successStyles.keyPoint}>
                  <span style={successStyles.keyPointIcon}>🚚</span>
                  <span>Delivery will be to: {orderData.customer?.address}, Sri Lanka</span>
                </div>
              </div>
            </>
          ) : (
            <div style={successStyles.infoBox}>
              <strong>Order ID not found.</strong> If you just completed payment, your order details will appear
              shortly.
            </div>
          )}

          {/* Action Buttons */}
          <div style={successStyles.buttonGroup}>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <Button variant="primary" block>
                Continue Shopping
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" block>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </LayoutWrapper>
  );
}

export default PaymentSuccessPage;
