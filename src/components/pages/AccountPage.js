'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout';
import { Button, FormField, Avatar } from '@/components/ui';
import { DataTable } from '@/components/utility';

const accountStyles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    gap: 0,
  },
  main: {
    padding: '36px 40px',
  },
  profileHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '30px',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    margin: 0,
    fontSize: '18px',
    color: 'var(--green-900)',
  },
  profileEmail: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
    margin: '4px 0 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
};

const sidebarItems = [
  { id: 'profile', icon: '👤', label: 'Profile' },
  { id: 'orders', icon: '📦', label: 'My Orders' },
  { id: 'addresses', icon: '📍', label: 'Addresses' },
  { id: 'wishlist', icon: '♡', label: 'Wishlist' },
  { id: 'settings', icon: '⚙', label: 'Settings' },
  { id: 'logout', icon: '↪', label: 'Logout' },
];

const mockOrders = [
  {
    orderId: '#AC-1042',
    date: '18 Aug 2026',
    items: 3,
    total: 'Rs. 3,760',
    payment: 'Paid',
    status: 'Processing',
  },
  {
    orderId: '#AC-1039',
    date: '10 Aug 2026',
    items: 1,
    total: 'Rs. 1,450',
    payment: 'Paid',
    status: 'Shipped',
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: 'Amara Perera',
    email: 'amara.p@email.com',
    phone: '+94 77 123 4567',
    dateOfBirth: '12 / 04 / 1994',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    { key: 'orderId', label: 'Order ID' },
    { key: 'date', label: 'Date' },
    { key: 'items', label: 'Items' },
    { key: 'total', label: 'Total' },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div style={accountStyles.shell}>
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={activeTab}
        onItemClick={setActiveTab}
      />

      {/* Main Content */}
      <div style={accountStyles.main}>
        {activeTab === 'profile' && (
          <>
            <div style={accountStyles.profileHead}>
              <Avatar size="lg" initials="AP" />
              <div style={accountStyles.profileInfo}>
                <h3 style={accountStyles.profileName}>Amara Perera</h3>
                <p style={accountStyles.profileEmail}>amara.p@email.com</p>
              </div>
            </div>

            <form>
              <div style={accountStyles.formGrid}>
                <FormField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  name="fullName"
                />
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
                <FormField
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                />
                <FormField
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  name="dateOfBirth"
                />
              </div>
              <Button variant="primary" style={{ marginTop: '14px' }}>
                Save Changes
              </Button>
            </form>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h2 style={{ fontSize: '18px', margin: '0 0 20px', color: 'var(--green-900)' }}>
              My Orders
            </h2>
            <DataTable columns={columns} data={mockOrders} />
          </>
        )}

        {activeTab === 'addresses' && (
          <h2 style={{ fontSize: '18px', color: 'var(--green-900)' }}>
            Address Management Coming Soon
          </h2>
        )}

        {activeTab === 'wishlist' && (
          <h2 style={{ fontSize: '18px', color: 'var(--green-900)' }}>
            Wishlist Coming Soon
          </h2>
        )}

        {activeTab === 'settings' && (
          <h2 style={{ fontSize: '18px', color: 'var(--green-900)' }}>
            Settings Coming Soon
          </h2>
        )}
      </div>
    </div>
  );
}
