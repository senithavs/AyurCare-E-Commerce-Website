'use client';

import { useState } from 'react';
import { Section } from '@/components/layout';
import { ProductGrid, CategoryGrid } from '@/components/products';
import { Chip, FormField, Pagination } from '@/components/ui';
import { EmptyState } from '@/components/utility';
import { getAllProducts, getCategories } from '@/lib/productsData';

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

const PRODUCTS_PER_PAGE = 12;
const mockProducts = getAllProducts();

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    availability: ['In Stock'],
  });

  const categories = getCategories();

  const handleFilterToggle = (filterType, value) => {
    setCurrentPage(1); // Reset to first page when filters change
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

  // Filter products based on search and filters
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilters.category.length === 0 || selectedFilters.category.includes(product.category);
    const matchesAvailability =
      selectedFilters.availability.length === 0 ||
      (selectedFilters.availability.includes('In Stock') && product.inStock) ||
      (selectedFilters.availability.includes('Pre-order') && !product.inStock);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        // Newer products have higher IDs (based on product_id)
        return b.id.localeCompare(a.id);
      case 'featured':
      default:
        // Featured: sort by rating and review count
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Format product count display
  const displayStart = sortedProducts.length > 0 ? startIndex + 1 : 0;
  const displayEnd = Math.min(endIndex, sortedProducts.length);

  return (
    <Section title="All Products">
      <div style={shopStyles.shopBody}>
        {/* Filters Sidebar */}
        <div>
          <FormField
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '24px' }}
          />

          {/* Category Filter */}
          <div style={shopStyles.filterBlock}>
            <div style={shopStyles.filterTitle}>Category</div>
            <div style={shopStyles.filterChipRow}>
              {categories.map((cat) => (
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
            <span>Showing {displayStart}–{displayEnd} of {sortedProducts.length} products</span>
            <select 
              style={shopStyles.selectMini}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Reset to page 1 when sorting changes
              }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} columns={4} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon="🔍"
              title="No products found"
              description={searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}
            />
          )}
        </div>
      </div>
    </Section>
  );
}
