'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const stockStyles = {
  filterBar: {
    marginBottom: '24px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '300px',
    padding: '12px 14px',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
    animation: 'slideUp 0.6s ease-out 0.1s backwards',
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
  qtyInput: {
    width: '80px',
    padding: '6px 8px',
    border: '1px solid var(--line)',
    borderRadius: '6px',
    fontSize: '13px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  summaryCard: {
    background: '#fff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--line)',
    animation: 'slideUp 0.6s ease-out backwards',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
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

export default function AdminStock() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempUpdates, setTempUpdates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingProductId, setSavingProductId] = useState(null);

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name_en || p.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (productId, value) => {
    setTempUpdates((prev) => ({
      ...prev,
      [productId]: parseInt(value) || 0,
    }));
  };

  const handleSaveStock = async (productId) => {
    const newQty = tempUpdates[productId];
    if (newQty === undefined) return;

    try {
      setSavingProductId(productId);
      setError('');
      setSuccess('');

      const response = await fetch('/api/products/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          stock_quantity: newQty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update stock');
        return;
      }

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, stock_quantity: newQty } : p
        )
      );

      setTempUpdates((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      setSuccess(`Stock updated successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving stock:', err);
      setError('Failed to update stock');
    } finally {
      setSavingProductId(null);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { color: '#F5DCDC', text: 'Out of Stock', textColor: 'var(--danger)' };
    if (quantity < 10) return { color: '#FBE9CF', text: 'Low Stock', textColor: '#8A5A0E' };
    if (quantity < 30) return { color: '#DCE7F5', text: 'Medium Stock', textColor: '#2F5A9E' };
    return { color: 'var(--sage-100)', text: 'In Stock', textColor: 'var(--green-700)' };
  };

  const lowStockCount = products.filter((p) => p.stock_quantity < 10).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

  return (
    <div className="admin-page-enter">
      {error && (
        <div style={{ ...stockStyles.alert, ...stockStyles.alertError }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', float: 'right' }}>×</button>
        </div>
      )}

      {success && (
        <div style={{ ...stockStyles.alert, ...stockStyles.alertSuccess }}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', float: 'right' }}>×</button>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...stockStyles.summaryCard, animationDelay: '0.1s' }} className="admin-kpi-card">
          <div style={{ fontSize: '12px', color: 'var(--charcoal-60)', marginBottom: '4px' }}>Total Products</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green-900)' }}>{products.length}</div>
        </div>
        <div style={{ background: '#FBE9CF', padding: '16px', borderRadius: '8px', border: '1px solid #E5D4B2', animation: 'slideUp 0.6s ease-out 0.2s backwards' }} className="admin-kpi-card">
          <div style={{ fontSize: '12px', color: '#8A5A0E', marginBottom: '4px' }}>Low Stock</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#8A5A0E' }}>{lowStockCount}</div>
        </div>
        <div style={{ background: '#F5DCDC', padding: '16px', borderRadius: '8px', border: '1px solid #E5BDBD', animation: 'slideUp 0.6s ease-out 0.3s backwards' }} className="admin-kpi-card">
          <div style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '4px' }}>Out of Stock</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--danger)' }}>{outOfStockCount}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={stockStyles.filterBar}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={stockStyles.searchInput}
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

      {/* Stock Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }} className="admin-section-card">
        {isLoading ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              {searchQuery ? `No products found matching "${searchQuery}"` : 'No products found.'}
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
          <table style={stockStyles.table} className="admin-table">
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th style={stockStyles.th}>Product Name</th>
                <th style={stockStyles.th}>Category</th>
                <th style={stockStyles.th}>Price</th>
                <th style={stockStyles.th}>Current Stock</th>
                <th style={stockStyles.th}>Status</th>
                <th style={stockStyles.th}>Update Qty</th>
                <th style={stockStyles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                const productId = product._id;
                const tempQty = tempUpdates[productId];
                const displayQty = tempQty !== undefined ? tempQty : product.stock_quantity;
                const isSaving = savingProductId === productId;

                return (
                  <tr key={productId} style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s backwards` }}>
                    <td style={stockStyles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{product.name_en || product.name}</span>
                      </div>
                    </td>
                    <td style={stockStyles.td}>{product.category}</td>
                    <td style={stockStyles.td}>Rs. {product.price.toLocaleString()}</td>
                    <td style={stockStyles.td}>
                      <strong>{product.stock_quantity}</strong>
                    </td>
                    <td style={stockStyles.td}>
                      <span
                        style={{
                          ...stockStyles.statusBadge,
                          background: stockStatus.color,
                          color: stockStatus.textColor,
                        }}
                      >
                        {stockStatus.text}
                      </span>
                    </td>
                    <td style={stockStyles.td}>
                      <input
                        type="number"
                        value={displayQty}
                        onChange={(e) => handleStockChange(productId, e.target.value)}
                        style={stockStyles.qtyInput}
                        min="0"
                        disabled={isSaving}
                        onFocus={(e) => {
                          e.target.style.boxShadow = '0 0 0 2px rgba(106, 168, 79, 0.1)';
                          e.target.style.borderColor = 'var(--green-700)';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = 'var(--line)';
                        }}
                      />
                    </td>
                    <td style={stockStyles.td}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveStock(productId)}
                        disabled={isSaving || tempUpdates[productId] === undefined}
                        style={{
                          opacity: tempUpdates[productId] !== undefined ? 1 : 0.5,
                          transition: 'opacity 0.2s ease',
                          cursor: tempUpdates[productId] !== undefined && !isSaving ? 'pointer' : 'default',
                        }}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
