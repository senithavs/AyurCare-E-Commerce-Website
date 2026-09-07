'use client';

import ProductCard from './ProductCard';
import styles from '@/styles/products.module.css';

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
  onAddToCart,
  onWishlistToggle,
  className = '',
}) {
  const columnMap = {
    4: gridStyles.grid4,
    3: gridStyles.grid3,
    2: gridStyles.grid2,
  };

  const gridStyle = columnMap[columns] || gridStyles.grid4;

  return (
    <div style={gridStyle} className={className}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={onAddToCart}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
