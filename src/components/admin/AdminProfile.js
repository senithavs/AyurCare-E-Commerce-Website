'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Button, FormField } from '@/components/ui';

const profileStyles = {
  container: {
    position: 'relative',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'var(--sage-100)',
    border: '1px solid var(--line)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--green-700)',
    transition: 'all 0.2s ease',
  },
  avatar: {
    fontSize: '16px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    background: 'var(--cream)',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '280px',
  },
  dropdownHeader: {
    padding: '16px',
    borderBottom: '1px solid var(--line)',
    background: 'var(--sage-100)',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-900)',
    margin: 0,
  },
  userRole: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
    margin: '4px 0 0',
  },
  userAvatar: {
    fontSize: '28px',
  },
  dropdownMenu: {
    padding: '8px',
  },
  menuItem: {
    padding: '10px 12px',
    fontSize: '13px',
    color: 'var(--charcoal)',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  menuItemHover: {
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
  },
  divider: {
    height: '1px',
    background: 'var(--line)',
    margin: '8px 0',
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
    zIndex: 2000,
  },
  modalContent: {
    background: 'var(--cream)',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    border: '1px solid var(--line)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '16px',
    margin: 0,
  },
  formGroup: {
    marginBottom: '16px',
  },
};

export default function AdminProfile() {
  const { admin, logout, updateProfile } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });

  if (!admin) {
    return null;
  }

  const handleUpdateProfile = () => {
    updateProfile({
      name: formData.name,
      email: formData.email,
    });
    setShowUpdateModal(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    // Redirect to home or login page
    window.location.href = '/';
  };

  return (
    <div style={profileStyles.container}>
      {/* Profile Button */}
      <button
        style={profileStyles.button}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--green-100)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--sage-100)';
        }}
      >
        <span style={profileStyles.avatar}>{admin.avatar}</span>
        <span>{admin.name}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={profileStyles.dropdown} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={profileStyles.dropdownHeader}>
            <div style={profileStyles.userInfo}>
              <div style={profileStyles.userAvatar}>{admin.avatar}</div>
              <div style={profileStyles.userDetails}>
                <p style={profileStyles.userName}>{admin.name}</p>
                <p style={profileStyles.userRole}>{admin.role}</p>
                <p style={{ fontSize: '11px', color: 'var(--charcoal-60)', margin: '4px 0 0' }}>
                  {admin.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div style={profileStyles.dropdownMenu}>
            <div
              style={profileStyles.menuItem}
              onClick={() => {
                setShowUpdateModal(true);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, profileStyles.menuItemHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--charcoal)';
              }}
            >
              ✏️ Update Profile
            </div>

            <div style={profileStyles.divider}></div>

            <div
              style={{ ...profileStyles.menuItem, color: 'var(--danger)' }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F5DCDC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              🚪 Logout
            </div>
          </div>
        </div>
      )}

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div style={profileStyles.modal} onClick={() => setShowUpdateModal(false)}>
          <div style={profileStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={profileStyles.modalTitle}>Update Admin Profile</h2>

            <div style={profileStyles.formGroup}>
              <FormField
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div style={profileStyles.formGroup}>
              <FormField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="primary" block onClick={handleUpdateProfile}>
                Save Changes
              </Button>
              <Button variant="outline" block onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
