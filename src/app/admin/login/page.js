'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Button, FormField } from '@/components/ui';
import Link from 'next/link';

const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--green-50) 0%, var(--sage-100) 100%)',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  logo: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--green-900)',
    margin: '0 0 8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--charcoal-60)',
    textAlign: 'center',
    marginBottom: '32px',
    margin: '8px 0 32px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  submitBtn: {
    marginTop: '24px',
  },
  demoNote: {
    background: 'var(--sage-100)',
    border: '1px solid var(--green-200)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '12px',
    color: 'var(--green-700)',
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdminLoggedIn } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAdminLoggedIn) {
      router.push('/admin');
    }
  }, [isAdminLoggedIn, router]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation - min 6 characters
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Validate against stored admins
      login(formData.email, formData.password);
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin');
      }, 100);
    } catch (err) {
      setErrors({
        submit: err.message || 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if already logged in (redirecting)
  if (isAdminLoggedIn) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, var(--green-50) 0%, var(--sage-100) 100%)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: 'var(--charcoal-60)', fontSize: '14px' }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <div style={loginStyles.logo}>🌿</div>
        <h1 style={loginStyles.title}>AyurCare Admin</h1>
        <p style={loginStyles.subtitle}>Sign in to your account</p>

        <div style={loginStyles.demoNote}>
          📝 Main Admin Credentials:
          <br />
          Email: admin@ayurcare.com
          <br />
          Password: Se@admin@123
        </div>

        {errors.submit && (
          <div
            style={{
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#DC2626',
              fontSize: '13px',
            }}
          >
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={loginStyles.formGroup}>
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@ayurcare.com"
              required
            />
            {errors.email && (
              <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={loginStyles.formGroup}>
            <FormField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
            />
            {errors.password && (
              <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div style={loginStyles.submitBtn}>
            <Button type="submit" variant="primary" block disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div style={loginStyles.link}>
          <Link href="/" style={{ color: 'var(--green-700)', textDecoration: 'none' }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
