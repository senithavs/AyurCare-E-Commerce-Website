'use client';

import CategoryCard from './CategoryCard';
import styles from '@/styles/products.module.css';

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
  );
}
