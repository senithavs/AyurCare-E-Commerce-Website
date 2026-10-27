'use client';

import CategoryCard from './CategoryCard';

export default function CategoryGrid({
  categories = [],
  onCategoryClick,
  className = '',
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  };

  return (
    <div style={gridStyle} className={className} data-category-grid>
      {categories.map((category) => (
        <CategoryCard
          key={category._id || category.id}
          icon={category.icon}
          image={category.image}
          name={category.name}
          onClick={() => onCategoryClick?.(category._id || category.id)}
        />
      ))}

      <style>{`
        @media (max-width: 1024px) {
          [data-category-grid] {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 768px) {
          [data-category-grid] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 480px) {
          [data-category-grid] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
