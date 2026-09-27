'use client';

import { useState, useRef } from 'react';
import { useAdmin } from '@/lib/AdminContext';
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
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '16px',
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
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  categoryCard: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  categoryIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block',
  },
  categoryName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--green-900)',
    marginBottom: '8px',
  },
  deleteIconBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'var(--danger)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
};

export default function AdminProducts() {
  const { products, categories, addProduct, deleteProduct, addCategory, deleteCategory } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [productImage, setProductImage] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const productFileInputRef = useRef(null);
  const categoryFileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: categories.length > 0 ? categories[0].name : 'Herbal Supplements',
    price: '',
    stockCount: '',
    description: '',
  });
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: '🌿',
  });

  // Filter products by ID/name
  const filteredProducts = products.filter((product) =>
    product.id.toString().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stockCount) {
      alert('Please fill all required fields');
      return;
    }

    addProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stockCount: parseInt(formData.stockCount),
      description: formData.description,
      image: productImage || '🌿',
      rating: 4.5,
      reviewCount: 0,
      inStock: true,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
    });

    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : 'Herbal Supplements',
      price: '',
      stockCount: '',
      description: '',
    });
    setProductImage('');
    setShowModal(false);
  };

  const handleAddCategory = () => {
    if (!categoryFormData.name) {
      alert('Please enter category name');
      return;
    }

    addCategory({
      name: categoryFormData.name,
      icon: categoryFormData.icon,
      image: categoryImage,
    });

    setCategoryFormData({
      name: '',
      icon: '🌿',
    });
    setCategoryImage('');
    setShowCategoryModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result);
      };
      reader.readAsDataURL(file);
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
          <Button variant="primary" size="sm" onClick={() => setShowCategoryModal(true)}>
            + Add Category
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            + Add Product
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={productsStyles.tabs}>
        <button
          style={{
            ...productsStyles.tabBtn,
            ...(activeTab === 'products' ? productsStyles.tabBtnActive : {}),
          }}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          style={{
            ...productsStyles.tabBtn,
            ...(activeTab === 'categories' ? productsStyles.tabBtnActive : {}),
          }}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }} className="admin-section-card">
          {filteredProducts.length === 0 ? (
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
                  <th style={productsStyles.th}>ID</th>
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
                  <tr key={product.id}>
                    <td style={productsStyles.td}>
                      <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>#{product.id}</span>
                    </td>
                    <td style={productsStyles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{product.image}</span>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td style={productsStyles.td}>{product.category}</td>
                    <td style={productsStyles.td}>Rs. {product.price.toLocaleString()}</td>
                    <td style={productsStyles.td}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: product.stockCount > 20 ? 'var(--sage-100)' : product.stockCount > 10 ? '#FBE9CF' : '#F5DCDC',
                        color: product.stockCount > 20 ? 'var(--green-700)' : product.stockCount > 10 ? '#8A5A0E' : 'var(--danger)',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        {product.stockCount}
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
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={productsStyles.td}>
                      <div style={productsStyles.actions}>
                        <button
                          style={{...productsStyles.actionBtn, borderColor: 'var(--green-700)', color: 'var(--green-700)'}}
                          onClick={() => alert('Edit functionality - Update stock and details')}
                        >
                          Edit
                        </button>
                        <button
                          style={{...productsStyles.actionBtn, ...productsStyles.deleteBtn}}
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          {categories.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)', background: '#fff', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '14px' }}>
                No categories available. Add your first category using the "Add Category" button.
              </div>
            </div>
          ) : (
            <div style={productsStyles.categoryGrid}>
              {categories.map((category) => (
                <div key={category.id} style={productsStyles.categoryCard} className="admin-section-card">
                  <button
                    style={productsStyles.deleteIconBtn}
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${category.name}" category?`)) {
                        deleteCategory(category.id);
                      }
                    }}
                    title="Delete category"
                  >
                    ×
                  </button>
                  
                  {category.image ? (
                    <img src={category.image} alt={category.name} style={productsStyles.categoryImage} />
                  ) : (
                    <div style={{ ...productsStyles.categoryImage, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={productsStyles.categoryIcon}>{category.icon}</span>
                    </div>
                  )}
                  
                  <div style={productsStyles.categoryName}>{category.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--charcoal-60)' }}>
                    {category.icon} {category.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div style={productsStyles.modal} className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div style={productsStyles.modalContent} className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={productsStyles.modalTitle}>Add New Product</div>

            {productImage && (
              <img src={productImage} alt="Product Preview" style={productsStyles.imagePreview} />
            )}

            <div style={productsStyles.formGroup}>
              <button
                onClick={() => productFileInputRef.current?.click()}
                style={productsStyles.uploadButton}
                onMouseEnter={(e) => e.target.style.background = 'rgba(106, 168, 79, 0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--cream)'}
              >
                📁 {productImage ? 'Change Product Image' : 'Upload Product Image'}
              </button>
              <input
                ref={productFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProductImageUpload}
                style={productsStyles.fileInput}
              />
            </div>

            <div style={productsStyles.formGroup}>
              <FormField
                label="Product Name"
                placeholder="e.g., Ashwagandha Capsules"
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
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
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
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
              />
            </div>

            <div style={productsStyles.formGroup}>
              <FormField
                label="Description"
                type="textarea"
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="primary" block onClick={handleAddProduct}>
                Add Product
              </Button>
              <Button variant="outline" block onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div style={productsStyles.modal} className="admin-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div style={productsStyles.modalContent} className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={productsStyles.modalTitle}>Add New Category</div>

            {categoryImage && (
              <img src={categoryImage} alt="Preview" style={productsStyles.imagePreview} />
            )}

            <div style={productsStyles.formGroup}>
              <button
                onClick={() => categoryFileInputRef.current?.click()}
                style={productsStyles.uploadButton}
                onMouseEnter={(e) => e.target.style.background = 'rgba(106, 168, 79, 0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--cream)'}
              >
                📁 {categoryImage ? 'Change Image' : 'Upload Category Image'}
              </button>
              <input
                ref={categoryFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={productsStyles.fileInput}
              />
            </div>

            <div style={productsStyles.formGroup}>
              <FormField
                label="Category Name"
                placeholder="e.g., Herbal Supplements"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
              />
            </div>

            <div style={productsStyles.formGroup}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-900)', display: 'block', marginBottom: '6px' }}>
                Icon Emoji
              </label>
              <input
                type="text"
                placeholder="e.g., 🌿"
                maxLength="2"
                value={categoryFormData.icon}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="primary" block onClick={handleAddCategory}>
                Add Category
              </Button>
              <Button variant="outline" block onClick={() => setShowCategoryModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
