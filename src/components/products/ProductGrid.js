'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';
import { Toast } from '@/components/utility';
import '@/styles/admin-animations.css';

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
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const columnMap = {
    4: gridStyles.grid4,
    3: gridStyles.grid3,
    2: gridStyles.grid2,
  };

  const gridStyle = columnMap[columns] || gridStyles.grid4;

  const handleAddToCart = (product) => {
    if (product) {
      addToCart(product, 1);
      setToast(`${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = (product) => {
    if (product) {
      const isAdded = toggleWishlist(product);
      const message = isAdded 
        ? `${product.name} added to wishlist!`
        : `${product.name} removed from wishlist`;
      setToast(message);
    }
  };

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div style={gridStyle} className={className} data-product-grid>
        {products.map((product, index) => (
          <div
            key={product._id || product.id || product.product_id}
            className="product-card-wrapper"
            style={{
              animation: 'slideUp 0.6s ease-out backwards',
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <ProductCard
              {...product}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isInWishlist(product._id || product.id || product.product_id)}
            />
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          [data-product-grid] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          [data-product-grid] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          [data-product-grid] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
