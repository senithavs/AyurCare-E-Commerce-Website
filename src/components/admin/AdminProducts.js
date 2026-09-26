'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { Button, FormField } from '@/components/ui';

const productsStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
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
};

export default function AdminProducts() {
  const { products, addProduct, deleteProduct } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Herbal Supplements',
    price: '',
    stockCount: '',
    description: '',
  });

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
      image: '🌿',
      rating: 4.5,
      reviewCount: 0,
      inStock: true,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
    });

    setFormData({
      name: '',
      category: 'Herbal Supplements',
      price: '',
      stockCount: '',
      description: '',
    });
    setShowModal(false);
  };

  return (
    <div>
      <div style={productsStyles.header}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green-900)' }}>
          Product Management
        </h2>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          + Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={productsStyles.table}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              <th style={productsStyles.th}>Name</th>
              <th style={productsStyles.th}>Category</th>
              <th style={productsStyles.th}>Price</th>
              <th style={productsStyles.th}>Stock</th>
              <th style={productsStyles.th}>Status</th>
              <th style={productsStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
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
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div style={productsStyles.modal} onClick={() => setShowModal(false)}>
          <div style={productsStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={productsStyles.modalTitle}>Add New Product</div>

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
                <option>Herbal Supplements</option>
                <option>Ayurvedic Oils</option>
                <option>Natural Skincare</option>
                <option>Organic Teas</option>
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
    </div>
  );
}
