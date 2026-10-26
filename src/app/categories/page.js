'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutWrapper, Section } from '@/components/layout';
import { CategoryGrid } from '@/components/products';

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (category) {
      // Navigate to shop page with category filter
      router.push(`/shop?category=${encodeURIComponent(category.name)}`);
    }
  };

  return (
    <LayoutWrapper>
      <Section title="Shop by Category" subtitle="Browse our collections">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--charcoal-60)' }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--charcoal-60)' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏷️</div>
            <p>No categories available yet</p>
          </div>
        ) : (
          <CategoryGrid 
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        )}
      </Section>
    </LayoutWrapper>
  );
}
