'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, FormField } from '@/components/ui';
import '@/styles/admin-animations.css';

const productsStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '12px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  searchBar: {
    flex: 1,
    maxWidth: '400px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '900px',
    width: '95%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  formGridFull: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    marginBottom: '0px',
  },
  imagePreview: {
    width: '100%',
    height: '200px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '12px',
    border: '2px solid var(--line)',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    width: '100%',
    padding: '12px',
    border: '2px dashed var(--line)',
    borderRadius: '8px',
    background: 'var(--cream)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--green-700)',
    transition: 'all 0.2s ease',
    marginBottom: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--green-900)',
    borderBottom: '1px solid var(--line)',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 8px',
    fontSize: '13px',
    color: 'var(--charcoal)',
    borderBottom: '1px solid var(--line)',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: 'none',
    border: '1px solid var(--line)',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    borderColor: 'var(--danger)',
    color: 'var(--danger)',
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '2px solid var(--line)',
    paddingBottom: '12px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    color: 'var(--charcoal-60)',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    color: 'var(--green-700)',
    borderBottomColor: 'var(--green-700)',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: 500,
  },
  alertSuccess: {
    background: 'rgba(106, 168, 79, 0.1)',
    color: 'var(--green-700)',
    border: '1px solid var(--green-700)',
  },
  alertError: {
    background: 'rgba(255, 67, 67, 0.1)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    name_en: '',
    category: '',
    price: '',
    stock_quantity: '',
    product_benefits: '',
    availability: 'In Stock',
  });

  // Fetch products and categories from database on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products from database');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleOpenModal = () => {
    resetForm();
    fetchCategories(); // Refresh categories when opening modal
    setShowModal(true);
  };

  // Filter products by search
  const filteredProducts = products.filter((product) =>
    product.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      product_id: '',
      name: '',
      name_en: '',
      category: '',
      price: '',
      stock_quantity: '',
      product_benefits: '',
      availability: 'In Stock',
    });
    setEditingProduct(null);
  };

  const handleAddProduct = async () => {
    setError('');
    setSuccess('');

    if (!formData.product_id || !formData.name || !formData.category || !formData.price) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingProduct) {
        // Update product
        const response = await fetch('/api/products/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct._id,
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity) || 0,
            product_benefits: formData.product_benefits
              .split('\n')
              .filter((b) => b.trim()),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to update product');
          return;
        }

        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        const response = await fetch('/api/products/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity) || 0,
            product_benefits: formData.product_benefits
              .split('\n')
              .filter((b) => b.trim()),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to create product');
          return;
        }

        setSuccess('Product created successfully!');
      }

      // Refresh products list
      fetchProducts();
      resetForm();
      setShowModal(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id,
      name: product.name,
      name_en: product.name_en || '',
      category: product.category,
      price: product.price.toString(),
      stock_quantity: (product.stock_quantity || 0).toString(),
      product_benefits: (product.product_benefits || []).join('\n'),
      availability: product.availability || 'In Stock',
    });
    fetchCategories(); // Refresh categories when opening edit modal
    setShowModal(true);
    setError('');
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/delete?id=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to delete product');
        return;
      }

      setSuccess('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-enter">
      <div style={productsStyles.header}>
        <div style={productsStyles.searchBar}>
          <input
            type="text"
            placeholder="Search by Product ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
              e.target.style.borderColor = 'var(--green-700)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = 'var(--line)';
            }}
          />
        </div>
        <div style={productsStyles.buttonGroup}>
          <Button variant="primary" size="sm" onClick={handleOpenModal}>
            + Add Product
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ ...productsStyles.alert, ...productsStyles.alertError }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>×</button>
        </div>
      )}

      {success && (
        <div style={{ ...productsStyles.alert, ...productsStyles.alertSuccess }}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>×</button>
        </div>
      )}

      {/* Products Tab */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }} className="admin-section-card">
        {isLoading ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              {searchQuery ? `No products found matching "${searchQuery}"` : 'No products available'}
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--green-700)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline',
                  marginTop: '8px',
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <table style={productsStyles.table} className="admin-table">
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th style={productsStyles.th}>Product ID</th>
                <th style={productsStyles.th}>Name</th>
                <th style={productsStyles.th}>Category</th>
                <th style={productsStyles.th}>Price</th>
                <th style={productsStyles.th}>Stock</th>
                <th style={productsStyles.th}>Status</th>
                <th style={productsStyles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td style={productsStyles.td}>
                    <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>{product.product_id}</span>
                  </td>
                  <td style={productsStyles.td}>{product.name_en || product.name}</td>
                  <td style={productsStyles.td}>{product.category}</td>
                  <td style={productsStyles.td}>Rs. {product.price.toLocaleString()}</td>
                  <td style={productsStyles.td}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: product.stock_quantity > 20 ? 'var(--sage-100)' : product.stock_quantity > 10 ? '#FBE9CF' : '#F5DCDC',
                      color: product.stock_quantity > 20 ? 'var(--green-700)' : product.stock_quantity > 10 ? '#8A5A0E' : 'var(--danger)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td style={productsStyles.td}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: product.inStock ? 'var(--sage-100)' : '#F5DCDC',
                      color: product.inStock ? 'var(--green-700)' : 'var(--danger)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {product.availability || (product.inStock ? 'In Stock' : 'Out of Stock')}
                    </span>
                  </td>
                  <td style={productsStyles.td}>
                    <div style={productsStyles.actions}>
                      <button
                        style={{...productsStyles.actionBtn, borderColor: 'var(--green-700)', color: 'var(--green-700)'}}
                        onClick={() => handleEditProduct(product)}
                        disabled={isLoading}
                      >
                        ✎ Edit
                      </button>
                      <button
                        style={{...productsStyles.actionBtn, ...productsStyles.deleteBtn}}
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={isLoading}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={productsStyles.modal} className="admin-modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div style={productsStyles.modalContent} className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={productsStyles.modalTitle}>{editingProduct ? 'Edit Product Details' : 'Add New Product'}</div>

            <div style={productsStyles.formGrid}>
              <div style={productsStyles.formGroup}>
                <FormField
                  label="Product ID"
                  placeholder="e.g., AYU-001"
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  disabled={editingProduct ? true : false}
                />
              </div>

              <div style={productsStyles.formGroup}>
                <FormField
                  label="Product Name (English)"
                  placeholder="e.g., Ashwagandha"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                />
              </div>

              <div style={productsStyles.formGroup}>
                <FormField
                  label="Product Name (Sinhala)"
                  placeholder="e.g., අශ්වගන්ධා"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={productsStyles.formGroup}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={productsStyles.formGroup}>
                <FormField
                  label="Price (Rs.)"
                  type="number"
                  placeholder="1000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div style={productsStyles.formGroup}>
                <FormField
                  label="Stock Quantity"
                  type="number"
                  placeholder="50"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                />
              </div>

              <div style={productsStyles.formGroup}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </div>

              <div style={{ ...productsStyles.formGroup, ...productsStyles.formGridFull }}>
                <FormField
                  label="Product Benefits (one per line)"
                  type="textarea"
                  placeholder="Boosts immunity&#10;Improves digestion&#10;Reduces stress"
                  value={formData.product_benefits}
                  onChange={(e) => setFormData({ ...formData, product_benefits: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="primary" block onClick={handleAddProduct} disabled={isLoading}>
                {isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
              <Button variant="outline" block onClick={() => { setShowModal(false); resetForm(); }} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
