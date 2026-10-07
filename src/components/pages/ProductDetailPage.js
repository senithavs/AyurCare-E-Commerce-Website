'use client';

import { useState } from 'react';
import { Section } from '@/components/layout';
import { Button, Badge, Breadcrumb, QtyBox, Avatar } from '@/components/ui';
import { ProductGrid } from '@/components/products';

const detailStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '44px',
  },
  gallery: {
    height: '340px',
    borderRadius: 'var(--radius-m)',
    background: 'linear-gradient(135deg,#DCE9DC,#B9CBB6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
  },
  thumbs: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  thumb: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    background: 'var(--sage-100)',
    border: '1px solid var(--line)',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    color: 'var(--green-900)',
    margin: '0 0 6px',
    fontWeight: 600,
  },
  category: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--sage)',
    fontWeight: 700,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '14px 0',
  },
  price: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--green-900)',
  },
  stockPill: {
    fontSize: '11px',
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
    padding: '4px 10px',
    borderRadius: '999px',
    fontWeight: 600,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    margin: '20px 0',
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
  },
  tabActive: {
    color: 'var(--green-700)',
    fontWeight: 600,
    borderBottom: '2px solid var(--green-700)',
    paddingBottom: '10px',
  },
};

const mockProduct = {
  id: 1,
  category: 'Herbal Supplements',
  name: 'Ashwagandha Capsules — 60ct',
  rating: 4.3,
  reviewCount: 128,
  price: 1450,
  oldPrice: 1700,
  discount: '-15%',
  stock: 42,
  description:
    'Traditionally used to support stress response and vitality, our Ashwagandha capsules are made from root extract standardized for potency and purity, free from synthetic additives.',
};

const mockReviews = [
  {
    author: 'Priya K.',
    rating: 5,
    comment: 'Noticeably calmer sleep within two weeks of daily use.',
  },
  {
    author: 'Ruwan D.',
    rating: 4,
    comment: 'Good quality, packaging could be more compact.',
  },
];

const mockRelatedProducts = [
  { id: 1, image: '🌿', name: 'Brahmi Capsules', price: 1200 },
  { id: 2, image: '🌿', name: 'Shatavari Powder', price: 950 },
  { id: 3, image: '🌿', name: 'Triphala Tablets', price: 720 },
  { id: 4, image: '🌿', name: 'Moringa Capsules', price: 890 },
];

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div>
      <Section>
        <Breadcrumb
          items={[
            { href: '/', label: 'Home' },
            { href: '/shop', label: 'Shop' },
            { href: '/shop?cat=supplements', label: 'Supplements' },
            { label: mockProduct.name },
          ]}
        />

        <div style={detailStyles.grid}>
          {/* Gallery */}
          <div>
            <div style={detailStyles.gallery}>{mockProduct.image || '🌿'}</div>
            <div style={detailStyles.thumbs}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={detailStyles.thumb} />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={detailStyles.category}>{mockProduct.category}</div>
            <h1 style={detailStyles.title}>{mockProduct.name}</h1>
            <div style={{ color: 'var(--gold)', fontSize: '14px', margin: '4px 0' }}>
              ★★★★☆ &nbsp;{mockProduct.rating} ({mockProduct.reviewCount} reviews)
            </div>

            <div style={detailStyles.priceRow}>
              <span style={detailStyles.price}>Rs. {mockProduct.price.toLocaleString()}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--charcoal-60)', textDecoration: 'line-through' }}>
                Rs. {mockProduct.oldPrice.toLocaleString()}
              </span>
              <Badge variant="pending">{mockProduct.discount}</Badge>
            </div>

            <div style={detailStyles.stockPill}>● In Stock — {mockProduct.stock} units</div>

            <div style={detailStyles.qtyRow}>
              <QtyBox value={qty} onChange={setQty} />
              <Button variant="primary">Add to Cart</Button>
              <Button variant="gold">Buy Now</Button>
              <span style={{ fontSize: '20px', cursor: 'pointer' }}>♡</span>
            </div>

            {/* Tabs */}
            <div style={detailStyles.tabs}>
              {['description', 'ingredients', 'benefits', 'usage'].map((tab) => (
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

            <p style={{ fontSize: '12.5px', color: 'var(--charcoal-60)', lineHeight: 1.8 }}>
              {mockProduct.description}
            </p>
          </div>
        </div>
      </Section>

      {/* Reviews */}
      <Section title="Customer Reviews">
        {mockReviews.map((review, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '14px',
              padding: '16px 0',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <Avatar size="sm" initials={review.author.charAt(0)} />
            <div>
              <div style={{ color: 'var(--gold)', fontSize: '12px' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, margin: '4px 0' }}>
                {review.author}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--charcoal-60)' }}>
                {review.comment}
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* Related Products */}
      <Section title="Related Products">
        <ProductGrid
          products={mockRelatedProducts.map((p) => ({ ...p, category: 'Supplements', rating: 4.5, reviewCount: 0 }))}
          columns={4}
        />
      </Section>
    </div>
  );
}
