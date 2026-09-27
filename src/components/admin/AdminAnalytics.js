'use client';

import { useAdmin } from '@/lib/AdminContext';
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
};

export default function AdminAnalytics() {
  const { orders, products, calculateAnalytics } = useAdmin();
  const analytics = calculateAnalytics();

  // Calculate additional metrics
  const avgOrderValue = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;
  const topCategory = products
    .reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

  const monthlySalesData = [
    { month: 'Jan', sales: 125000 },
    { month: 'Feb', sales: 185000 },
    { month: 'Mar', sales: 265000 },
    { month: 'Apr', sales: 195000 },
    { month: 'May', sales: 315000 },
    { month: 'Jun', sales: 240000 },
  ];

  const maxSales = Math.max(...monthlySalesData.map((d) => d.sales));

  return (
    <div className="admin-page-enter">
      {/* Key Metrics */}
      <div style={analyticsStyles.grid}>
        {/* Revenue Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>💰 Revenue Analytics</div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Revenue</span>
            <span style={analyticsStyles.metricValue}>Rs. {(analytics.totalRevenue / 100000).toFixed(2)}L</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Average Order Value</span>
            <span style={analyticsStyles.metricValue}>Rs. {Math.round(avgOrderValue).toLocaleString()}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Quantity Sold</span>
            <span style={analyticsStyles.metricValue}>{analytics.totalQuantitySold} units</span>
          </div>
        </div>

        {/* Orders Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>📋 Order Analytics</div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Orders</span>
            <span style={analyticsStyles.metricValue}>{analytics.totalOrders}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Pending Orders</span>
            <span style={analyticsStyles.metricValue}>{analytics.ordersByStatus.pending}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Delivered Orders</span>
            <span style={analyticsStyles.metricValue}>{analytics.ordersByStatus.delivered}</span>
          </div>
        </div>

        {/* Inventory Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>📦 Inventory Status</div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Total Products</span>
            <span style={analyticsStyles.metricValue}>{analytics.totalProducts}</span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>Low Stock Items</span>
            <span style={{ ...analyticsStyles.metricValue, color: '#8A5A0E' }}>
              {analytics.lowStockProducts}
            </span>
          </div>
          <div style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>In Stock</span>
            <span style={{ ...analyticsStyles.metricValue, color: 'var(--green-700)' }}>
              {analytics.totalProducts - analytics.lowStockProducts}
            </span>
          </div>
        </div>

        {/* Top Products Card */}
        <div style={analyticsStyles.card} className="admin-section-card">
          <div style={analyticsStyles.cardTitle}>⭐ Top Products by Rating</div>
          {analytics.topProducts.slice(0, 3).map((product, idx) => (
            <div key={idx} style={analyticsStyles.metric}>
              <span style={analyticsStyles.metricLabel}>{product.name}</span>
              <span style={analyticsStyles.metricValue}>{product.rating.toFixed(1)} ⭐</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div style={analyticsStyles.card} className="admin-section-card">
        <div style={analyticsStyles.cardTitle}>📊 Order Status Distribution</div>
        {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
          const percentage = (count / analytics.totalOrders) * 100 || 0;
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
        })}
      </div>

      {/* Monthly Sales Chart */}
      <div style={analyticsStyles.card} className="admin-section-card">
        <div style={analyticsStyles.cardTitle}>📈 Monthly Sales Trend</div>
        {monthlySalesData.map((data) => {
          const percentage = (data.sales / maxSales) * 100;
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
        {Object.entries(topCategory).map(([category, count]) => (
          <div key={category} style={analyticsStyles.metric}>
            <span style={analyticsStyles.metricLabel}>{category}</span>
            <span style={analyticsStyles.metricValue}>{count} products</span>
          </div>
        ))}
      </div>
    </div>
  );
}
