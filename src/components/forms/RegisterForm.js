'use client';

import { useState } from 'react';
import { FormField, Button } from '@/components/ui';

const formWrapperStyles = {
  wrapper: {
    maxWidth: '440px',
    margin: '0 auto',
    padding: '52px 44px',
  },
  title: {
    textAlign: 'center',
    color: 'var(--green-900)',
    marginTop: 0,
  },
  lead: {
    textAlign: 'center',
    fontSize: '12.5px',
    color: 'var(--charcoal-60)',
    marginTop: '-8px',
    marginBottom: '30px',
  },
  checkboxField: {
    marginBottom: '16px',
  },
};

export default function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div style={formWrapperStyles.wrapper}>
      <h2 style={formWrapperStyles.title}>Create your account</h2>
      <p style={formWrapperStyles.lead}>
        Join AyurCare for faster checkout and order tracking
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Amara Perera"
          error={errors.fullName}
          required
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
          required
        />
        <FormField
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+94 7X XXX XXXX"
          error={errors.phone}
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
        />
        <FormField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.confirmPassword}
          required
        />

        <div style={formWrapperStyles.checkboxField}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: 'var(--charcoal-60)' }}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              style={{ marginTop: '3px' }}
            />
            I agree to the Terms &amp; Conditions
          </label>
          {errors.agreeTerms && (
            <div style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px' }}>
              {errors.agreeTerms}
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" block>
          Create Account
        </Button>
      </form>
    </div>
  );
}
