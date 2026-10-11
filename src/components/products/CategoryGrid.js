'use client';

import CategoryCard from './CategoryCard';

export default function CategoryGrid({
  categories = [],
  onCategoryClick,
  className = '',
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
  };

  return (
    <div style={gridStyle} className={className} data-category-grid>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          icon={category.icon}
          name={category.name}
          onClick={() => onCategoryClick?.(category.id)}
        />
      ))}

      <style>{`
        @media (max-width: 1024px) {
          [data-category-grid] {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 768px) {
          [data-category-grid] {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          [data-category-grid] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
