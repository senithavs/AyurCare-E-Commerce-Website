'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import '@/styles/admin-animations.css';

const ordersStyles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    padding: '40px 20px',
  },
  header: {
    maxWidth: '1000px',
    margin: '0 auto 40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-900)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--charcoal-60)',
    margin: 0,
  },
  card: {
    maxWidth: '1000px',
    margin: '0 auto 24px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    animation: 'slideUp 0.6s ease-out',
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--charcoal-60)',
    marginBottom: '24px',
  },
  orderItem: {
    padding: '24px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  orderItemHover: {
    background: '#f8f9fa',
  },
  orderHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '24px',
    marginBottom: '16px',
  },
  orderField: {
    display: 'flex',
    flexDirection: 'column',
  },
  orderLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--charcoal-60)',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  orderValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--charcoal)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    width: 'fit-content',
  },
  statusPending: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: '#b45309',
  },
  statusProcessing: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#1e40af',
  },
  statusShipped: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#166534',
  },
  statusDelivered: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#047857',
  },
  orderDetails: {
    paddingTop: '16px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'var(--line)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '24px',
  },
  detailField: {
    fontSize: '13px',
  },
  detailLabel: {
    color: 'var(--charcoal-60)',
    marginBottom: '4px',
  },
  detailValue: {
    color: 'var(--charcoal)',
    fontWeight: 600,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to load before checking
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    } else if (!isLoading && isAuthenticated) {
      // Fetch orders from database
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchOrders = async () => {
    try {
      setPageLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return ordersStyles.statusPending;
      case 'processing':
        return ordersStyles.statusProcessing;
      case 'shipped':
        return ordersStyles.statusShipped;
      case 'delivered':
        return ordersStyles.statusDelivered;
      default:
        return ordersStyles.statusPending;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!isAuthenticated) {
    return null;
  }

  const pageContent = (
    <div style={ordersStyles.container}>
      <div style={ordersStyles.header}>
        <h1 style={ordersStyles.title}>My Orders</h1>
        <p style={ordersStyles.subtitle}>Track and manage your orders</p>
      </div>

      {pageLoading ? (
        <div style={ordersStyles.card}>
          <div style={ordersStyles.emptyState}>
            <p style={{ color: 'var(--charcoal-60)' }}>Loading your orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div style={ordersStyles.card}>
          <div style={ordersStyles.emptyState}>
            <div style={ordersStyles.emptyIcon}>📦</div>
            <h2 style={ordersStyles.emptyTitle}>No Orders Yet</h2>
            <p style={ordersStyles.emptyText}>
              You haven't placed any orders yet. Start shopping to see them here.
            </p>
            <Link href="/shop" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--green-700)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div style={ordersStyles.card}>
          {orders.map((order, index) => (
            <div
              key={order._id || order.orderId}
              style={{
                ...ordersStyles.orderItem,
                ...(expandedOrder === index ? ordersStyles.orderItemHover : {}),
              }}
              onClick={() => setExpandedOrder(expandedOrder === index ? null : index)}
            >
              <div style={ordersStyles.orderHeader}>
                <div style={ordersStyles.orderField}>
                  <div style={ordersStyles.orderLabel}>Order ID</div>
                  <div style={ordersStyles.orderValue}>#{order.orderId}</div>
                </div>
                <div style={ordersStyles.orderField}>
                  <div style={ordersStyles.orderLabel}>Date</div>
                  <div style={ordersStyles.orderValue}>
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={ordersStyles.orderField}>
                  <div style={ordersStyles.orderLabel}>Amount</div>
                  <div style={ordersStyles.orderValue}>Rs. {order.amount}</div>
                </div>
                <div style={ordersStyles.orderField}>
                  <div style={ordersStyles.orderLabel}>Status</div>
                  <div style={{ ...ordersStyles.statusBadge, ...getStatusStyle(order.status) }}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>
              </div>

              {expandedOrder === index && (
                <div style={ordersStyles.orderDetails}>
                  <div style={ordersStyles.detailField}>
                    <div style={ordersStyles.detailLabel}>Items</div>
                    <div style={ordersStyles.detailValue}>{order.items || 1} item(s)</div>
                  </div>
                  <div style={ordersStyles.detailField}>
                    <div style={ordersStyles.detailLabel}>Tracking</div>
                    <div style={ordersStyles.detailValue}>{order.tracking || 'N/A'}</div>
                  </div>
                  <div style={ordersStyles.detailField}>
                    <div style={ordersStyles.detailLabel}>Expected Delivery</div>
                    <div style={ordersStyles.detailValue}>
                      {order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ProfileSidebar currentPage="orders">
      {pageContent}
    </ProfileSidebar>
  );
}
