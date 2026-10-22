'use client';

import { useState } from 'react';
import { FormField, Button } from '@/components/ui';

export default function AddressForm({
  initialData = {},
  onSubmit,
  onCancel,
  isDefault = false,
}) {
  const [formData, setFormData] = useState({
    label: initialData.label || 'Home',
    fullName: initialData.fullName || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    postalCode: initialData.postalCode || '',
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <FormField
          label="Address Label"
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          placeholder="e.g., Home, Office"
          required
        />
        <FormField
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
        <FormField
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+94 7X XXX XXXX"
          required
        />
        <FormField
          label="City"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Colombo"
          required
        />
        <FormField
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address"
          style={{ gridColumn: '1/-1' }}
          required
        />
        <FormField
          label="Postal Code"
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="00300"
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <Button type="submit" variant="primary">
          Save Address
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
