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
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--charcoal-60)',
    fontSize: '16px',
    pointerEvents: 'none',
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
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    width: 'fit-content',
  },
  statusActive: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#166534',
  },
  statusInactive: {
    background: 'rgba(156, 163, 175, 0.1)',
    color: '#4b5563',
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
  editButton: {
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
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load users from localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({ ...user });
    setShowEditModal(true);
  };

  const handleDeleteClick = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUsers = users.map(u =>
        u.id === editingUser.id ? { ...u, ...editFormData } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setShowEditModal(false);
      setEditingUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const activeUsersCount = users.filter(u => u.id).length;
  const totalUsersCount = users.length;
  const newUsersCount = users.filter(u => {
    const createdDate = new Date(u.createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return createdDate > sevenDaysAgo;
  }).length;

  return (
    <div style={usersStyles.container}>
      {/* Header */}
      <div style={usersStyles.header}>
        <h1 style={usersStyles.title}>👥 User Management</h1>
        <p style={usersStyles.subtitle}>Manage system users and their accounts</p>
      </div>

      {/* Stats */}
      <div style={usersStyles.stats}>
        <div style={{ ...usersStyles.statCard, animationDelay: '0s' }}>
          <div style={usersStyles.statValue}>{totalUsersCount}</div>
          <div style={usersStyles.statLabel}>Total Users</div>
        </div>
        <div style={{ ...usersStyles.statCard, animationDelay: '0.05s' }}>
          <div style={usersStyles.statValue}>{activeUsersCount}</div>
          <div style={usersStyles.statLabel}>Active Users</div>
        </div>
        <div style={{ ...usersStyles.statCard, animationDelay: '0.1s' }}>
          <div style={usersStyles.statValue}>{newUsersCount}</div>
          <div style={usersStyles.statLabel}>New (7 days)</div>
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

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div style={usersStyles.emptyState}>
          <div style={usersStyles.emptyIcon}>👤</div>
          <div style={usersStyles.emptyTitle}>No users found</div>
          <p>
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'No users in the system yet'}
          </p>
        </div>
      ) : (
        <table style={usersStyles.table}>
          <thead style={usersStyles.tableHeader}>
            <tr>
              <th style={usersStyles.headerCell}>User</th>
              <th style={usersStyles.headerCell}>Email</th>
              <th style={usersStyles.headerCell}>Username</th>
              <th style={usersStyles.headerCell}>Joined</th>
              <th style={usersStyles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
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
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={usersStyles.userDetails}>
                      <div style={usersStyles.userName}>{user.name}</div>
                      <div style={usersStyles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={usersStyles.tableCell}>{user.email}</td>
                <td style={usersStyles.tableCell}>{user.username}</td>
                <td style={usersStyles.tableCell}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={usersStyles.tableCell}>
                  <div style={usersStyles.actions}>
                    <button
                      style={{ ...usersStyles.actionButton, ...usersStyles.editButton }}
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...usersStyles.actionButton, ...usersStyles.deleteButton }}
                      onClick={() => handleDeleteClick(user.id)}
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

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div style={usersStyles.modal} onClick={() => setShowEditModal(false)}>
          <div
            style={usersStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={usersStyles.modalHeader}>Edit User</div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Full Name (Read-only)</label>
              <input
                type="text"
                value={editFormData.name || ''}
                disabled
                style={{ ...usersStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Username (Read-only)</label>
              <input
                type="text"
                value={editFormData.username || ''}
                disabled
                style={{ ...usersStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Email (Read-only)</label>
              <input
                type="email"
                value={editFormData.email || ''}
                disabled
                style={{ ...usersStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Phone (Read-only)</label>
              <input
                type="tel"
                value={editFormData.phone || ''}
                disabled
                style={{ ...usersStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={usersStyles.formGroup}>
              <label style={usersStyles.label}>Address (Read-only)</label>
              <input
                type="text"
                value={editFormData.address || ''}
                disabled
                style={{ ...usersStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={usersStyles.modalActions}>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
