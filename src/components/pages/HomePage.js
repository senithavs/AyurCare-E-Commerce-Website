'use client';

import { Hero, Section } from '@/components/layout';
import {
  ProductGrid,
  CategoryGrid,
  FeatureGrid,
  PromoCard,
} from '@/components/products';

const mockCategories = [
  { id: 1, icon: '🌱', name: 'Herbal Supplements' },
  { id: 2, icon: '🧴', name: 'Ayurvedic Oils' },
  { id: 3, icon: '✨', name: 'Natural Skincare' },
  { id: 4, icon: '🍵', name: 'Organic Teas' },
  { id: 5, icon: '🧼', name: 'Personal Care' },
  { id: 6, icon: '🕉️', name: 'Wellness Kits' },
];

const mockProducts = [
  {
    id: 1,
    image: '🌿',
    category: 'Supplements',
    name: 'Ashwagandha Capsules',
    rating: 4.3,
    reviewCount: 128,
    price: 1450,
    oldPrice: 1700,
    discount: '-15%',
    inStock: true,
  },
  {
    id: 2,
    image: '🧴',
    category: 'Oils',
    name: 'Bhringraj Hair Oil',
    rating: 5,
    reviewCount: 94,
    price: 980,
    inStock: true,
  },
  {
    id: 3,
    image: '🍵',
    category: 'Teas',
    name: 'Chamomile Wellness Tea',
    rating: 4,
    reviewCount: 61,
    price: 650,
    inStock: true,
  },
  {
    id: 4,
    image: '✨',
    category: 'Skincare',
    name: 'Neem & Turmeric Face Wash',
    rating: 5,
    reviewCount: 210,
    price: 890,
    oldPrice: 990,
    discount: '-10%',
    inStock: true,
  },
];

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
  return (
    <div>
      {/* Hero Section */}
      <Hero
        badge="100% Authentic Ayurveda"
        title="Nature's Wisdom, Delivered to Your Door."
        description="AyurCare brings authentic Ayurvedic and herbal wellness products — supplements, oils, teas and skincare — sourced for purity and backed by tradition."
        ctaButtons={[
          { label: 'Shop Now', variant: 'gold' },
          { label: 'Explore Categories', variant: 'outline' },
        ]}
      />

      {/* Categories Section */}
      <Section title="Shop by Category" subtitle="6 collections">
        <CategoryGrid categories={mockCategories} />
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
          buttonLabel="Shop the Bundle"
        />
      </Section>
    </div>
  );
}
