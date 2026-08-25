'use client';

import { useState } from 'react';
import { FormField, Button } from '@/components/ui';
import Link from 'next/link';

const formWrapperStyles = {
  wrapper: {
    maxWidth: '440px',
    margin: '0 auto',
    padding: '52px 44px',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '18px',
    fontSize: '19px',
    fontWeight: 700,
    color: 'var(--green-900)',
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
  fieldRowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11.5px',
    color: 'var(--charcoal-60)',
    margin: '6px 0 20px',
  },
  dividerOr: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '11px',
    color: 'var(--charcoal-60)',
    margin: '20px 0',
  },
  line: {
    flex: 1,
    height: '1px',
    background: 'var(--line)',
  },
  footer: {
    textAlign: 'center',
    fontSize: '12.5px',
  },
  link: {
    color: 'var(--green-700)',
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div style={formWrapperStyles.wrapper}>
      <div style={formWrapperStyles.logo}>
        <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '13px' }}>A</span>
        AyurCare
      </div>
      <h2 style={formWrapperStyles.title}>Welcome back</h2>
      <p style={formWrapperStyles.lead}>Log in to continue your wellness journey</p>

      <form onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div style={formWrapperStyles.fieldRowBetween}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
            Remember me
          </label>
          <Link href="/forgot-password" style={formWrapperStyles.link}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" block>
          Log In
        </Button>
      </form>

      <div style={formWrapperStyles.dividerOr}>
        <div style={formWrapperStyles.line} />
        <span>or</span>
        <div style={formWrapperStyles.line} />
      </div>

      <p style={formWrapperStyles.footer}>
        Don't have an account?{' '}
        <Link href="/register" style={formWrapperStyles.link}>
          Register
        </Link>
      </p>
    </div>
  );
}
