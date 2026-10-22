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
    margin: '5px auto',
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
    padding: '10px',
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
  const [cartCleared, setCartCleared] = useState(false);

  console.log('PaymentSuccessContent mounted - orderId from URL:', orderId); // Debug log

  useEffect(() => {
    console.log('useEffect running - orderId:', orderId, 'cartCleared:', cartCleared); // Debug log
    console.log('orderId type:', typeof orderId, 'orderId === null:', orderId === null, 'orderId === undefined:', orderId === undefined); // Debug log
    
    if (orderId && !cartCleared) {
      console.log('✅ Fetching order with ID:', orderId); // Debug log
      // Fetch order from database
      const fetchOrder = async () => {
        try {
          const url = `/api/orders/${orderId}`;
          console.log('Making request to URL:', url); // Debug log
          const response = await fetch(url);
          console.log('✅ Response received - Status:', response.status); // Debug log
          console.log('Response headers:', {
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length'),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Order data received:', data); // Debug log
            console.log('Order object:', data.order); // Debug log
            console.log('Order total:', data.order?.total, 'Type:', typeof data.order?.total); // Debug log
            console.log('Order amount:', data.order?.amount, 'Type:', typeof data.order?.amount); // Debug log
            // The API returns { success, order, progressPercentage }
            setOrderData(data.order);
          } else {
            console.error('❌ Response not ok'); // Debug log
            const responseText = await response.text();
            console.error('Response text:', responseText);
            try {
              const error = JSON.parse(responseText);
              console.error('Parsed error:', error);
            } catch (e) {
              console.error('Could not parse response as JSON');
            }
          }
        } catch (err) {
          console.error('❌ Exception caught:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrder();
      // Clear cart after successful payment (only once)
      clearCart();
      setCartCleared(true);
    } else if (!orderId) {
      console.warn('⚠️ No orderId in URL params');
      setIsLoading(false);
    }
  }, [orderId, cartCleared, clearCart]);

  return (
      <Section>
        <div style={successStyles.container}>
          {/* Success Icon & Title */}
          <div style={successStyles.successIcon}>✓</div>
          <h1 style={successStyles.successTitle}>Payment Successful!</h1>
          <p style={successStyles.successSubtitle}>
            Your payment has been processed successfully.
          </p>

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

                {/* Items Summary */}
                <div style={{ marginTop: '16px', paddingTop: '16px' }}>
                  <div style={{ ...successStyles.detailLabel, marginBottom: '12px' }}>
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

                {/* Order Total Only */}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <div style={successStyles.totalRow}>
                    <span>Total:</span>
                    <span>Rs. {orderData.total ? Math.round(orderData.total).toLocaleString() : orderData.amount ? Math.round(orderData.amount).toLocaleString() : '0'}</span>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div style={successStyles.keyPoints}>
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
          ) : isLoading ? (
            <div style={successStyles.loadingMessage}>Loading order details...</div>
          ) : !orderId ? (
            <div style={successStyles.infoBox}>
              <strong>⚠️ No Order ID:</strong> The payment system didn't return an order ID. Please check your email for payment confirmation or contact support.
            </div>
          ) : (
            <div style={successStyles.infoBox}>
              <strong>Order ID not found:</strong> Order <code>{orderId}</code> is not yet in our system. If you just completed payment, your order details will appear shortly. Please refresh this page or check your email.
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
  );
}

export default PaymentSuccessPage;
