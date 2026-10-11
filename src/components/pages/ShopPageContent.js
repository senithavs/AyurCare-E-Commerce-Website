'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Section } from '@/components/layout';
import { ProductGrid, CategoryGrid } from '@/components/products';
import { Chip, FormField, Pagination } from '@/components/ui';
import { EmptyState } from '@/components/utility';

const shopStyles = {
  shopBody: {
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    gap: '28px',
    position: 'relative',
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
    gap: '12px',
  },
  selectMini: {
    border: '1px solid var(--line)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
  },
  filterSidebar: {
    position: 'sticky',
    top: 0,
    height: 'fit-content',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  filterToggleButton: {
    display: 'none',
    background: 'var(--green-700)',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '16px',
    width: '100%',
  },
  filterPanel: {
    background: '#fff',
    borderRadius: '8px',
    border: '1px solid var(--line)',
    padding: '16px',
    marginBottom: '16px',
  },
};

const PRODUCTS_PER_PAGE = 12;

export default function ShopPageContent() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    availability: ['In Stock'],
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setFilterOpen(false); // Close filter panel on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products and categories from database on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch products
        const productsResponse = await fetch('/api/products');
        
        if (!productsResponse.ok) {
          const text = await productsResponse.text();
          console.error('Products API error response:', text);
          throw new Error(`Products API error: ${productsResponse.status}`);
        }
        
        const contentType = productsResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await productsResponse.text();
          console.error('Invalid content type:', contentType);
          console.error('Response text:', text.substring(0, 500));
          throw new Error(`Invalid content type: ${contentType}`);
        }
        
        const productsData = await productsResponse.json();

        if (productsData.success && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else {
          console.error('Invalid API response structure:', productsData);
          setProducts([]);
        }

        // Fetch categories from database
        const categoriesResponse = await fetch('/api/categories');
        
        if (!categoriesResponse.ok) {
          console.error('Categories API error:', categoriesResponse.status);
          throw new Error(`Categories API error: ${categoriesResponse.status}`);
        }

        const categoriesData = await categoriesResponse.json();

        if (categoriesData.success && Array.isArray(categoriesData.categories)) {
          // Extract category names from the categories objects
          const categoryNames = categoriesData.categories.map((cat) => cat.name);
          setCategories(categoryNames);
        } else {
          console.error('Invalid categories API response:', categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-filter by category if passed in URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedFilters((prev) => ({
        ...prev,
        category: [categoryParam],
      }));
      setCurrentPage(1);
    }
  }, [searchParams]);

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
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Render filter section (category and availability only)
  const FilterSection = () => (
    <>
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
    </>
  );

  return (
    <Section title="All Products">
      <div style={shopStyles.shopBody} data-shop-body>
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <div style={shopStyles.filterSidebar}>
            {/* Search Bar - Desktop */}
            <div style={{ marginBottom: '24px' }}>
              <FormField
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <FilterSection />
          </div>
        )}

        {/* Mobile: Search Bar + Filter Toggle */}
        {isMobile && (
          <div style={{ marginBottom: '16px' }} data-mobile-controls>
            {/* Search Bar - Mobile */}
            <div style={{ marginBottom: '12px' }}>
              <FormField
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              style={{
                ...shopStyles.filterToggleButton,
                display: 'block',
              }}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {filterOpen ? '✕ Hide Filters' : 'Show Filters'}
            </button>
          </div>
        )}

        {/* Mobile Filter Panel */}
        {isMobile && filterOpen && (
          <div style={shopStyles.filterPanel}>
            <FilterSection />
          </div>
        )}

        {/* Products Area */}
        <div data-products-area>
          <div style={shopStyles.toolbarRow}>
            <span>Showing {displayStart}–{displayEnd} of {sortedProducts.length}</span>
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
          ) : isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--charcoal-60)' }}>Loading products...</p>
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="No products found"
              description={searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}
            />
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-shop-body] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          [data-products-area] {
            width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          [data-shop-body] {
            gap: 12px !important;
          }
        }
      `}</style>
    </Section>
  );
}
