'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button, Badge, Breadcrumb, QtyBox, Avatar } from '@/components/ui';
import { ProductGrid } from '@/components/products';

const detailStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'start',
    marginTop: '20px',
  },
  gallery: {
    fontSize: '120px',
    height: '320px',
    backgroundColor: 'var(--sage-100)',
    borderRadius: 'var(--radius-m)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    lineHeight: 1,
  },
  thumbs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  thumb: {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    backgroundColor: 'var(--sage-100)',
    border: '2px solid var(--line)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  category: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--green-700)',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    color: 'var(--green-900)',
    margin: '0 0 8px',
    lineHeight: 1.2,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--green-700)',
  },
  oldPrice: {
    fontSize: '14px',
    textDecoration: 'line-through',
    color: 'var(--charcoal-60)',
  },
  description: {
    fontSize: '13px',
    color: 'var(--charcoal-60)',
    lineHeight: 1.8,
    marginBottom: '18px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '18px',
    alignItems: 'center',
  },
  badge: {
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
    padding: '6px 12px',
    borderRadius: '999px',
    fontWeight: 600,
    display: 'inline-block',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    margin: '24px 0',
  },
  tabs: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--line)',
    margin: '38px 0 18px',
    fontSize: '13px',
  },
  tab: {
    paddingBottom: '12px',
    color: 'var(--charcoal-60)',
    cursor: 'pointer',
    background: 'none',
    fontSize: '13px',
    fontWeight: 500,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: 'var(--green-700)',
    fontWeight: 600,
    borderBottom: '2px solid var(--green-700)',
    paddingBottom: '10px',
  },
  reviewRow: {
    display: 'flex',
    gap: '14px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--line)',
    marginBottom: '20px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  reviewAuthor: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--green-900)',
  },
  reviewDate: {
    fontSize: '11px',
    color: 'var(--charcoal-60)',
  },
  relatedProducts: {
    marginTop: '40px',
  },
};

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        // Fetch product by ID or product_id
        const response = await fetch(`/api/products/${slug}`);
        
        if (!response.ok) {
          const text = await response.text();
          console.error('API error response:', text);
          throw new Error(`API error: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Invalid content type:', contentType);
          console.error('Response text:', text.substring(0, 500));
          throw new Error(`Invalid content type: ${contentType}`);
        }
        
        const data = await response.json();

        if (data.success && data.product) {
          const fetchedProduct = data.product;
          setProduct(fetchedProduct);

          // Fetch related products from same category
          const relatedResponse = await fetch(
            `/api/products?category=${encodeURIComponent(fetchedProduct.category)}&limit=4`
          );
          
          if (!relatedResponse.ok) {
            console.error('Failed to fetch related products');
            return;
          }
          
          const relatedData = await relatedResponse.json();

          if (relatedData.success && Array.isArray(relatedData.products)) {
            const filtered = relatedData.products.filter((p) => p._id !== fetchedProduct._id);
            setRelatedProducts(filtered.slice(0, 4));
          }
        } else {
          console.error('Invalid API response:', data);
        }
      } catch (error) {
        console.error('Error fetching product:', error.message || error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <LayoutWrapper>
        <Section>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--charcoal-60)' }}>Loading product...</p>
          </div>
        </Section>
      </LayoutWrapper>
    );
  }

  if (!product) {
    return (
      <LayoutWrapper>
        <Section>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔍</div>
            <h2 style={{ color: 'var(--green-900)', marginBottom: '6px' }}>Product not found</h2>
            <p style={{ color: 'var(--charcoal-60)', marginBottom: '20px' }}>
              The product you're looking for doesn't exist.
            </p>
            <Link href="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </Section>
      </LayoutWrapper>
    );
  }

  const mockReviews = [
    {
      author: 'Priya K.',
      rating: 5,
      comment: 'Excellent product. Highly recommended!',
      date: '2 weeks ago',
    },
    {
      author: 'Ruwan D.',
      rating: 4,
      comment: 'Good quality and value for money.',
      date: '1 month ago',
    },
  ];

  return (
    <LayoutWrapper>
      <Section>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { href: '/', label: 'Home' },
            { href: '/shop', label: 'Shop' },
            { href: '/shop', label: product.category },
            { label: product.name },
          ]}
        />
        {/* Product Grid */}
        <div style={detailStyles.grid}>
          {/* Gallery */}
          <div>
            <div style={detailStyles.gallery}>🌿</div>
            <div style={detailStyles.thumbs}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={detailStyles.thumb}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--green-700)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          </div>
          {/* Details */}
          <div>
            <div style={detailStyles.category}>{product.category}</div>
            <h1 style={detailStyles.title}>{product.name}</h1>
            <div style={{ color: 'var(--gold)', fontSize: '14px', margin: '4px 0 12px' }}>
              {'★'.repeat(Math.floor(product.rating || 4.5))}
              {'☆'.repeat(5 - Math.floor(product.rating || 4.5))} &nbsp;{(product.rating || 4.5).toFixed(1)} (
              {product.reviewCount || 0} reviews)
            </div>
            <div style={detailStyles.priceRow}>
              <span style={detailStyles.price}>Rs. {product.price.toLocaleString()}</span>
            </div>
            <p style={detailStyles.description}>{product.name}</p>
            {product.inStock ? (
              <div style={detailStyles.badge}>✓ In Stock</div>
            ) : (
              <div style={{ ...detailStyles.badge, background: '#F5DCDC', color: 'var(--danger)' }}>
                Out of Stock
              </div>
            )}
            <div style={detailStyles.qtyRow}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Quantity:</span>
              <QtyBox value={quantity} onChange={setQuantity} />
              <span style={{ fontSize: '12px', color: 'var(--charcoal-60)' }}>
                {product.inStock ? `${product.stock_quantity || 100} available` : 'Currently unavailable'}
              </span>
            </div>
            <div style={detailStyles.buttonRow}>
              <Button variant="primary" disabled={!product.inStock}>
                Add to Cart
              </Button>
              <span
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
              >
                {isWishlisted ? '♥' : '♡'}
              </span>
            </div>
            {/* Tabs */}
            <div style={detailStyles.tabs}>
              {['benefits', 'details'].map((tab) => (
                <button
                  key={tab}
                  style={{
                    ...detailStyles.tab,
                    ...(activeTab === tab ? detailStyles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div style={{ fontSize: '13px', color: 'var(--charcoal-60)', lineHeight: 1.8, marginTop: '16px' }}>
              {activeTab === 'benefits' && (
                <ul style={{ paddingLeft: '20px' }}>
                  {(product.product_benefits || []).map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'details' && (
                <div>
                  <p><strong>Product ID:</strong> {product.product_id}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Availability:</strong> {product.availability}</p>
                  <p><strong>Stock:</strong> {product.stock_quantity} units</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      {/* Reviews Section */}
      <Section title="Customer Reviews" subtitle={`${product.reviewCount || 0} verified reviews`}>
        {mockReviews.map((review, idx) => (
          <div key={idx} style={detailStyles.reviewRow}>
            <Avatar size="sm" initials={review.author.charAt(0)} />
            <div style={{ flex: 1 }}>
              <div style={detailStyles.reviewHeader}>
                <span style={detailStyles.reviewAuthor}>{review.author}</span>
                <span style={detailStyles.reviewDate}>{review.date}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '6px' }}>
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--charcoal-60)', margin: 0 }}>{review.comment}</p>
            </div>
          </div>
        ))}
      </Section>
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section title="Related Products" subtitle={`More from ${product.category}`} style={detailStyles.relatedProducts}>
          <ProductGrid products={relatedProducts} columns={4} />
        </Section>
      )}
    </LayoutWrapper>
  );
}
