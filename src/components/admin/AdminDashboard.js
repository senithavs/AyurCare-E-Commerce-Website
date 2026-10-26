'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

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
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    ordersByStatus: {
      all: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      const fetchedOrders = ordersData.orders || [];
      setOrders(fetchedOrders);

      // Fetch products
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      const fetchedProducts = productsData.products || [];
      setProducts(fetchedProducts);

      // Calculate analytics
      const totalProducts = fetchedProducts.length;
      const totalOrders = fetchedOrders.length;
      const totalRevenue = fetchedOrders.reduce((sum, order) => sum + (order.total || order.amount || 0), 0);
      const lowStockProducts = fetchedProducts.filter((p) => (p.stock_quantity || 0) < 10).length;

      const ordersByStatus = {
        all: fetchedOrders.length,
        pending: fetchedOrders.filter((o) => o.status === 'pending').length,
        processing: fetchedOrders.filter((o) => o.status === 'processing').length,
        shipped: fetchedOrders.filter((o) => o.status === 'shipped').length,
        delivered: fetchedOrders.filter((o) => o.status === 'delivered').length,
      };

      setAnalytics({
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStockProducts,
        ordersByStatus,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="admin-page-enter">
      {/* KPI Cards */}
      <div style={dashboardStyles.grid}>
        <div style={dashboardStyles.card} className="admin-kpi-card">
          <div style={dashboardStyles.cardIcon}>📦</div>
          <div style={dashboardStyles.cardTitle}>Total Products</div>
          <div style={dashboardStyles.cardValue}>{analytics.totalProducts}</div>
          <Link href="/admin/products" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View All →
          </Link>
        </div>

        <div style={dashboardStyles.card} className="admin-kpi-card">
          <div style={dashboardStyles.cardIcon}>📋</div>
          <div style={dashboardStyles.cardTitle}>Total Orders</div>
          <div style={dashboardStyles.cardValue}>{analytics.totalOrders}</div>
          <Link href="/admin/orders" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View All →
          </Link>
        </div>

        <div style={dashboardStyles.card} className="admin-kpi-card">
          <div style={dashboardStyles.cardIcon}>💰</div>
          <div style={dashboardStyles.cardTitle}>Total Revenue</div>
          <div style={dashboardStyles.cardValue}>Rs. {(analytics.totalRevenue / 100000).toFixed(1)}L</div>
          <Link href="/admin/analytics" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            View Analytics →
          </Link>
        </div>

        <div style={dashboardStyles.card} className="admin-kpi-card">
          <div style={dashboardStyles.cardIcon}>⚠️</div>
          <div style={dashboardStyles.cardTitle}>Low Stock</div>
          <div style={dashboardStyles.cardValue}>{analytics.lowStockProducts}</div>
          <Link href="/admin/stock" style={{ fontSize: '12px', color: 'var(--green-700)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Manage Stock →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={dashboardStyles.section} className="admin-section-card">
        <div style={dashboardStyles.sectionTitle}>
          <span>Recent Orders</span>
          <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--charcoal-60)' }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--charcoal-60)' }}>
            No orders yet
          </div>
        ) : (
          <table style={dashboardStyles.table} className="admin-table">
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
                <tr key={order._id || order.orderId}>
                  <td style={dashboardStyles.td}>{order.orderId}</td>
                  <td style={dashboardStyles.td}>{order.customer?.fullName || 'N/A'}</td>
                  <td style={dashboardStyles.td}>Rs. {(order.total || order.amount || 0).toLocaleString()}</td>
                  <td style={dashboardStyles.td}>
                    <span style={{ ...dashboardStyles.badge, ...getStatusStyle(order.status) }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td style={dashboardStyles.td}>
                    {new Date(order.createdAt || order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Status Overview */}
      <div style={dashboardStyles.section} className="admin-section-card">
        <div style={dashboardStyles.sectionTitle}>Order Status Overview</div>

        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--charcoal-60)' }}>
            Loading analytics...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {/* All Orders - First */}
            <div
              key="all"
              style={{
                padding: '20px',
                background: 'linear-gradient(135deg, var(--green-700) 0%, var(--green-900) 100%)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid var(--green-900)',
                boxShadow: '0 4px 12px rgba(106, 168, 79, 0.2)',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {analytics.ordersByStatus.all}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
                All Orders
              </div>
            </div>

            {/* Other statuses */}
            {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
              <div
                key={status}
                style={{
                  padding: '16px',
                  background: 'var(--sage-100)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid var(--green-200)',
                }}
              >
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green-700)', marginBottom: '8px' }}>
                  {analytics.ordersByStatus[status]}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--charcoal-60)', textTransform: 'capitalize' }}>
                  {status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
