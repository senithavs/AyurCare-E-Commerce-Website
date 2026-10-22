'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const categoryStyles = {
  container: {
    padding: '32px',
  },
  header: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--line)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-900)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--charcoal-60)',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    maxWidth: '300px',
    padding: '12px 14px',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  addButton: {
    padding: '12px 24px',
    background: 'var(--green-700)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    animation: 'slideUp 0.6s ease-out backwards',
  },
  cardHover: {
    boxShadow: '0 8px 24px rgba(106, 168, 79, 0.15)',
    transform: 'translateY(-4px)',
  },
  imageContainer: {
    width: '100%',
    height: '140px',
    background: 'var(--sage-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '16px',
  },
  cardIcon: {
    fontSize: '24px',
    marginRight: '8px',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '4px',
  },
  categoryDescription: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
    marginBottom: '12px',
    minHeight: '24px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  editBtn: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#1e40af',
  },
  deleteBtn: {
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#991b1b',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'scaleUp 0.3s ease-out',
  },
  modalHeader: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
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
    border: '1px solid var(--line)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '100px',
    resize: 'vertical',
    transition: 'all 0.2s ease',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid var(--line)',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '13px',
    fontWeight: 500,
  },
  alertSuccess: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#166534',
    border: '1px solid #16a34a',
  },
  alertError: {
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#991b1b',
    border: '1px solid #dc2626',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--charcoal-60)',
  },
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    image: '',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setError(data.error || 'Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories from database');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        image: category.image || '',
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: '📦',
        image: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      icon: '📦',
      image: '',
      description: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.image,
        }));
        setSuccess('Image uploaded successfully');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const endpoint = editingCategory ? '/api/categories/update' : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory?._id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to ${editingCategory ? 'update' : 'create'} category`);
        return;
      }

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? data.category : c))
        );
        setSuccess('Category updated successfully');
      } else {
        setCategories((prev) => [data.category, ...prev]);
        setSuccess('Category created successfully');
      }

      setTimeout(() => setSuccess(''), 3000);
      handleCloseModal();
    } catch (err) {
      console.error('Error saving category:', err);
      setError(`Failed to ${editingCategory ? 'update' : 'create'} category`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories?id=${categoryId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          setCategories((prev) => prev.filter((c) => c._id !== categoryId));
          setSuccess('Category deleted successfully');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.error || 'Failed to delete category');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category');
      }
    }
  };

  return (
    <div style={categoryStyles.container}>
      {/* Error Alert */}
      {error && (
        <div style={{ ...categoryStyles.alert, ...categoryStyles.alertError }}>
          {error}
          <button
            onClick={() => setError('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              float: 'right',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div style={{ ...categoryStyles.alert, ...categoryStyles.alertSuccess }}>
          {success}
          <button
            onClick={() => setSuccess('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              float: 'right',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div style={categoryStyles.header}>
        <h1 style={categoryStyles.title}>🏷️ Product Categories</h1>
        <p style={categoryStyles.subtitle}>Create and manage product categories</p>
      </div>

      {/* Controls */}
      <div style={categoryStyles.controls}>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={categoryStyles.searchInput}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--green-700)';
            e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--line)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={() => handleOpenModal()}
          style={categoryStyles.addButton}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--green-800)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--green-700)';
          }}
        >
          + Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div style={categoryStyles.emptyState}>Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div style={categoryStyles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--green-900)' }}>
            {searchQuery ? 'No categories found' : 'No categories yet'}
          </div>
          <p>{searchQuery ? 'Try adjusting your search' : 'Click "Add Category" to create one'}</p>
        </div>
      ) : (
        <div style={categoryStyles.grid}>
          {filteredCategories.map((category, index) => (
            <div
              key={category._id}
              style={{
                ...categoryStyles.card,
                animationDelay: `${index * 0.05}s`,
              }}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, categoryStyles.cardHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={categoryStyles.imageContainer}>
                {category.image ? (
                  <img src={category.image} alt={category.name} style={categoryStyles.cardImage} />
                ) : (
                  <span style={categoryStyles.cardIcon}>{category.icon}</span>
                )}
              </div>
              <div style={categoryStyles.cardContent}>
                <div style={categoryStyles.categoryName}>{category.name}</div>
                <div style={categoryStyles.categoryDescription}>
                  {category.description || 'No description'}
                </div>
                <div style={categoryStyles.actions}>
                  <button
                    style={{ ...categoryStyles.actionButton, ...categoryStyles.editBtn }}
                    onClick={() => handleOpenModal(category)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...categoryStyles.actionButton, ...categoryStyles.deleteBtn }}
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={categoryStyles.modal} onClick={handleCloseModal}>
          <div
            style={categoryStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={categoryStyles.modalHeader}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </div>

            <div style={categoryStyles.formGroup}>
              <label style={categoryStyles.label}>Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Herbal Supplements"
                style={categoryStyles.input}
              />
            </div>

            <div style={categoryStyles.formGroup}>
              <label style={categoryStyles.label}>Icon (Emoji)</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleFormChange}
                placeholder="e.g., 🌱"
                style={categoryStyles.input}
              />
            </div>

            <div style={categoryStyles.formGroup}>
              <label style={categoryStyles.label}>Category Image</label>
              {formData.image && (
                <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                    }}
                  />
                </div>
              )}
              <div style={categoryStyles.input}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px dashed var(--line)',
                    borderRadius: '8px',
                    background: 'var(--cream)',
                    cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--green-700)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isUploadingImage) {
                      e.target.style.borderColor = 'var(--green-700)';
                      e.target.style.background = 'rgba(106, 168, 79, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--line)';
                    e.target.style.background = 'var(--cream)';
                  }}
                >
                  {isUploadingImage ? '⏳ Uploading...' : '📷 Choose Image'}
                </button>
              </div>
            </div>

            <div style={categoryStyles.formGroup}>
              <label style={categoryStyles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Brief description of this category"
                style={categoryStyles.textarea}
              />
            </div>

            <div style={categoryStyles.modalActions}>
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
