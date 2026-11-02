'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Button, FormField } from '@/components/ui';
import Link from 'next/link';
import '@/styles/admin-animations.css';

const loginStyles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url(https://xrejvwbivhtfnblavofv.supabase.co/storage/v1/object/public/Images/Signin-Signup%20Image/reg.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  containerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(3px)',
    zIndex: 1,
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    animation: 'scaleUp 0.5s ease-out',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--charcoal-60)',
  },
  formGroup: {
    marginBottom: '24px',
    animation: 'slideUp 0.6s ease-out backwards',
  },
  submitBtn: {
    marginTop: '24px',
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
          minHeight: '100vh',
          backgroundImage: 'url(/reg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 1,
          }}
        ></div>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#fff', fontSize: '14px' }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={loginStyles.container} className="auth-background-loading">
      <div style={loginStyles.containerOverlay} className="auth-background-overlay"></div>
      <div style={loginStyles.card}>
        <div style={loginStyles.logo}>
          <Image src="/logo.png" alt="AyurCare" width={60} height={60} priority />
        </div>
        <div style={loginStyles.header}>
          <h1 style={loginStyles.title}>AyurCare Admin</h1>
          <p style={loginStyles.subtitle}>Sign in to your account</p>
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
