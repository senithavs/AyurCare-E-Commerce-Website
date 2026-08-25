'use client';

import { useState } from 'react';
import { Section } from '@/components/layout';
import { ProductGrid, CategoryGrid } from '@/components/products';
import { Chip, FormField, Pagination } from '@/components/ui';
import { EmptyState } from '@/components/utility';

const shopStyles = {
  shopBody: {
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    gap: '28px',
  },
  filterBlock: {
    marginBottom: '22px',
  },
  filterTitle: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--green-900)',
    marginBottom: '10px',
  },
  filterChipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  toolbarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    fontSize: '12.5px',
    color: 'var(--charcoal-60)',
  },
  selectMini: {
    border: '1px solid var(--line)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
  },
};

const mockProducts = [
  { id: 1, image: '🌿', category: 'Supplements', name: 'Triphala Tablets', rating: 4, reviewCount: 80, price: 720 },
  { id: 2, image: '🧴', category: 'Oils', name: 'Sesame Body Oil', rating: 5, reviewCount: 45, price: 640 },
  { id: 3, image: '🍵', category: 'Teas', name: 'Tulsi Green Tea', rating: 4, reviewCount: 60, price: 590 },
  { id: 4, image: '✨', category: 'Skincare', name: 'Sandalwood Face Pack', rating: 5, reviewCount: 120, price: 850 },
];

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    category: ['All'],
    benefit: [],
    availability: ['In Stock'],
  });

  const handleFilterToggle = (filterType, value) => {
    setSelectedFilters((prev) => {
      const current = prev[filterType] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [filterType]: current.filter((f) => f !== value),
        };
      } else {
        return {
          ...prev,
          [filterType]: [...current, value],
        };
      }
    });
  };

  return (
    <Section title="All Products">
      <div style={shopStyles.shopBody}>
        {/* Filters Sidebar */}
        <div>
          <FormField
            type="text"
            placeholder="Search products…"
            style={{ marginBottom: '24px' }}
          />

          {/* Category Filter */}
          <div style={shopStyles.filterBlock}>
            <div style={shopStyles.filterTitle}>Category</div>
            <div style={shopStyles.filterChipRow}>
              {['All', 'Supplements', 'Oils', 'Skincare', 'Teas'].map((cat) => (
                <Chip
                  key={cat}
                  active={selectedFilters.category.includes(cat)}
                  onClick={() => handleFilterToggle('category', cat)}
                >
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          {/* Health Benefit Filter */}
          <div style={shopStyles.filterBlock}>
            <div style={shopStyles.filterTitle}>Health Benefit</div>
            <div style={shopStyles.filterChipRow}>
              {['Immunity', 'Sleep', 'Skin', 'Digestion'].map((benefit) => (
                <Chip
                  key={benefit}
                  active={selectedFilters.benefit.includes(benefit)}
                  onClick={() => handleFilterToggle('benefit', benefit)}
                >
                  {benefit}
                </Chip>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div style={shopStyles.filterBlock}>
            <div style={shopStyles.filterTitle}>Availability</div>
            <div style={shopStyles.filterChipRow}>
              {['In Stock', 'Pre-order'].map((avail) => (
                <Chip
                  key={avail}
                  active={selectedFilters.availability.includes(avail)}
                  onClick={() => handleFilterToggle('availability', avail)}
                >
                  {avail}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Products Area */}
        <div>
          <div style={shopStyles.toolbarRow}>
            <span>Showing 1–8 of 42 products</span>
            <select style={shopStyles.selectMini}>
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>

          {mockProducts.length > 0 ? (
            <>
              <ProductGrid products={mockProducts} columns={4} />
              <Pagination
                currentPage={currentPage}
                totalPages={3}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon="🔍"
              title="No products found"
              description="Try adjusting your filters"
            />
          )}
        </div>
      </div>
    </Section>
  );
}
