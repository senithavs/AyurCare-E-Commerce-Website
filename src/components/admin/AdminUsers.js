'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const usersStyles = {
  container: {
    padding: '32px',
    animation: 'slideUp 0.6s ease-out',
  },
  header: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
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
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    maxWidth: '400px',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--line)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    animation: 'slideUp 0.6s ease-out 0.1s backwards',
  },
  tableHeader: {
    background: 'var(--cream)',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--green-700)',
  },
  headerCell: {
    padding: '16px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--green-900)',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
    transition: 'all 0.2s ease',
  },
  tableRowHover: {
    background: 'var(--cream)',
  },
  tableCell: {
    padding: '16px 12px',
    fontSize: '14px',
    color: 'var(--charcoal)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--green-700)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--charcoal)',
  },
  userEmail: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  viewButton: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#1e40af',
  },
  deleteButton: {
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#991b1b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--charcoal-60)',
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
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    animation: 'slideUp 0.6s ease-out backwards',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-700)',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--charcoal-60)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'scaleUp 0.3s ease-out',
  },
  modalHeader: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--line)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f5f5f5',
    cursor: 'not-allowed',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    paddingTop: '24px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'var(--line)',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '13px',
    fontWeight: 500,
  },
  alertSuccess: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#166534',
    border: '1px solid #16a34a',
  },
  alertError: {
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#991b1b',
    border: '1px solid #dc2626',
  },
};

export default function AdminUsers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/users');
      const data = await response.json();

      if (data.success && Array.isArray(data.users)) {
        setCustomers(data.users);
      } else {
        setError(data.error || 'Failed to load customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers from database');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteClick = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/users?id=${customerId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          setCustomers((prev) => prev.filter((c) => c._id !== customerId));
          setSuccess('Customer deleted successfully');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.error || 'Failed to delete customer');
        }
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer');
      }
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.isActive !== false).length;
  const newlyRegistered = customers.filter((c) => {
    const registrationDate = new Date(c.createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return registrationDate > sevenDaysAgo;
  }).length;

  return (
    <div style={usersStyles.container}>
      {/* Error Alert */}
      {error && (
        <div style={{ ...usersStyles.alert, ...usersStyles.alertError }}>
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              float: 'right',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div style={{ ...usersStyles.alert, ...usersStyles.alertSuccess }}>
          <span>{success}</span>
          <button
            onClick={() => setSuccess('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              float: 'right',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div style={usersStyles.header}>
        <h1 style={usersStyles.title}>👥 Customer Management</h1>
        <p style={usersStyles.subtitle}>View and manage customer accounts</p>
      </div>

      {/* Stats */}
      <div style={usersStyles.stats}>
        <div style={{ ...usersStyles.statCard, animationDelay: '0s' }}>
          <div style={usersStyles.statValue}>{totalCustomers}</div>
          <div style={usersStyles.statLabel}>Total Customers</div>
        </div>
        <div style={{ ...usersStyles.statCard, animationDelay: '0.05s' }}>
          <div style={usersStyles.statValue}>{activeCustomers}</div>
          <div style={usersStyles.statLabel}>Active</div>
        </div>
        <div style={{ ...usersStyles.statCard, animationDelay: '0.1s' }}>
          <div style={usersStyles.statValue}>{newlyRegistered}</div>
          <div style={usersStyles.statLabel}>Newly Registered</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={usersStyles.controls}>
        <div style={usersStyles.searchBox}>
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={usersStyles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--green-700)';
              e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--line)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div style={usersStyles.emptyState}>
          <div style={{ fontSize: '16px', color: 'var(--charcoal-60)' }}>Loading customers...</div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div style={usersStyles.emptyState}>
          <div style={usersStyles.emptyIcon}>👤</div>
          <div style={usersStyles.emptyTitle}>No customers found</div>
          <p>
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'No customers registered yet'}
          </p>
        </div>
      ) : (
        <table style={usersStyles.table}>
          <thead style={usersStyles.tableHeader}>
            <tr>
              <th style={usersStyles.headerCell}>Customer</th>
              <th style={usersStyles.headerCell}>Email</th>
              <th style={usersStyles.headerCell}>Phone</th>
              <th style={usersStyles.headerCell}>Joined</th>
              <th style={usersStyles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr
                key={customer._id}
                style={{ ...usersStyles.tableRow, animationDelay: `${index * 0.05}s` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = usersStyles.tableRowHover.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={usersStyles.tableCell}>
                  <div style={usersStyles.userInfo}>
                    <div style={usersStyles.avatar}>
                      {customer.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div style={usersStyles.userDetails}>
                      <div style={usersStyles.userName}>{customer.name}</div>
                      <div style={usersStyles.userEmail}>@{customer.username}</div>
                    </div>
                  </div>
                </td>
                <td style={usersStyles.tableCell}>{customer.email}</td>
                <td style={usersStyles.tableCell}>{customer.phone || '-'}</td>
                <td style={usersStyles.tableCell}>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td style={usersStyles.tableCell}>
                  <div style={usersStyles.actions}>
                    <button
                      style={{ ...usersStyles.actionButton, ...usersStyles.viewButton }}
                      onClick={() => handleViewClick(customer)}
                    >
                      View
                    </button>
                    <button
                      style={{ ...usersStyles.actionButton, ...usersStyles.deleteButton }}
                      onClick={() => handleDeleteClick(customer._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Details Modal - Read Only */}
      {showModal && selectedCustomer && (
        <div style={usersStyles.modal} onClick={() => setShowModal(false)}>
          <div
            style={usersStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={usersStyles.modalHeader}>Customer Details</div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Full Name</label>
              <input
                type="text"
                value={selectedCustomer.name || ''}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Email</label>
              <input
                type="email"
                value={selectedCustomer.email || ''}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Username</label>
              <input
                type="text"
                value={selectedCustomer.username || ''}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Phone</label>
              <input
                type="tel"
                value={selectedCustomer.phone || '-'}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Address</label>
              <input
                type="text"
                value={selectedCustomer.address || '-'}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Member Since</label>
              <input
                type="text"
                value={new Date(selectedCustomer.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Status</label>
              <input
                type="text"
                value={selectedCustomer.isActive !== false ? 'Active' : 'Inactive'}
                disabled
                style={usersStyles.input}
              />
            </div>

            <div style={usersStyles.modalActions}>
              <Button
                variant="primary"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
