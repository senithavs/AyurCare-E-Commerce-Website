'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button } from '@/components/ui';

const failedStyles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    textAlign: 'center',
  },
  failedIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  failedTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#C62828',
    marginBottom: '12px',
  },
  failedSubtitle: {
    fontSize: '16px',
    color: 'var(--charcoal-60)',
    marginBottom: '30px',
  },
  errorBox: {
    background: '#FFEBEE',
    border: '1px solid #FFCDD2',
    borderRadius: 'var(--radius-m)',
    padding: '16px',
    marginBottom: '30px',
    color: '#C62828',
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
    color: '#C62828',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '2px solid var(--line)',
  },
  troubleshootingBox: {
    background: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  troubleshootingTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '12px',
  },
  troubleshootingItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px',
  },
  troubleshootingIcon: {
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
  reasonBox: {
    background: '#FFF3E0',
    border: '1px solid #FFE0B2',
    borderRadius: 'var(--radius-m)',
    padding: '12px',
    marginBottom: '16px',
    color: '#E65100',
    fontSize: '13px',
  },
};

export default function PaymentFailedPage() {
  return (
    <LayoutWrapper>
      <Section>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: 'var(--charcoal-60)' }}>Loading...</div>}>
          <PaymentFailedContent />
        </Suspense>
      </Section>
    </LayoutWrapper>
  );
}

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const errorCode = searchParams.get('error_code');
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

            // Update order status to failed
            await fetch(`/api/orders/${orderId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: 'failed',
                paymentStatus: 'failed',
                errorCode,
              }),
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
  }, [orderId, errorCode]);

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'insufficient_funds':
        return 'Your payment card has insufficient funds. Please use a different payment method.';
      case 'card_declined':
        return 'Your payment card was declined. Please check your card details and try again.';
      case 'invalid_card':
        return 'The card information provided is invalid. Please enter correct details.';
      case 'expired_card':
        return 'Your payment card has expired. Please use a different card.';
      case 'processing_error':
        return 'There was an error processing your payment. Please try again later.';
      case 'network_error':
        return 'A network error occurred during payment processing. Please try again.';
      default:
        return 'Your payment could not be processed. Please check your details and try again.';
    }
  };

  return (
    <LayoutWrapper>
      <Section>
        <div style={failedStyles.container}>
          {/* Failed Icon & Title */}
          <div style={failedStyles.failedIcon}>✕</div>
          <h1 style={failedStyles.failedTitle}>Payment Failed</h1>
          <p style={failedStyles.failedSubtitle}>
            Unfortunately, we couldn't process your payment. Please try again.
          </p>

          {/* Error Details */}
          <div style={failedStyles.errorBox}>
            <strong>Why did this happen?</strong>
            <div style={{ marginTop: '8px' }}>{getErrorMessage()}</div>
          </div>

          {/* Order Details (if available) */}
          {isLoading ? (
            <div style={failedStyles.loadingMessage}>Loading order details...</div>
          ) : orderData ? (
            <>
              <div style={failedStyles.orderDetails}>
                <div style={failedStyles.detailRow}>
                  <span style={failedStyles.detailLabel}>Order ID:</span>
                  <span style={failedStyles.detailValue}>{orderData.orderId}</span>
                </div>

                <div style={failedStyles.detailRow}>
                  <span style={failedStyles.detailLabel}>Status:</span>
                  <span
                    style={{
                      ...failedStyles.detailValue,
                      color: '#C62828',
                      fontWeight: 600,
                    }}
                  >
                    Payment Failed
                  </span>
                </div>

                <div style={failedStyles.detailRow}>
                  <span style={failedStyles.detailLabel}>Order Amount:</span>
                  <span style={failedStyles.detailValue}>
                    Rs. {Math.round(orderData.total).toLocaleString()}
                  </span>
                </div>

                <div style={failedStyles.detailRow}>
                  <span style={failedStyles.detailLabel}>Order Date:</span>
                  <span style={failedStyles.detailValue}>
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

                {errorCode && (
                  <div style={failedStyles.reasonBox}>
                    <strong>Error Code:</strong> {errorCode}
                  </div>
                )}

                {/* Items Summary */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <div style={failedStyles.detailLabel} style={{ marginBottom: '12px' }}>
                    Items in This Order:
                  </div>
                  {orderData.items?.map((item, index) => (
                    <div
                      key={index}
                      style={{ ...failedStyles.detailRow, borderBottom: 'none', paddingLeft: '12px' }}
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
                  <div style={failedStyles.detailRow}>
                    <span style={failedStyles.detailLabel}>Subtotal:</span>
                    <span>Rs. {orderData.subtotal?.toLocaleString()}</span>
                  </div>
                  <div style={failedStyles.detailRow}>
                    <span style={failedStyles.detailLabel}>Tax (10%):</span>
                    <span>Rs. {orderData.tax?.toLocaleString()}</span>
                  </div>
                  <div style={failedStyles.detailRow}>
                    <span style={failedStyles.detailLabel}>Delivery:</span>
                    <span>Rs. {orderData.deliveryFee?.toLocaleString()}</span>
                  </div>
                  <div style={failedStyles.totalRow}>
                    <span>Total (Not Charged):</span>
                    <span>Rs. {Math.round(orderData.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div style={failedStyles.troubleshootingBox}>
                <div style={failedStyles.troubleshootingTitle}>What You Can Try</div>
                <div style={failedStyles.troubleshootingItem}>
                  <span style={failedStyles.troubleshootingIcon}>1️⃣</span>
                  <span>Check your card details for accuracy (number, expiry date, CVV)</span>
                </div>
                <div style={failedStyles.troubleshootingItem}>
                  <span style={failedStyles.troubleshootingIcon}>2️⃣</span>
                  <span>Ensure your card is not expired and has sufficient funds</span>
                </div>
                <div style={failedStyles.troubleshootingItem}>
                  <span style={failedStyles.troubleshootingIcon}>3️⃣</span>
                  <span>Try using a different payment card</span>
                </div>
                <div style={failedStyles.troubleshootingItem}>
                  <span style={failedStyles.troubleshootingIcon}>4️⃣</span>
                  <span>Contact your bank if the issue persists</span>
                </div>
                <div style={failedStyles.troubleshootingItem}>
                  <span style={failedStyles.troubleshootingIcon}>5️⃣</span>
                  <span>Reach out to our support team for further assistance</span>
                </div>
              </div>
            </>
          ) : null}

          {/* Action Buttons */}
          <div style={failedStyles.buttonGroup}>
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <Button variant="primary" block>
                Try Payment Again
              </Button>
            </Link>
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <Button variant="outline" block>
                Back to Cart
              </Button>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" block>
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Safety Note */}
          <div style={failedStyles.errorBox} style={{ marginTop: '20px', background: '#E3F2FD', borderColor: '#BBDEFB', color: '#0D47A1' }}>
            <strong>🔒 Your Information Is Safe</strong>
            <div style={{ marginTop: '8px' }}>
              No amount has been charged to your card. Your payment information is secure and handled by PayHere's encrypted payment gateway.
            </div>
          </div>
        </div>
      </Section>
    </LayoutWrapper>
  );
}
