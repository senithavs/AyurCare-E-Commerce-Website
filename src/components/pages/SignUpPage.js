'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { validations, validateForm } from '@/lib/validations';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const signUpStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a4a 50%, #1a3a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  formCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    animation: 'scaleUp 0.5s ease-out',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formGridFull: {
    gridColumn: '1 / -1',
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
    marginBottom: '20px',
    animation: 'slideUp 0.6s ease-out backwards',
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
  passwordRequirements: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
    marginTop: '8px',
    padding: '8px 12px',
    background: 'var(--cream)',
    borderRadius: '6px',
    lineHeight: '1.6',
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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive grid layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      const error = validations[name]?.(value) || '';
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Special case for confirm password
    if (name === 'confirmPassword' && touched.confirmPassword) {
      const error = validations.confirmPassword(formData.password, value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: error,
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
    let error = '';
    if (name === 'confirmPassword') {
      error = validations.confirmPassword(formData.password, formData[name]);
    } else {
      error = validations[name]?.(formData[name]) || '';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const fieldsToValidate = ['name', 'username', 'email', 'phone', 'address', 'password', 'confirmPassword'];
    const formErrors = validateForm(formData, fieldsToValidate);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched({
        name: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    // Submit form
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u) => u.email === formData.email || u.username === formData.username);

      if (userExists) {
        setErrors({ submit: 'Email or username already registered' });
        setIsSubmitting(false);
        return;
      }

      users.push({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ email: formData.email, username: formData.username }));

      setSubmitSuccess(true);
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setTouched({});

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (fieldName) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return {
      ...signUpStyles.input,
      ...(hasError ? signUpStyles.inputError : {}),
    };
  };

  return (
    <div style={signUpStyles.container}>
      <div style={signUpStyles.formCard}>
        <div style={signUpStyles.header}>
          <h1 style={signUpStyles.title}>Create Account</h1>
          <p style={signUpStyles.subtitle}>Join AyurCare for exclusive wellness products</p>
        </div>

        {submitSuccess && (
          <div style={signUpStyles.successMessage}>
            ✓ Account created successfully! Redirecting to sign in...
          </div>
        )}

        {errors.submit && (
          <div style={{ ...signUpStyles.errorMessage, color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', padding: '12px', borderRadius: '6px', marginBottom: '20px', display: 'block' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            ...signUpStyles.formGrid,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          }}>
            {/* Name Field */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.1s' }}>
              <label style={signUpStyles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                  e.target.style.borderColor = 'var(--green-700)';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.boxShadow = 'none';
                    if (!errors.name) e.target.style.borderColor = 'var(--line)';
                  }
                }}
                placeholder="John Doe"
                style={getInputStyle('name')}
              />
              {errors.name && touched.name && (
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.name}
                </div>
              )}
            </div>

            {/* Username Field */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.15s' }}>
              <label style={signUpStyles.label}>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                  e.target.style.borderColor = 'var(--green-700)';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.boxShadow = 'none';
                    if (!errors.username) e.target.style.borderColor = 'var(--line)';
                  }
                }}
                placeholder="john_doe"
                style={getInputStyle('username')}
              />
              {errors.username && touched.username && (
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.username}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.2s' }}>
              <label style={signUpStyles.label}>Email Address *</label>
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
                placeholder="john@example.com"
                style={getInputStyle('email')}
              />
              {errors.email && touched.email && (
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.email}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.25s' }}>
              <label style={signUpStyles.label}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                  e.target.style.borderColor = 'var(--green-700)';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.boxShadow = 'none';
                    if (!errors.phone) e.target.style.borderColor = 'var(--line)';
                  }
                }}
                placeholder="9876543210"
                style={getInputStyle('phone')}
              />
              {errors.phone && touched.phone && (
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.phone}
                </div>
              )}
            </div>

            {/* Address Field - Full Width */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.3s', ...signUpStyles.formGridFull }}>
              <label style={signUpStyles.label}>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                  e.target.style.borderColor = 'var(--green-700)';
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.boxShadow = 'none';
                    if (!errors.address) e.target.style.borderColor = 'var(--line)';
                  }
                }}
                placeholder="123 Main St, City"
                style={getInputStyle('address')}
              />
              {errors.address && touched.address && (
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.address}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.35s' }}>
              <label style={signUpStyles.label}>Password *</label>
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
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ ...signUpStyles.formGroup, animationDelay: '0.4s' }}>
              <label style={signUpStyles.label}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
                    e.target.style.borderColor = 'var(--green-700)';
                  }}
                  onMouseLeave={(e) => {
                    if (document.activeElement !== e.target) {
                      e.target.style.boxShadow = 'none';
                      if (!errors.confirmPassword) e.target.style.borderColor = 'var(--line)';
                    }
                  }}
                  placeholder="••••••••"
                  style={{
                    ...getInputStyle('confirmPassword'),
                    paddingRight: '40px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div style={signUpStyles.errorMessage}>
                  ⚠ {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Password Requirements - Full Width */}
            {formData.password && (
              <div style={{ ...signUpStyles.passwordRequirements, ...signUpStyles.formGridFull }}>
                <strong>Password requirements:</strong><br />
                • At least 8 characters<br />
                • One uppercase letter (A-Z)<br />
                • One lowercase letter (a-z)<br />
                • One number (0-9)<br />
                • One special character (!@#$%^&*)
              </div>
            )}

            {/* Submit Button - Full Width */}
            <div style={{ ...signUpStyles.formGridFull, marginTop: '12px' }}>
              <Button
                variant="primary"
                block
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  animation: 'slideUp 0.6s ease-out 0.45s backwards',
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--charcoal-60)' }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: 'var(--green-700)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
