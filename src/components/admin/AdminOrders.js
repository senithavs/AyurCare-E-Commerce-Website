'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const ordersStyles = {
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    borderTop: '1px solid var(--line)',
    borderRight: '1px solid var(--line)',
    borderBottom: '1px solid var(--line)',
    borderLeft: '1px solid var(--line)',
    background: 'var(--cream)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  filterBtnActive: {
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
    borderTop: '1px solid var(--green-700)',
    borderRight: '1px solid var(--green-700)',
    borderBottom: '1px solid var(--green-700)',
    borderLeft: '1px solid var(--green-700)',
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
  },
  td: {
    padding: '12px 8px',
    fontSize: '13px',
    color: 'var(--charcoal)',
    borderBottom: '1px solid var(--line)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = (selectedStatus === 'all' 
    ? orders 
    : orders.filter((o) => o.status === selectedStatus))
    .filter((order) =>
      order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { background: '#FBE9CF', color: '#8A5A0E' };
      case 'processing':
        return { background: '#DCE7F5', color: '#2F5A9E' };
      case 'shipped':
        return { background: '#E3DCF5', color: '#5A3E9E' };
      case 'delivered':
        return { background: 'var(--sage-100)', color: 'var(--green-700)' };
      default:
        return {};
    }
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered'];

  return (
    <div className="admin-page-enter">
      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '50%',
            padding: '12px 14px',
            border: '1px solid var(--line)',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
            e.target.style.borderColor = 'var(--green-700)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = 'var(--line)';
          }}
        />
      </div>

      {/* Filter Bar */}
      <div style={ordersStyles.filterBar} className="admin-filter-bar">
        <button
          style={{
            ...ordersStyles.filterBtn,
            ...(selectedStatus === 'all' ? ordersStyles.filterBtnActive : {}),
          }}
          className="admin-filter-btn"
          onClick={() => setSelectedStatus('all')}
        >
          All Orders ({orders.length})
        </button>
        {statuses.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              style={{
                ...ordersStyles.filterBtn,
                ...(selectedStatus === status ? ordersStyles.filterBtnActive : {}),
              }}
              className="admin-filter-btn"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div style={{ background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }} className="admin-section-card">
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              {searchQuery ? `No orders found matching "${searchQuery}"` : 'No orders found for the selected status.'}
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--green-700)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline',
                  marginTop: '8px',
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <table style={ordersStyles.table} className="admin-table">
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th style={ordersStyles.th}>Order ID</th>
                <th style={ordersStyles.th}>Customer</th>
                <th style={ordersStyles.th}>Email</th>
                <th style={ordersStyles.th}>Total</th>
                <th style={ordersStyles.th}>Items</th>
                <th style={ordersStyles.th}>Status</th>
                <th style={ordersStyles.th}>Date</th>
                <th style={ordersStyles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={ordersStyles.td}>
                    <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{order.id}</span>
                  </td>
                  <td style={ordersStyles.td}>{order.customerName}</td>
                  <td style={ordersStyles.td}>{order.email}</td>
                  <td style={ordersStyles.td}>Rs. {order.total.toLocaleString()}</td>
                  <td style={ordersStyles.td}>{order.quantity}</td>
                  <td style={ordersStyles.td}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        ...ordersStyles.statusBadge,
                        ...getStatusColor(order.status),
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={ordersStyles.td}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={ordersStyles.td}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert(`Order details:\n${JSON.stringify(order.items, null, 2)}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
