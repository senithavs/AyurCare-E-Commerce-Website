'use client';

import Link from 'next/link';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui';

const dashboardStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: 600,
    color: 'var(--charcoal-60)',
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-900)',
  },
  cardIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  section: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--green-900)',
    borderBottom: '1px solid var(--line)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  td: {
    padding: '12px 8px',
    fontSize: '13px',
    color: 'var(--charcoal)',
    borderBottom: '1px solid var(--line)',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  statusPending: {
    background: '#FBE9CF',
    color: '#8A5A0E',
  },
  statusProcessing: {
    background: '#DCE7F5',
    color: '#2F5A9E',
  },
  statusShipped: {
    background: '#E3DCF5',
    color: '#5A3E9E',
  },
  statusDelivered: {
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
  },
};

export default function AdminDashboard() {
  const { products, orders, calculateAnalytics } = useAdmin();
  const analytics = calculateAnalytics();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return dashboardStyles.statusPending;
      case 'processing':
        return dashboardStyles.statusProcessing;
      case 'shipped':
        return dashboardStyles.statusShipped;
      case 'delivered':
        return dashboardStyles.statusDelivered;
      default:
        return {};
    }
  };

  return (
    <div>
      {/* KPI Cards */}
      <div style={dashboardStyles.grid}>
        <div style={dashboardStyles.card}>
          <div style={dashboardStyles.cardIcon}>📦</div>
          <div style={dashboardStyles.cardTitle}>Total Products</div>
          <div style={dashboardStyles.cardValue}>{analytics.totalProducts}</div>
          <Link href="/admin/products" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View All →
          </Link>
        </div>

        <div style={dashboardStyles.card}>
          <div style={dashboardStyles.cardIcon}>📋</div>
          <div style={dashboardStyles.cardTitle}>Total Orders</div>
          <div style={dashboardStyles.cardValue}>{analytics.totalOrders}</div>
          <Link href="/admin/orders" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View All →
          </Link>
        </div>

        <div style={dashboardStyles.card}>
          <div style={dashboardStyles.cardIcon}>💰</div>
          <div style={dashboardStyles.cardTitle}>Total Revenue</div>
          <div style={dashboardStyles.cardValue}>Rs. {(analytics.totalRevenue / 100000).toFixed(1)}L</div>
          <Link href="/admin/analytics" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View Analytics →
          </Link>
        </div>

        <div style={dashboardStyles.card}>
          <div style={dashboardStyles.cardIcon}>⚠️</div>
          <div style={dashboardStyles.cardTitle}>Low Stock</div>
          <div style={dashboardStyles.cardValue}>{analytics.lowStockProducts}</div>
          <Link href="/admin/stock" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Manage Stock →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={dashboardStyles.section}>
        <div style={dashboardStyles.sectionTitle}>
          <span>Recent Orders</span>
          <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        <table style={dashboardStyles.table}>
          <thead>
            <tr>
              <th style={dashboardStyles.th}>Order ID</th>
              <th style={dashboardStyles.th}>Customer</th>
              <th style={dashboardStyles.th}>Total</th>
              <th style={dashboardStyles.th}>Status</th>
              <th style={dashboardStyles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td style={dashboardStyles.td}>{order.id}</td>
                <td style={dashboardStyles.td}>{order.customerName}</td>
                <td style={dashboardStyles.td}>Rs. {order.total.toLocaleString()}</td>
                <td style={dashboardStyles.td}>
                  <span style={{ ...dashboardStyles.badge, ...getStatusStyle(order.status) }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td style={dashboardStyles.td}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Status Overview */}
      <div style={dashboardStyles.section}>
        <div style={dashboardStyles.sectionTitle}>Order Status Overview</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
            <div
              key={status}
              style={{
                padding: '16px',
                background: 'var(--sage-100)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green-700)', marginBottom: '4px' }}>
                {count}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--charcoal-60)', textTransform: 'capitalize' }}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
