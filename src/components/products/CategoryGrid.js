'use client';

import CategoryCard from './CategoryCard';

export default function CategoryGrid({
  categories = [],
  onCategoryClick,
  className = '',
}) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
  };

  return (
    <>
      <div style={gridStyle} className={className}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={category.icon}
            name={category.name}
            onClick={() => onCategoryClick?.(category.id)}
          />
        ))}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          [data-category-grid] {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
        }
        @media (max-width: 768px) {
          [data-category-grid] {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          [data-category-grid] {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}
