'use client';

import { useState, useEffect } from 'react';
import '@/styles/admin-animations.css';

const analyticsStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: '12px',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '16px',
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--line)',
  },
  metricLabel: {
    fontSize: '13px',
    color: 'var(--charcoal-60)',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--green-900)',
  },
  chartBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
  },
  barLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--charcoal)',
    minWidth: '80px',
  },
  barContainer: {
    flex: 1,
    height: '24px',
    background: 'var(--sage-100)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    background: 'var(--green-700)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
  },
  barValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--green-900)',
    minWidth: '60px',
    textAlign: 'right',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--charcoal-60)',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: 500,
    background: 'rgba(255, 67, 67, 0.1)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
};

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch orders and products from database
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      if (ordersData.success && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      }

      if (productsData.success && Array.isArray(productsData.products)) {
        setProducts(productsData.products);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics from database
  const calculateMetrics = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock_quantity < 10).length;

    // Order status breakdown
    const ordersByStatus = {
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    };

    // Top products by rating
    const topProducts = products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    // Products by category
    const categoryCount = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    // Monthly sales data (last 6 months)
    const monthlyData = generateMonthlySalesData(orders);

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalProducts,
      lowStockProducts,
      ordersByStatus,
      topProducts,
      categoryCount,
      monthlyData,
    };
  };

  const generateMonthlySalesData = (ordersList) => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      
      const monthSales = ordersList
        .filter((order) => {
          const orderDate = new Date(order.date || order.createdAt);
          return (
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, order) => sum + (order.amount || 0), 0);

      months.push({ month: monthName, sales: monthSales });
    }

    return months;
  };

  if (isLoading) {
    return <div style={analyticsStyles.loadingText}>Loading analytics...</div>;
  }

  if (error) {
    return <div style={analyticsStyles.alert}>{error}</div>;
  }

  const metrics = calculateMetrics();
  const maxSales = Math.max(...metrics.monthlyData.map((d) => d.sales), 1);

  return (
    <div className="admin-page-enter">
      {/* Key Metrics */}
      <div style={analyticsStyles.grid}>
        {/* Revenue Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>💰 Revenue Analytics</div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Revenue</span>
            <span style={analyticsStyles.metricValue}>Rs. {(metrics.totalRevenue / 100000).toFixed(2)}L</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Average Order Value</span>
            <span style={analyticsStyles.metricValue}>Rs. {Math.round(metrics.avgOrderValue).toLocaleString()}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Orders</span>
            <span style={analyticsStyles.metricValue}>{metrics.totalOrders}</span>
          </div>
        </div>

        {/* Orders Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>📋 Order Analytics</div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Pending Orders</span>
            <span style={analyticsStyles.metricValue}>{metrics.ordersByStatus.pending}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Processing Orders</span>
            <span style={analyticsStyles.metricValue}>{metrics.ordersByStatus.processing}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Delivered Orders</span>
            <span style={{ ...analyticsStyles.metricValue, color: 'var(--green-700)' }}>
              {metrics.ordersByStatus.delivered}
            </span>
          </div>
        </div>

        {/* Inventory Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>📦 Inventory Status</div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Products</span>
            <span style={analyticsStyles.metricValue}>{metrics.totalProducts}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Low Stock Items</span>
            <span style={{ ...analyticsStyles.metricValue, color: '#8A5A0E' }}>
              {metrics.lowStockProducts}
            </span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>In Stock</span>
            <span style={{ ...analyticsStyles.metricValue, color: 'var(--green-700)' }}>
              {metrics.totalProducts - metrics.lowStockProducts}
            </span>
          </div>
        </div>

        {/* Top Products Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>⭐ Top Products by Rating</div>
          {metrics.topProducts.length > 0 ? (
            metrics.topProducts.map((product, idx) => (
              <div key={idx} style={analyticsStyles.metric}>
                <span style={analyticsStyles.metricLabel}>{product.name}</span>
                <span style={analyticsStyles.metricValue}>{(product.rating || 0).toFixed(1)} ⭐</span>
              </div>
            ))
          ) : (
            <div style={{ ...analyticsStyles.metricLabel, padding: '12px 0' }}>No products available</div>
          )}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div style={analyticsStyles.card} className="admin-section-card">
        <div style={analyticsStyles.cardTitle}>📊 Order Status Distribution</div>
        {metrics.totalOrders > 0 ? (
          Object.entries(metrics.ordersByStatus).map(([status, count]) => {
            const percentage = (count / metrics.totalOrders) * 100 || 0;
            return (
              <div key={status} style={analyticsStyles.chartBar} className="admin-chart-bar">
                <span style={analyticsStyles.barLabel}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <div style={analyticsStyles.barContainer}>
                  <div
                    style={{
                      ...analyticsStyles.bar,
                      width: `${percentage}%`,
                      background:
                        status === 'delivered'
                          ? 'var(--green-700)'
                          : status === 'shipped'
                          ? '#5A3E9E'
                          : status === 'processing'
                          ? '#2F5A9E'
                          : '#8A5A0E',
                    }}
                  >
                    {percentage > 10 && `${Math.round(percentage)}%`}
                  </div>
                </div>
                <span style={analyticsStyles.barValue}>{count} orders</span>
              </div>
            );
          })
        ) : (
          <div style={{ ...analyticsStyles.metricLabel, padding: '12px 0' }}>No orders yet</div>
        )}
      </div>

      {/* Monthly Sales Chart */}
      <div style={analyticsStyles.card} className="admin-section-card">
        <div style={analyticsStyles.cardTitle}>📈 Monthly Sales Trend</div>
        {metrics.monthlyData.map((data) => {
          const percentage = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
          return (
            <div key={data.month} style={analyticsStyles.chartBar} className="admin-chart-bar">
              <span style={analyticsStyles.barLabel}>{data.month}</span>
              <div style={analyticsStyles.barContainer}>
                <div
                  style={{
                    ...analyticsStyles.bar,
                    width: `${percentage}%`,
                  }}
                >
                  {percentage > 10 && `${Math.round(percentage)}%`}
                </div>
              </div>
              <span style={analyticsStyles.barValue}>Rs. {(data.sales / 100000).toFixed(1)}L</span>
            </div>
          );
        })}
      </div>

      {/* Product Categories */}
      <div style={analyticsStyles.card} className="admin-section-card">
        <div style={analyticsStyles.cardTitle}>🏷️ Products by Category</div>
        {Object.keys(metrics.categoryCount).length > 0 ? (
          Object.entries(metrics.categoryCount).map(([category, count]) => (
            <div key={category} style={analyticsStyles.metric}>
              <span style={analyticsStyles.metricLabel}>{category}</span>
              <span style={analyticsStyles.metricValue}>{count} products</span>
            </div>
          ))
        ) : (
          <div style={{ ...analyticsStyles.metricLabel, padding: '12px 0' }}>No products in any category</div>
        )}
      </div>
    </div>
  );
}
