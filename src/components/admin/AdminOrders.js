'use client';

import { useState, useEffect } from 'react';
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
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: 500,
  },
  alertSuccess: {
    background: 'rgba(106, 168, 79, 0.1)',
    color: 'var(--green-700)',
    border: '1px solid var(--green-700)',
  },
  alertError: {
    background: 'rgba(255, 67, 67, 0.1)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '600px',
    width: '95%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '24px',
    borderBottom: '2px solid var(--line)',
    paddingBottom: '16px',
  },
  orderDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  detailField: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--charcoal-60)',
    textTransform: 'uppercase',
    marginBottom: '8px',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--charcoal)',
  },
  detailValueFull: {
    gridColumn: '1 / -1',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    borderTop: '1px solid var(--line)',
    paddingTop: '24px',
  },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/orders/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update order status');
        return;
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId || order.orderId === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      setSuccess('Order status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  const filteredOrders = (selectedStatus === 'all' 
    ? orders 
    : orders.filter((o) => o.status === selectedStatus))
    .filter((order) =>
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
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

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="admin-page-enter">
      {error && (
        <div style={{ ...ordersStyles.alert, ...ordersStyles.alertError }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', float: 'right' }}>×</button>
        </div>
      )}

      {success && (
        <div style={{ ...ordersStyles.alert, ...ordersStyles.alertSuccess }}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', float: 'right' }}>×</button>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name..."
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
          All Orders ({orderCounts.all})
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            style={{
              ...ordersStyles.filterBtn,
              ...(selectedStatus === status ? ordersStyles.filterBtnActive : {}),
            }}
            className="admin-filter-btn"
            onClick={() => setSelectedStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({orderCounts[status]})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{ background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }} className="admin-section-card">
        {isLoading ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
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
                <th style={ordersStyles.th}>Total</th>
                <th style={ordersStyles.th}>Items</th>
                <th style={ordersStyles.th}>Status</th>
                <th style={ordersStyles.th}>Date</th>
                <th style={ordersStyles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id || order.orderId}>
                  <td style={ordersStyles.td}>
                    <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{order.orderId}</span>
                  </td>
                  <td style={ordersStyles.td}>{order.customerName}</td>
                  <td style={ordersStyles.td}>Rs. {order.amount.toLocaleString()}</td>
                  <td style={ordersStyles.td}>{order.items}</td>
                  <td style={ordersStyles.td}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id || order.orderId, e.target.value)}
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
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td style={ordersStyles.td}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={ordersStyles.modal} onClick={() => setSelectedOrder(null)}>
          <div style={ordersStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={ordersStyles.modalTitle}>
              Order Details - {selectedOrder.orderId}
            </div>

            <div style={ordersStyles.orderDetails}>
              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Customer Name</div>
                <div style={ordersStyles.detailValue}>{selectedOrder.customerName}</div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Order Amount</div>
                <div style={ordersStyles.detailValue}>Rs. {selectedOrder.amount.toLocaleString()}</div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Number of Items</div>
                <div style={ordersStyles.detailValue}>{selectedOrder.items}</div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Order Status</div>
                <div style={{
                  ...ordersStyles.detailValue,
                  ...getStatusColor(selectedOrder.status),
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  width: 'fit-content',
                  fontWeight: 600,
                }}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Order Date</div>
                <div style={ordersStyles.detailValue}>{new Date(selectedOrder.date).toLocaleDateString()}</div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Payment Status</div>
                <div style={{
                  ...ordersStyles.detailValue,
                  color: selectedOrder.paymentStatus === 'completed' ? 'var(--green-700)' : selectedOrder.paymentStatus === 'pending' ? '#8A5A0E' : 'var(--danger)',
                }}>
                  {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                </div>
              </div>

              <div style={{ ...ordersStyles.detailField, ...ordersStyles.detailValueFull }}>
                <div style={ordersStyles.detailLabel}>Shipping Address</div>
                <div style={ordersStyles.detailValue}>{selectedOrder.shippingAddress}</div>
              </div>

              <div style={{ ...ordersStyles.detailField, ...ordersStyles.detailValueFull }}>
                <div style={ordersStyles.detailLabel}>Tracking Number</div>
                <div style={ordersStyles.detailValue}>{selectedOrder.tracking || 'Not assigned yet'}</div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>Expected Delivery</div>
                <div style={ordersStyles.detailValue}>
                  {selectedOrder.expectedDelivery 
                    ? new Date(selectedOrder.expectedDelivery).toLocaleDateString()
                    : 'TBD'
                  }
                </div>
              </div>

              <div style={ordersStyles.detailField}>
                <div style={ordersStyles.detailLabel}>User ID</div>
                <div style={ordersStyles.detailValue}>{selectedOrder.userId}</div>
              </div>
            </div>

            <div style={ordersStyles.modalActions}>
              <Button 
                variant="primary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Copy order ID to clipboard
                  navigator.clipboard.writeText(selectedOrder.orderId);
                  setSuccess('Order ID copied to clipboard');
                  setTimeout(() => setSuccess(''), 2000);
                }}
              >
                Copy Order ID
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
