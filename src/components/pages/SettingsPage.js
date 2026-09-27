'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const settingsStyles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    padding: '40px 20px',
  },
  header: {
    maxWidth: '800px',
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
    maxWidth: '800px',
    margin: '0 auto 24px',
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    animation: 'slideUp 0.6s ease-out',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '20px',
    marginTop: 0,
    paddingBottom: '12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--charcoal)',
    marginBottom: '4px',
  },
  settingDescription: {
    fontSize: '13px',
    color: 'var(--charcoal-60)',
  },
  toggle: {
    width: '48px',
    height: '28px',
    borderRadius: '14px',
    background: '#ccc',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease',
    border: 'none',
    padding: 0,
  },
  toggleActive: {
    background: 'var(--green-700)',
  },
  toggleButton: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'all 0.3s ease',
  },
  toggleButtonActive: {
    left: '22px',
  },
  formGroup: {
    marginBottom: '20px',
    marginTop: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '8px',
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
  dangerZone: {
    marginTop: '32px',
    padding: '20px',
    background: 'rgba(220, 38, 38, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: '8px',
  },
  dangerTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#991b1b',
    marginBottom: '12px',
    marginTop: 0,
  },
  dangerText: {
    fontSize: '13px',
    color: '#7f1d1d',
    marginBottom: '16px',
  },
  successMessage: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid #22c55e',
    color: '#166534',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    animation: 'slideDown 0.4s ease-out',
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, changePassword, signOut } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError('');
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    setIsChanging(true);
    try {
      const result = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (result.success) {
        setSuccessMessage('Password changed successfully!');
        setShowSuccess(true);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setPasswordError(result.error || 'Failed to change password');
      }
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      // Clear user data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userSession');
      localStorage.removeItem('rememberMe');
      
      signOut();
      router.push('/');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div style={settingsStyles.container}>
      <div style={settingsStyles.header}>
        <h1 style={settingsStyles.title}>Settings</h1>
        <p style={settingsStyles.subtitle}>Manage your account preferences and security</p>
      </div>

      {showSuccess && (
        <div style={settingsStyles.card}>
          <div style={settingsStyles.successMessage}>
            ✓ {successMessage}
          </div>
        </div>
      )}

      {/* Account Preferences */}
      <div style={settingsStyles.card}>
        <h2 style={settingsStyles.sectionTitle}>🔔 Notifications</h2>
        
        <div style={settingsStyles.settingItem}>
          <div style={settingsStyles.settingInfo}>
            <div style={settingsStyles.settingLabel}>Email Notifications</div>
            <div style={settingsStyles.settingDescription}>
              Receive notifications via email
            </div>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            style={{
              ...settingsStyles.toggle,
              ...(emailNotifications ? settingsStyles.toggleActive : {}),
            }}
          >
            <div style={{
              ...settingsStyles.toggleButton,
              ...(emailNotifications ? settingsStyles.toggleButtonActive : {}),
            }}></div>
          </button>
        </div>

        <div style={settingsStyles.settingItem}>
          <div style={settingsStyles.settingInfo}>
            <div style={settingsStyles.settingLabel}>Order Updates</div>
            <div style={settingsStyles.settingDescription}>
              Get notified about order status changes
            </div>
          </div>
          <button
            onClick={() => setOrderUpdates(!orderUpdates)}
            style={{
              ...settingsStyles.toggle,
              ...(orderUpdates ? settingsStyles.toggleActive : {}),
            }}
          >
            <div style={{
              ...settingsStyles.toggleButton,
              ...(orderUpdates ? settingsStyles.toggleButtonActive : {}),
            }}></div>
          </button>
        </div>

        <div style={{ ...settingsStyles.settingItem, ...settingsStyles.settingItemLast }}>
          <div style={settingsStyles.settingInfo}>
            <div style={settingsStyles.settingLabel}>Promotions & Offers</div>
            <div style={settingsStyles.settingDescription}>
              Receive information about special offers
            </div>
          </div>
          <button
            onClick={() => setPromotions(!promotions)}
            style={{
              ...settingsStyles.toggle,
              ...(promotions ? settingsStyles.toggleActive : {}),
            }}
          >
            <div style={{
              ...settingsStyles.toggleButton,
              ...(promotions ? settingsStyles.toggleButtonActive : {}),
            }}></div>
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div style={settingsStyles.card}>
        <h2 style={settingsStyles.sectionTitle}>🔒 Security</h2>
        
        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter your current password"
            style={settingsStyles.input}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
              e.target.style.borderColor = 'var(--green-700)';
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = 'var(--line)';
              }
            }}
          />
        </div>

        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter your new password"
            style={settingsStyles.input}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
              e.target.style.borderColor = 'var(--green-700)';
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = 'var(--line)';
              }
            }}
          />
        </div>

        <div style={settingsStyles.formGroup}>
          <label style={settingsStyles.label}>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm your new password"
            style={settingsStyles.input}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
              e.target.style.borderColor = 'var(--green-700)';
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = 'var(--line)';
              }
            }}
          />
        </div>

        {passwordError && (
          <div style={{
            color: '#dc2626',
            fontSize: '13px',
            padding: '10px 12px',
            background: 'rgba(220, 38, 38, 0.1)',
            borderRadius: '6px',
            marginBottom: '16px',
          }}>
            ⚠ {passwordError}
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleChangePassword}
          disabled={isChanging}
        >
          {isChanging ? 'Updating...' : 'Change Password'}
        </Button>
      </div>

      {/* Danger Zone */}
      <div style={settingsStyles.card}>
        <div style={settingsStyles.dangerZone}>
          <h3 style={settingsStyles.dangerTitle}>⚠️ Danger Zone</h3>
          <p style={settingsStyles.dangerText}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            style={{ color: '#dc2626', borderColor: '#dc2626' }}
          >
            Delete My Account
          </Button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto 0' }}>
        <Link href="/" style={{ color: 'var(--green-700)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
