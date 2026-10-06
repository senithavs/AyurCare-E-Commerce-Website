'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import '@/styles/admin-animations.css';

const profileStyles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    padding: '40px 20px',
  },
  header: {
    maxWidth: '800px',
    margin: '0 auto 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-900)',
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--line)',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--green-700)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 700,
  },
  profileInfo: {
    flex: 1,
  },
  infoName: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '4px',
  },
  infoSubtext: {
    fontSize: '14px',
    color: 'var(--charcoal-60)',
    marginBottom: '12px',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '20px',
  },
  infoField: {
    marginBottom: '16px',
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--charcoal-60)',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--charcoal)',
    fontWeight: 500,
  },
  editForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
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
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
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
  stat: {
    textAlign: 'center',
    padding: '16px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--green-700)',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: '',
    address: '',
  });

  // Fetch user profile from database on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const response = await fetch('/api/auth/profile', {
            headers: { 'x-user-id': user.id },
          });

          if (response.ok) {
            const data = await response.json();
            const fetchedUser = data.user;
            
            setFormData({
              name: fetchedUser.name || '',
              email: fetchedUser.email || '',
              username: fetchedUser.username || '',
              phone: fetchedUser.phone || '',
              address: fetchedUser.address || '',
            });
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    if (!isLoading && isAuthenticated && user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, isAuthenticated, isLoading]);

  useEffect(() => {
    // Wait for auth to load before checking
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        setShowSuccess(true);
        setIsEditing(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (profileLoading) {
    return (
      <ProfileSidebar currentPage="profile">
        <div style={profileStyles.container}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--charcoal-60)', fontSize: '16px' }}>
              Loading profile data...
            </p>
          </div>
        </div>
      </ProfileSidebar>
    );
  }

  const pageContent = (
    <div style={profileStyles.container}>
      <div style={profileStyles.header}>
        <h1 style={profileStyles.title}>My Profile</h1>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {showSuccess && (
        <div style={{ ...profileStyles.card, marginBottom: '24px' }}>
          <div style={profileStyles.successMessage}>
            ✓ Profile updated successfully!
          </div>
        </div>
      )}

      {!isEditing ? (
        <>
          {/* Profile Overview */}
          <div style={profileStyles.card}>
            <div style={profileStyles.profileHeader}>
              <div style={profileStyles.avatar}>
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={profileStyles.profileInfo}>
                <div style={profileStyles.infoName}>{formData.name}</div>
                <div style={profileStyles.infoSubtext}>{formData.email}</div>
                <div style={profileStyles.infoSubtext}>
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={profileStyles.infoRow}>
              <div style={profileStyles.infoField}>
                <div style={profileStyles.infoLabel}>Username</div>
                <div style={profileStyles.infoValue}>{formData.username}</div>
              </div>
              <div style={profileStyles.infoField}>
                <div style={profileStyles.infoLabel}>Email</div>
                <div style={profileStyles.infoValue}>{formData.email}</div>
              </div>
            </div>

            <div style={profileStyles.infoRow}>
              <div style={profileStyles.infoField}>
                <div style={profileStyles.infoLabel}>Phone</div>
                <div style={profileStyles.infoValue}>
                  {formData.phone || 'Not added'}
                </div>
              </div>
              <div style={profileStyles.infoField}>
                <div style={profileStyles.infoLabel}>Address</div>
                <div style={profileStyles.infoValue}>
                  {formData.address || 'Not added'}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={profileStyles.card}>
            <h3 style={profileStyles.sectionTitle}>📊 Account Stats</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              <div style={profileStyles.stat}>
                <div style={profileStyles.statValue}>0</div>
                <div style={profileStyles.statLabel}>Total Orders</div>
              </div>
              <div style={profileStyles.stat}>
                <div style={profileStyles.statValue}>0</div>
                <div style={profileStyles.statLabel}>Wishlist Items</div>
              </div>
              <div style={profileStyles.stat}>
                <div style={profileStyles.statValue}>0</div>
                <div style={profileStyles.statLabel}>Total Spent</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Edit Profile Form */
        <div style={profileStyles.card}>
          <h3 style={profileStyles.sectionTitle}>✏️ Edit Your Information</h3>
          
          <div style={profileStyles.editForm}>
            <div style={profileStyles.formGroup}>
              <label style={profileStyles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={profileStyles.input}
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

            <div style={profileStyles.formGroup}>
              <label style={profileStyles.label}>Username (Read-only)</label>
              <input
                type="text"
                value={formData.username}
                disabled
                style={{ ...profileStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={profileStyles.formGroup}>
              <label style={profileStyles.label}>Email (Read-only)</label>
              <input
                type="email"
                value={formData.email}
                disabled
                style={{ ...profileStyles.input, background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={profileStyles.formGroup}>
              <label style={profileStyles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={profileStyles.input}
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

            <div style={{ ...profileStyles.formGroup, ...profileStyles.formGroupFull }}>
              <label style={profileStyles.label}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                style={profileStyles.input}
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

            <div style={{ ...profileStyles.formGroup, ...profileStyles.formGroupFull }}>
              <div style={profileStyles.actions}>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProfileSidebar currentPage="profile">
      {pageContent}
    </ProfileSidebar>
  );
}
