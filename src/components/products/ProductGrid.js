'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { useCart } from '@/lib/CartContext';
import { Toast } from '@/components/utility';

const gridStyles = {
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
};

export default function ProductGrid({
  products = [],
  columns = 4,
  className = '',
}) {
  const [wishlist, setWishlist] = useState(new Set());
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();

  const columnMap = {
    4: gridStyles.grid4,
    3: gridStyles.grid3,
    2: gridStyles.grid2,
  };

  const gridStyle = columnMap[columns] || gridStyles.grid4;

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1);
      setToast(`${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div style={gridStyle} className={className}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            isWishlisted={wishlist.has(product.id)}
          />
        ))}
      </div>
    </>
  );
}
