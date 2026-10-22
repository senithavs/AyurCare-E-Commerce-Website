'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { authenticateAdmin, initializeAdminAccount } from '@/lib/adminUtils';
import '@/styles/admin-animations.css';

const loginStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a4a 50%, #1a3a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    animation: 'scaleUp 0.5s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    width: '80px',
    height: '80px',
    margin: '0 auto 16px',
    objectFit: 'contain',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    animation: 'slideUp 0.6s ease-out backwards',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--green-900)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
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
  inputError: {
    borderColor: '#dc2626',
    background: 'rgba(220, 38, 38, 0.02)',
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
  errorIcon: {
    fontSize: '14px',
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--charcoal-60)',
    fontSize: '16px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'var(--charcoal)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  submitButton: {
    marginTop: '12px',
    animation: 'slideUp 0.6s ease-out 0.2s backwards',
  },
  demoCredentials: {
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(106, 168, 79, 0.05)',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(106, 168, 79, 0.2)',
  },
  demoTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--green-700)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  demoContent: {
    fontSize: '13px',
    color: 'var(--charcoal)',
    lineHeight: '1.6',
  },
  demoCode: {
    fontFamily: 'monospace',
    background: 'var(--cream)',
    padding: '8px 12px',
    borderRadius: '4px',
    marginTop: '8px',
    fontSize: '12px',
    overflow: 'auto',
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
  generalError: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid #dc2626',
    color: '#991b1b',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize admin account on component mount
  React.useEffect(() => {
    initializeAdminAccount();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setGeneralError('');

    // Real-time validation
    if (touched[name]) {
      if (name === 'email') {
        const error = validateEmail(value);
        setErrors(prev => ({ ...prev, email: error }));
      } else if (name === 'password') {
        const error = validatePassword(value);
        setErrors(prev => ({ ...prev, password: error }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    let error = '';
    if (name === 'email') {
      error = validateEmail(formData.email);
    } else if (name === 'password') {
      error = validatePassword(formData.password);
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

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

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Authenticate admin
      const result = authenticateAdmin(formData.email, formData.password);

      if (!result.success) {
        setGeneralError(result.error || 'Invalid credentials');
        setIsSubmitting(false);
        return;
      }

      // Save admin session
      localStorage.setItem('currentAdmin', JSON.stringify({
        id: result.admin.id,
        email: result.admin.email,
        username: result.admin.username,
        name: result.admin.name,
        role: result.admin.role,
      }));

      // Save current user as well for general auth
      localStorage.setItem('currentUser', JSON.stringify({
        id: result.admin.id,
        email: result.admin.email,
        username: result.admin.username,
        name: result.admin.name,
      }));

      if (formData.rememberMe) {
        localStorage.setItem('rememberAdmin', 'true');
      }

      setSuccessMessage('Login successful! Redirecting to admin panel...');
      setFormData({
        email: '',
        password: '',
        rememberMe: false,
      });
      setErrors({});
      setTouched({});

      // Redirect to admin dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (error) {
      setGeneralError('Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (fieldName) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return {
      ...loginStyles.input,
      ...(hasError ? loginStyles.inputError : {}),
    };
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        {/* Header */}
        <div style={loginStyles.header}>
          <img 
            src='/logo.png' 
            alt="AyurCare Logo" 
            style={loginStyles.logo}
          />
          <h1 style={loginStyles.title}>Admin Login</h1>
          <p style={loginStyles.subtitle}>Access the AyurCare admin panel</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={loginStyles.successMessage}>
            ✓ {successMessage}
          </div>
        )}

        {/* General Error */}
        {generalError && (
          <div style={loginStyles.generalError}>
            ⚠ {generalError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={loginStyles.form}>
          {/* Email Field */}
          <div style={{ ...loginStyles.formGroup, animationDelay: '0.05s' }}>
            <label style={loginStyles.label}>Email Address</label>
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
              placeholder="admin@example.com"
              style={getInputStyle('email')}
            />
            {errors.email && touched.email && (
              <div style={loginStyles.errorMessage}>
                <span style={loginStyles.errorIcon}>⚠</span>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div style={{ ...loginStyles.formGroup, animationDelay: '0.1s' }}>
            <label style={loginStyles.label}>Password</label>
            <div style={loginStyles.inputWrapper}>
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
                placeholder="Enter your password"
                style={{
                  ...getInputStyle('password'),
                  paddingRight: '40px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={loginStyles.togglePassword}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && touched.password && (
              <div style={loginStyles.errorMessage}>
                <span style={loginStyles.errorIcon}>⚠</span>
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me */}
          <label style={loginStyles.rememberMe}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={loginStyles.checkbox}
            />
            <span>Remember me</span>
          </label>

          {/* Submit Button */}
          <div style={loginStyles.submitButton}>
            <Button
              variant="primary"
              block
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div style={loginStyles.demoCredentials}>
          <div style={loginStyles.demoTitle}>Demo Credentials</div>
          <div style={loginStyles.demoContent}>
            <div style={loginStyles.demoCode}>
              Email: admin@ayurcare.com<br/>
              Password: Admin@123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
