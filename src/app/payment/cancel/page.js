'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button } from '@/components/ui';

const cancelStyles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    textAlign: 'center',
  },
  cancelIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  cancelTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--charcoal-80)',
    marginBottom: '12px',
  },
  cancelSubtitle: {
    fontSize: '16px',
    color: 'var(--charcoal-60)',
    marginBottom: '30px',
  },
  infoBox: {
    background: '#FFF3E0',
    border: '1px solid #FFE0B2',
    borderRadius: 'var(--radius-m)',
    padding: '16px',
    marginBottom: '30px',
    color: '#E65100',
    fontSize: '14px',
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
  detailRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: 'none',
  },
  detailLabel: {
    fontWeight: 600,
    color: 'var(--charcoal-80)',
  },
  detailValue: {
    color: 'var(--charcoal-60)',
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
  nextSteps: {
    background: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  nextStepsTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '12px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px',
  },
  stepIcon: {
    fontSize: '18px',
    minWidth: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  },
  loadingMessage: {
    fontSize: '16px',
    color: 'var(--charcoal-60)',
    marginBottom: '20px',
  },
};

export default function PaymentCancelPage() {
  return (
    <LayoutWrapper>
      <Section>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: 'var(--charcoal-60)' }}>Loading...</div>}>
          <PaymentCancelContent />
        </Suspense>
      </Section>
    </LayoutWrapper>
  );
}

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
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

            // Update order status to cancelled
            await fetch(`/api/orders/${orderId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'cancelled', paymentStatus: 'cancelled' }),
            });
          }
        } catch (err) {
          console.error('Failed to fetch or update order:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrder();
    }
  }, [orderId]);

  return (
    <LayoutWrapper>
      <Section>
        <div style={cancelStyles.container}>
          {/* Cancel Icon & Title */}
          <div style={cancelStyles.cancelIcon}>⊘</div>
          <h1 style={cancelStyles.cancelTitle}>Payment Cancelled</h1>
          <p style={cancelStyles.cancelSubtitle}>
            Your payment has been cancelled. Your cart items are still available.
          </p>

          {/* Info Box */}
          <div style={cancelStyles.infoBox}>
            <strong>What happened:</strong> You cancelled the payment process. No amount has been charged to
            your card. You can proceed to checkout again whenever you're ready.
          </div>

          {/* Order Details (if available) */}
          {isLoading ? (
            <div style={cancelStyles.loadingMessage}>Loading order details...</div>
          ) : orderData ? (
            <>
              <div style={cancelStyles.orderDetails}>
                <div style={cancelStyles.detailRow}>
                  <span style={cancelStyles.detailLabel}>Order ID:</span>
                  <span style={cancelStyles.detailValue}>{orderData.orderId}</span>
                </div>

                <div style={cancelStyles.detailRow}>
                  <span style={cancelStyles.detailLabel}>Status:</span>
                  <span
                    style={{
                      ...cancelStyles.detailValue,
                      color: '#FF9800',
                      fontWeight: 600,
                    }}
                  >
                    Cancelled
                  </span>
                </div>

                <div style={cancelStyles.detailRow}>
                  <span style={cancelStyles.detailLabel}>Order Amount:</span>
                  <span style={cancelStyles.detailValue}>
                    Rs. {Math.round(orderData.total).toLocaleString()}
                  </span>
                </div>

                <div style={cancelStyles.detailRow}>
                  <span style={cancelStyles.detailLabel}>Order Date:</span>
                  <span style={cancelStyles.detailValue}>
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

                {/* Items Summary */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <div style={cancelStyles.detailLabel} style={{ marginBottom: '12px' }}>
                    Items in This Order:
                  </div>
                  {orderData.items?.map((item, index) => (
                    <div
                      key={index}
                      style={{ ...cancelStyles.detailRow, borderBottom: 'none', paddingLeft: '12px' }}
                    >
                      <span>{item.name}</span>
                      <span>
                        x{item.quantity} @ Rs. {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <div style={cancelStyles.detailRow}>
                    <span style={cancelStyles.detailLabel}>Subtotal:</span>
                    <span>Rs. {orderData.subtotal?.toLocaleString()}</span>
                  </div>
                  <div style={cancelStyles.detailRow}>
                    <span style={cancelStyles.detailLabel}>Tax (10%):</span>
                    <span>Rs. {orderData.tax?.toLocaleString()}</span>
                  </div>
                  <div style={cancelStyles.detailRow}>
                    <span style={cancelStyles.detailLabel}>Delivery:</span>
                    <span>Rs. {orderData.deliveryFee?.toLocaleString()}</span>
                  </div>
                  <div style={cancelStyles.totalRow}>
                    <span>Total (Not Charged):</span>
                    <span>Rs. {Math.round(orderData.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

                <div style={cancelStyles.nextSteps}>
                <div style={cancelStyles.nextStepsTitle}>What You Can Do Now</div>
                <div style={cancelStyles.stepItem}>
                  <span style={cancelStyles.stepIcon}>1️⃣</span>
                  <span>Your items remain in your cart and are ready for checkout</span>
                </div>
                <div style={cancelStyles.stepItem}>
                  <span style={cancelStyles.stepIcon}>2️⃣</span>
                  <span>Review your items and proceed to checkout again</span>
                </div>
                <div style={cancelStyles.stepItem}>
                  <span style={cancelStyles.stepIcon}>3️⃣</span>
                  <span>If you need help, contact our support team</span>
                </div>
              </div>
            </>
          ) : null}

          {/* Action Buttons */}
          <div style={cancelStyles.buttonGroup}>
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <Button variant="primary" block>
                Back to Cart
              </Button>
            </Link>
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <Button variant="outline" block>
                Try Checkout Again
              </Button>
            </Link>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" block>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </LayoutWrapper>
  );
}
