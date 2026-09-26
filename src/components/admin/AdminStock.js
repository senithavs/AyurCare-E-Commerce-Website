'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { Button, FormField } from '@/components/ui';

const stockStyles = {
  filterBar: {
    marginBottom: '24px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '300px',
    padding: '8px 12px',
    border: '1px solid var(--line)',
    borderRadius: '8px',
    fontSize: '13px',
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
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
};

export default function AdminStock() {
  const { products, updateStock } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [tempUpdates, setTempUpdates] = useState({});

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (productId, value) => {
    setTempUpdates((prev) => ({
      ...prev,
      [productId]: parseInt(value) || 0,
    }));
  };

  const handleSaveStock = (productId) => {
    const newQty = tempUpdates[productId];
    if (newQty !== undefined) {
      updateStock(productId, newQty);
      setTempUpdates((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { color: '#F5DCDC', text: 'Out of Stock', textColor: 'var(--danger)' };
    if (quantity < 10) return { color: '#FBE9CF', text: 'Low Stock', textColor: '#8A5A0E' };
    if (quantity < 30) return { color: '#DCE7F5', text: 'Medium Stock', textColor: '#2F5A9E' };
    return { color: 'var(--sage-100)', text: 'In Stock', textColor: 'var(--green-700)' };
  };

  const lowStockCount = products.filter((p) => p.stockCount < 10).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '12px', color: 'var(--charcoal-60)', marginBottom: '4px' }}>Total Products</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green-900)' }}>{products.length}</div>
        </div>
        <div style={{ background: '#FBE9CF', padding: '16px', borderRadius: '8px', border: '1px solid #E5D4B2' }}>
          <div style={{ fontSize: '12px', color: '#8A5A0E', marginBottom: '4px' }}>Low Stock</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#8A5A0E' }}>{lowStockCount}</div>
        </div>
        <div style={{ background: '#F5DCDC', padding: '16px', borderRadius: '8px', border: '1px solid #E5BDBD' }}>
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
        />
      </div>

      {/* Stock Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={stockStyles.table}>
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
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stockCount);
              const tempQty = tempUpdates[product.id];
              const displayQty = tempQty !== undefined ? tempQty : product.stockCount;

              return (
                <tr key={product.id}>
                  <td style={stockStyles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{product.image}</span>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td style={stockStyles.td}>{product.category}</td>
                  <td style={stockStyles.td}>Rs. {product.price.toLocaleString()}</td>
                  <td style={stockStyles.td}>
                    <strong>{product.stockCount}</strong>
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
                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                      style={stockStyles.qtyInput}
                      min="0"
                    />
                  </td>
                  <td style={stockStyles.td}>
                    {tempUpdates[product.id] !== undefined ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveStock(product.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <span style={{ color: 'var(--charcoal-60)', fontSize: '12px' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--charcoal-60)' }}>
          No products found.
        </div>
      )}
    </div>
  );
}
