'use client';

import { Hero, Section } from '@/components/layout';
import {
  ProductGrid,
  CategoryGrid,
  FeatureGrid,
  PromoCard,
} from '@/components/products';
import { getFeaturedProducts } from '@/lib/productsData';
import { useAdmin } from '@/lib/AdminContext';

const mockProducts = getFeaturedProducts(8);

const mockFeatures = [
  {
    icon: '🌿',
    title: 'Authentic Products',
    description: 'Sourced directly from certified Ayurvedic manufacturers.',
  },
  {
    icon: '🍃',
    title: 'Natural Ingredients',
    description: 'No synthetic fillers — plant-based formulations only.',
  },
  {
    icon: '🛡️',
    title: 'Trusted Quality',
    description: 'Every batch tested for purity and potency.',
  },
  {
    icon: '🚚',
    title: 'Convenient Shopping',
    description: 'Fast, tracked delivery across the island.',
  },
];

export default function HomePage() {
  const { categories } = useAdmin();
  const displayCategories = categories && categories.length > 0 ? categories : getDefaultCategories();

  return (
    <div>
      {/* Hero Section */}
      <Hero
        badge="100% Authentic Ayurveda"
        title="Nature's Wisdom Delivered to Your Door."
        description="AyurCare brings authentic Ayurvedic and herbal wellness products, oils, teas and skincare — sourced for purity and backed by tradition."
        ctaButtons={[
          { label: 'Shop Now', variant: 'gold' },
          { label: 'Explore Categories', variant: 'green' },
        ]}
      />

      {/* Categories Section */}
      <Section title="Shop by Category" subtitle={`${displayCategories.length} collections`}>
        <CategoryGrid categories={displayCategories} />
      </Section>

      {/* Featured Products */}
      <Section title="Featured Products" subtitle="Bestsellers this month">
        <ProductGrid products={mockProducts} columns={4} />
      </Section>

      {/* Features Section */}
      <Section title="Why Choose AyurCare">
        <FeatureGrid features={mockFeatures} />
      </Section>

      {/* Promo Banner */}
      <Section>
        <PromoCard
          title="Immunity Season Bundle"
          description="Save 20% on curated wellness kits — this week only."
          buttonLabel="Shop Now"
        />
      </Section>
    </div>
  );
}

// Default categories fallback
function getDefaultCategories() {
  return [
    { id: 1, icon: '🌱', name: 'Herbal Supplements' },
    { id: 2, icon: '🧴', name: 'Ayurvedic Oils' },
    { id: 3, icon: '✨', name: 'Natural Skincare' },
    { id: 4, icon: '🍵', name: 'Organic Teas' },
    { id: 5, icon: '🧼', name: 'Personal Care' },
    { id: 6, icon: '🕉️', name: 'Wellness Kits' },
  ];
}
