'use client';

import { useRouter } from 'next/navigation';
import { LayoutWrapper, Section } from '@/components/layout';
import { CategoryGrid } from '@/components/products';

const mockCategories = [
  { id: 1, icon: '🌱', name: 'Herbal Supplements' },
  { id: 2, icon: '🧴', name: 'Ayurvedic Oils' },
  { id: 3, icon: '✨', name: 'Natural Skincare' },
  { id: 4, icon: '🍵', name: 'Organic Teas' },
  { id: 5, icon: '🧼', name: 'Personal Care' },
  { id: 6, icon: '🕉️', name: 'Wellness Kits' },
];

export default function Categories() {
  const router = useRouter();

  const handleCategoryClick = (categoryId) => {
    const category = mockCategories.find((cat) => cat.id === categoryId);
    if (category) {
      // Navigate to shop page with category filter
      router.push(`/shop?category=${encodeURIComponent(category.name)}`);
    }
  };

  return (
    <LayoutWrapper>
      <Section title="Shop by Category" subtitle="Browse our collections">
        <CategoryGrid 
          categories={mockCategories}
          onCategoryClick={handleCategoryClick}
        />
      </Section>
    </LayoutWrapper>
  );
}
