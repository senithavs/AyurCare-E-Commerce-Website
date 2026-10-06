'use client';

import { useState } from 'react';
import Link from 'next/link';
import { validations } from '@/lib/validations';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/AuthContext';
import '@/styles/admin-animations.css';

const signInStyles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url(/reg.jpeg)',
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
  formCard: {
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
  errorMessage: {
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  inputError: {
    borderColor: '#dc2626',
    background: 'rgba(220, 38, 38, 0.02)',
  },
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    marginBottom: '24px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  link: {
    color: 'var(--green-700)',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
    color: 'var(--charcoal-60)',
    fontSize: '13px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--line)',
  },
  socialButton: {
    width: '100%',
    padding: '12px 14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--line)',
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--charcoal)',
    transition: 'all 0.2s ease',
    marginBottom: '12px',
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

export default function SignInPage() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Real-time validation
    if (touched[name]) {
      const error = validations[name]?.(value) || '';
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    const error = validations[name]?.(formData[name]) || '';
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const emailError = validations.email(formData.email);
    const passwordError = formData.password ? '' : 'Password is required';

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    // Submit form
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call signIn from AuthContext
      const result = await signIn(formData.email, formData.password, formData.rememberMe);

      if (!result.success) {
        setErrors({ submit: result.error || 'Invalid email or password' });
        setIsSubmitting(false);
        return;
      }

      // Generate session token
      const sessionToken = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      const sessionExpiresAt = new Date();
      sessionExpiresAt.setHours(sessionExpiresAt.getHours() + 24); // 24 hour session

      // Create session object
      const sessionData = {
        sessionToken,
        userId: result.user.id,
        email: result.user.email,
        username: result.user.username,
        name: result.user.name,
        createdAt: new Date().toISOString(),
        expiresAt: sessionExpiresAt.toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: true,
      };

      // Save session to localStorage
      localStorage.setItem('userSession', JSON.stringify(sessionData));

      setSubmitSuccess(true);
      setFormData({
        email: '',
        password: '',
        rememberMe: false,
      });
      setErrors({});
      setTouched({});

      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to sign in. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (fieldName) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return {
      ...signInStyles.input,
      ...(hasError ? signInStyles.inputError : {}),
    };
  };

  return (
    <div style={signInStyles.container}>
      <div style={signInStyles.containerOverlay}></div>
      <div style={signInStyles.formCard}>
        <div style={signInStyles.header}>
          <h1 style={signInStyles.title}>Welcome Back</h1>
          <p style={signInStyles.subtitle}>Sign in to your AyurCare account</p>
        </div>

        {submitSuccess && (
          <div style={signInStyles.successMessage}>
            ✓ Sign in successful! Redirecting...
          </div>
        )}

        {errors.submit && (
          <div style={{ ...signInStyles.errorMessage, color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', padding: '12px', borderRadius: '6px', marginBottom: '20px', display: 'block' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ ...signInStyles.formGroup, animationDelay: '0.1s' }}>
            <label style={signInStyles.label}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                e.target.style.borderColor = 'var(--green-700)';
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.target) {
                  e.target.style.boxShadow = 'none';
                  if (!errors.email) e.target.style.borderColor = 'var(--line)';
                }
              }}
              placeholder="your@email.com"
              style={getInputStyle('email')}
            />
            {errors.email && touched.email && (
              <div style={signInStyles.errorMessage}>
                ⚠ {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div style={{ ...signInStyles.formGroup, animationDelay: '0.15s' }}>
            <label style={signInStyles.label}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                  e.target.style.borderColor = 'var(--green-700)';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.boxShadow = 'none';
                    if (!errors.password) e.target.style.borderColor = 'var(--line)';
                  }
                }}
                placeholder="••••••••"
                style={{
                  ...getInputStyle('password'),
                  paddingRight: '40px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--charcoal-60)',
                  fontSize: '16px',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && touched.password && (
              <div style={signInStyles.errorMessage}>
                ⚠ {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={signInStyles.rememberForgot}>
            <label style={signInStyles.checkbox}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" style={signInStyles.link}>
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            variant="primary"
            block
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              animation: 'slideUp 0.6s ease-out 0.2s backwards',
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div style={signInStyles.divider}>
          <div style={signInStyles.dividerLine}></div>
          <span>OR</span>
          <div style={signInStyles.dividerLine}></div>
        </div>

        <button style={signInStyles.socialButton}>
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--charcoal-60)' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--green-700)', textDecoration: 'none', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
