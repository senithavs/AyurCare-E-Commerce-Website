// Validation utilities for user forms

export const validations = {
  // Email validation
  email: (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  },

  // Password validation
  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
  },

  // Confirm password validation
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirm password is required';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  },

  // Name validation
  name: (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must not exceed 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name should only contain letters and spaces';
    return '';
  },

  // Username validation
  username: (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must not exceed 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  },

  // Phone number validation (10 digits)
  phone: (phone) => {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[^\d]/g, ''))) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  },

  // Address validation
  address: (address) => {
    if (!address) return 'Address is required';
    if (address.length < 5) return 'Address must be at least 5 characters';
    if (address.length > 100) return 'Address must not exceed 100 characters';
    return '';
  },
};

// Validation helper to validate all fields
export const validateForm = (formData, fieldsToValidate) => {
  const errors = {};

  fieldsToValidate.forEach((field) => {
    let error = '';

    switch (field) {
      case 'email':
        error = validations.email(formData.email);
        break;
      case 'password':
        error = validations.password(formData.password);
        break;
      case 'confirmPassword':
        error = validations.confirmPassword(formData.password, formData.confirmPassword);
        break;
      case 'name':
        error = validations.name(formData.name);
        break;
      case 'username':
        error = validations.username(formData.username);
        break;
      case 'phone':
        error = validations.phone(formData.phone);
        break;
      case 'address':
        error = validations.address(formData.address);
        break;
      default:
        break;
    }

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
