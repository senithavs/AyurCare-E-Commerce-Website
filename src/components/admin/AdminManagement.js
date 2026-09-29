'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Button, FormField } from '@/components/ui';
import './AdminManagement.css';

export default function AdminManagement() {
  const { admin, getAdmins, createAdmin, updateAdmin, deleteAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch admins on mount
  useEffect(() => {
    const adminsList = getAdmins();
    setAdmins(adminsList);
  }, [getAdmins]);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Name validation: 2-50 chars, letters only
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = 'Full name must be between 2 and 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Full name must contain only letters and spaces';
    }

    // Username validation: 3-20 chars, alphanumeric + underscore
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = 'Username must be between 3 and 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Check if email already exists (for new admins)
    if (!editingId && admins.some((a) => a.email === formData.email)) {
      newErrors.email = 'This email is already registered';
    }

    // Check if username already exists (for new admins)
    if (!editingId && admins.some((a) => a.username === formData.username)) {
      newErrors.username = 'This username is already taken';
    }

    // Phone validation: 10 digits
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Password validation (only for new admins or when changing password)
    if (!editingId || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character (!@#$%^&*)';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Update admin
        const updateData = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        updateAdmin(editingId, updateData);
        setSuccess('Admin updated successfully!');
      } else {
        // Create new admin
        createAdmin({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        setSuccess('Admin created successfully!');
      }

      // Refresh admins list
      const adminsList = getAdmins();
      setAdmins(adminsList);

      // Reset form
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      setShowForm(false);
      setEditingId(null);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (adminItem) => {
    setEditingId(adminItem.id);
    setFormData({
      name: adminItem.name,
      username: adminItem.username,
      email: adminItem.email,
      phone: adminItem.phone,
      password: '',
      confirmPassword: '',
    });
    setShowForm(true);
    setFormErrors({});
  };

  const handleDelete = (adminId) => {
    try {
      deleteAdmin(adminId);
      setSuccess('Admin deleted successfully!');
      const adminsList = getAdmins();
      setAdmins(adminsList);
      setShowDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete admin');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setFormErrors({});
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-management">
      <div className="admin-management-header">
        <h2>Admin Management</h2>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) handleCancel();
          }}
        >
          {showForm ? '✕ Close' : '+ Add New Admin'}
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>❌ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓ {success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {showForm && (
        <div className="admin-form-container">
          <h3>{editingId ? 'Edit Admin' : 'Create New Admin'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <FormField
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
                {formErrors.name && (
                  <div className="error-message">{formErrors.name}</div>
                )}
              </div>
              <div className="form-group">
                <FormField
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe"
                  required
                />
                {formErrors.username && (
                  <div className="error-message">{formErrors.username}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <FormField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                />
                {formErrors.email && (
                  <div className="error-message">{formErrors.email}</div>
                )}
              </div>
              <div className="form-group">
                <FormField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  required
                />
                {formErrors.phone && (
                  <div className="error-message">{formErrors.phone}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <FormField
                  label={editingId ? 'New Password (leave blank to keep current)' : 'Password'}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required={!editingId}
                />
                {formErrors.password && (
                  <div className="error-message">{formErrors.password}</div>
                )}
              </div>
              <div className="form-group">
                <FormField
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm password"
                  required={!editingId}
                />
                {formErrors.confirmPassword && (
                  <div className="error-message">{formErrors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : editingId ? 'Update Admin' : 'Create Admin'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-search">
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admins-list">
        {filteredAdmins.length === 0 ? (
          <div className="empty-state">
            <p>No admins found</p>
          </div>
        ) : (
          <div className="admins-table">
            <div className="table-header">
              <div className="col-name">Name</div>
              <div className="col-email">Email</div>
              <div className="col-username">Username</div>
              <div className="col-phone">Phone</div>
              <div className="col-role">Role</div>
              <div className="col-actions">Actions</div>
            </div>
            {filteredAdmins.map((adminItem) => (
              <div key={adminItem.id} className="table-row">
                <div className="col-name">{adminItem.name}</div>
                <div className="col-email">{adminItem.email}</div>
                <div className="col-username">{adminItem.username}</div>
                <div className="col-phone">{adminItem.phone}</div>
                <div className="col-role">
                  <span className={`role-badge ${adminItem.role}`}>
                    {adminItem.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
                <div className="col-actions">
                  {adminItem.role !== 'super_admin' && (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(adminItem)}
                        title="Edit"
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => setShowDeleteConfirm(adminItem.id)}
                        title="Delete"
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                  {adminItem.role === 'super_admin' && (
                    <span className="role-badge super_admin">Protected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Admin?</h3>
            <p>Are you sure you want to delete this admin account? This action cannot be undone.</p>
            <div className="modal-actions">
              <Button
                variant="danger"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete Admin
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
