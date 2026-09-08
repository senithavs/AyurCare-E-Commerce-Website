'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button, Badge, Breadcrumb, QtyBox, Avatar } from '@/components/ui';
import { ProductGrid } from '@/components/products';
import { getProductBySlug, getAllProducts, getMockReviews } from '@/lib/productsData';

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
  const product = getProductBySlug(slug);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const mockReviews = getMockReviews(product?.id || 'unknown', 5);

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

  // Get related products (same category)
  const allProducts = getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

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
            <div style={detailStyles.gallery}>{product.image}</div>
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
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))} &nbsp;{product.rating.toFixed(1)} ({product.reviewCount}{' '}
              reviews)
            </div>

            <div style={detailStyles.priceRow}>
              <span style={detailStyles.price}>Rs. {product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <>
                  <span style={detailStyles.oldPrice}>Rs. {product.oldPrice.toLocaleString()}</span>
                  {product.discount && <Badge>{product.discount}</Badge>}
                </>
              )}
            </div>

            <p style={detailStyles.description}>{product.description}</p>

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
                {product.inStock ? `${product.stockCount} available` : 'Currently unavailable'}
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
              {['description', 'ingredients', 'dosage', 'usage'].map((tab) => (
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
              {activeTab === 'description' && <p>{product.longDescription}</p>}
              {activeTab === 'ingredients' && (
                <ul style={{ paddingLeft: '20px' }}>
                  {product.ingredients.map((ingredient, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'dosage' && <p>{product.dosage}</p>}
              {activeTab === 'usage' && <p>{product.usage}</p>}
            </div>
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section title="Customer Reviews" subtitle={`${product.reviewCount} verified reviews`}>
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
