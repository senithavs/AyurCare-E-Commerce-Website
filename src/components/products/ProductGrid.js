'use client';

import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  columns = 4,
  onAddToCart,
  onWishlistToggle,
  className = '',
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
    gap: '20px',
  };

  return (
    <>
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
      <style>{`
        @media (max-width: 1200px) {
          [data-product-grid] {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }
        @media (max-width: 768px) {
          [data-product-grid] {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
          }
        }
        @media (max-width: 480px) {
          [data-product-grid] {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
