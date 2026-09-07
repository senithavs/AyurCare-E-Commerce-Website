'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button, Badge, Breadcrumb, QtyBox, Avatar } from '@/components/ui';
import { ProductGrid } from '@/components/products';

// Mock product database - replace with API call
const mockProducts = {
  'ashwagandha-capsules': {
    id: 1,
    slug: 'ashwagandha-capsules',
    image: '🌿',
    category: 'Herbal Supplements',
    name: 'Ashwagandha Capsules — 60ct',
    rating: 4.3,
    reviewCount: 128,
    price: 1450.00,
    oldPrice: 1700,
    discount: '-15%',
    inStock: true,
    stockCount: 42,
    description:
      'Traditionally used to support stress response and vitality, our Ashwagandha capsules are made from root extract standardized for potency and purity, free from synthetic additives.',
    longDescription: `Ashwagandha is one of the most revered herbs in Ayurvedic medicine. Our premium Ashwagandha capsules are carefully sourced and formulated to provide maximum potency and bioavailability.

Key Benefits:
• Supports natural stress response
• Promotes mental clarity and focus
• Enhances overall vitality and energy
• Supports healthy sleep patterns
• Boosts immune system function

Our Ashwagandha extract is standardized for withanolides, the key active compounds. Each capsule contains a potent dose designed to deliver consistent results.`,
    ingredients: [
      'Ashwagandha Root Extract (500mg)',
      'Vegetable Capsule Shell',
      'Microcrystalline Cellulose',
      'Magnesium Stearate',
    ],
    dosage: 'Take 1-2 capsules daily with warm milk or water, preferably in the evening.',
    usage: 'For best results, use consistently for 4-8 weeks. Can be taken year-round.',
  },
  'bhringraj-hair-oil': {
    id: 2,
    slug: 'bhringraj-hair-oil',
    image: '🧴',
    category: 'Ayurvedic Oils',
    name: 'Bhringraj Hair Oil — 100ml',
    rating: 5,
    reviewCount: 94,
    price: 980.00,
    inStock: true,
    stockCount: 28,
    description: 'Strengthen and nourish hair with this traditional Ayurvedic oil blend.',
    longDescription: `Bhringraj, known as the "king of oils for the hair," has been used for centuries in Ayurveda. Our premium Bhringraj oil is blended with coconut oil and other nourishing herbs.

Key Benefits:
• Promotes healthy hair growth
• Strengthens hair roots
• Reduces hair fall and premature graying
• Nourishes scalp deeply
• Adds natural shine and luster`,
    ingredients: [
      'Coconut Oil (base)',
      'Bhringraj Extract',
      'Brahmi Extract',
      'Sesame Oil',
      'Herbal blend',
    ],
    dosage: 'Apply to hair and scalp, massage for 10-15 minutes.',
    usage: 'Use 2-3 times per week for best results.',
  },
  'chamomile-wellness-tea': {
    id: 3,
    slug: 'chamomile-wellness-tea',
    image: '🍵',
    category: 'Organic Teas',
    name: 'Chamomile Wellness Tea',
    rating: 4,
    reviewCount: 67,
    price: 650.00,
    inStock: true,
    stockCount: 35,
    description: 'Soothing chamomile tea for relaxation and peaceful sleep.',
    longDescription: `Our organic Chamomile tea is sourced from premium herb gardens. Chamomile has been used for centuries to promote relaxation and restful sleep.

Key Benefits:
• Promotes relaxation and calmness
• Supports healthy sleep cycles
• Soothes digestive discomfort
• Rich in antioxidants
• Naturally caffeine-free`,
    ingredients: [
      'Organic Chamomile Flowers',
      'Organic Lemongrass',
    ],
    dosage: 'Steep 1 tea bag in hot water for 5-7 minutes.',
    usage: 'Drink 1-2 cups daily, preferably in the evening.',
  },
  'neem-turmeric-face-wash': {
    id: 4,
    slug: 'neem-turmeric-face-wash',
    image: '✨',
    category: 'Natural Skincare',
    name: 'Neem & Turmeric Face Wash',
    rating: 5,
    reviewCount: 210,
    price: 890.00,
    oldPrice: 990,
    discount: '-10%',
    inStock: true,
    stockCount: 50,
    description: 'Purifying face wash with natural neem and turmeric.',
    longDescription: `This gentle yet effective face wash combines the antibacterial properties of neem with the anti-inflammatory power of turmeric.

Key Benefits:
• Gently removes impurities
• Reduces acne and blemishes
• Brightens and evens skin tone
• Soothes irritated skin
• Suitable for all skin types`,
    ingredients: [
      'Neem Extract',
      'Turmeric Extract',
      'Honey',
      'Aloe Vera',
    ],
    dosage: 'Use morning and evening with lukewarm water.',
    usage: 'Massage gently on face, then rinse thoroughly.',
  },
  'triphala-tablets': {
    id: 5,
    slug: 'triphala-tablets',
    image: '🌿',
    category: 'Herbal Supplements',
    name: 'Triphala Tablets',
    rating: 4,
    reviewCount: 80,
    price: 720.00,
    inStock: true,
    stockCount: 40,
    description: 'Traditional Ayurvedic formula for digestive health.',
    longDescription: `Triphala is a cornerstone of Ayurvedic medicine, combining three powerful fruits for optimal digestive and detox support.

Key Benefits:
• Supports healthy digestion
• Gentle natural detoxification
• Promotes regular elimination
• Strengthens immune system
• Improves nutrient absorption`,
    ingredients: [
      'Amalaki (Indian Gooseberry)',
      'Bibhitaki (Beleric Myrobalan)',
      'Haritaki (Chebulic Myrobalan)',
    ],
    dosage: 'Take 1-2 tablets with warm water before bedtime.',
    usage: 'Use daily for best results. Safe for long-term use.',
  },
  'sesame-body-oil': {
    id: 6,
    slug: 'sesame-body-oil',
    image: '🧴',
    category: 'Ayurvedic Oils',
    name: 'Sesame Body Oil',
    rating: 5,
    reviewCount: 45,
    price: 640.00,
    inStock: true,
    stockCount: 32,
    description: 'Warming sesame oil for deep nourishment and relaxation.',
    longDescription: `Pure organic sesame oil infused with warming Ayurvedic herbs. Perfect for massage and daily skincare.

Key Benefits:
• Deep moisturizes skin
• Warming and grounding
• Supports circulation
• Reduces muscle tension
• Nourishes joints`,
    ingredients: [
      'Organic Sesame Oil',
      'Ginger Extract',
      'Black Cumin',
    ],
    dosage: 'Warm oil and massage into skin or use for Abhyanga massage.',
    usage: 'Use daily or 3-4 times weekly for best benefits.',
  },
  'tulsi-green-tea': {
    id: 7,
    slug: 'tulsi-green-tea',
    image: '🍵',
    category: 'Organic Teas',
    name: 'Tulsi Green Tea',
    rating: 4,
    reviewCount: 60,
    price: 590,
    inStock: true,
    stockCount: 38,
    description: 'Sacred Tulsi blended with green tea for immunity and clarity.',
    longDescription: `Holy Basil (Tulsi) combined with green tea creates a powerful wellness beverage. Tulsi is known as the "elixir of life" in Ayurveda.

Key Benefits:
• Boosts immune system
• Enhances mental clarity
• Reduces stress and anxiety
• Rich in antioxidants
• Supports respiratory health`,
    ingredients: [
      'Organic Tulsi Leaves',
      'Organic Green Tea',
      'Lemongrass',
    ],
    dosage: 'Steep 1 tea bag for 5-7 minutes in hot water.',
    usage: 'Drink 1-2 cups daily.',
  },
  'sandalwood-face-pack': {
    id: 8,
    slug: 'sandalwood-face-pack',
    image: '✨',
    category: 'Natural Skincare',
    name: 'Sandalwood Face Pack',
    rating: 5,
    reviewCount: 120,
    price: 850,
    inStock: true,
    stockCount: 45,
    description: 'Luxurious sandalwood powder for radiant, glowing skin.',
    longDescription: `Premium sandalwood powder blended with cooling herbs. This traditional face pack reveals bright, glowing skin.

Key Benefits:
• Reveals radiant complexion
• Cools and soothes skin
• Reduces blemishes and marks
• Anti-aging properties
• Suitable for all skin types`,
    ingredients: [
      'Sandalwood Powder',
      'Rose Petals',
      'Mint Powder',
      'Honey',
    ],
    dosage: 'Mix 1-2 tablespoons with rose water to form paste.',
    usage: 'Apply to face, leave for 15-20 minutes, then rinse with cool water.',
  },
};

const relatedProducts = [
  { id: 1, image: '🌿', name: 'Brahmi Capsules', price: 1200, slug: 'brahmi-capsules' },
  { id: 2, image: '🌿', name: 'Shatavari Powder', price: 950, slug: 'shatavari-powder' },
  { id: 3, image: '🌿', name: 'Triphala Tablets', price: 720, slug: 'triphala-tablets' },
  { id: 4, image: '🌿', name: 'Moringa Capsules', price: 890, slug: 'moringa-capsules' },
];

const mockReviews = [
  {
    author: 'Priya K.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Noticeably calmer sleep within two weeks of daily use. Highly recommend!',
  },
  {
    author: 'Ruwan D.',
    rating: 4,
    date: '1 month ago',
    comment: 'Good quality, packaging could be more compact. Works well.',
  },
  {
    author: 'Amara S.',
    rating: 5,
    date: '2 months ago',
    comment: 'Excellent product. Natural ingredients and very effective. Will buy again!',
  },
];

const detailStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '44px',
  },
  gallery: {
    height: '400px',
    borderRadius: 'var(--radius-m)',
    background: 'linear-gradient(135deg,#DCE9DC,#B9CBB6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '80px',
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
    border: '2px solid var(--line)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  title: {
    fontSize: '28px',
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
    flexWrap: 'wrap',
  },
  price: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--green-900)',
  },
  stockPill: {
    fontSize: '11px',
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
    flexWrap: 'wrap',
  },
  tabs: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--line)',
    margin: '38px 0 18px',
    fontSize: '13px',
    overflowX: 'auto',
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
    padding: '16px 0',
    borderBottom: '1px solid var(--line)',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
};

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const product = mockProducts[slug];
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <LayoutWrapper>
        <Section>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ color: 'var(--green-900)' }}>Product not found</h2>
            <p style={{ color: 'var(--charcoal-60)' }}>The product you're looking for doesn't exist.</p>
            <Link href="/shop">
              <Button variant="primary">Back to Shop</Button>
            </Link>
          </div>
        </Section>
      </LayoutWrapper>
    );
  }

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
        <div style={detailStyles.grid} data-product-detail-grid>
          {/* Gallery */}
          <div>
            <div style={detailStyles.gallery} data-product-gallery>{product.image}</div>
            <div style={detailStyles.thumbs} data-product-thumbs>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={detailStyles.thumb}
                  data-product-thumb
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
            <h1 style={detailStyles.title} data-product-title>{product.name}</h1>
            <div style={{ color: 'var(--gold)', fontSize: '14px', margin: '4px 0 12px' }}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))} &nbsp;{product.rating} ({product.reviewCount}{' '}
              reviews)
            </div>

            <div style={detailStyles.priceRow}>
              <span style={detailStyles.price} data-product-price>Rs. {product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span style={{ fontSize: '14px', color: 'var(--charcoal-60)', textDecoration: 'line-through' }}>
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
              {product.discount && <Badge variant="pending">{product.discount}</Badge>}
            </div>

            {product.inStock ? (
              <div style={{ ...detailStyles.stockPill, marginBottom: '20px' }}>
                ● In Stock — {product.stockCount} units available
              </div>
            ) : (
              <div style={{ ...detailStyles.stockPill, background: '#F5DCDC', color: 'var(--danger)', marginBottom: '20px' }}>
                Out of Stock
              </div>
            )}

            <div style={detailStyles.qtyRow}>
              <QtyBox value={qty} onChange={setQty} max={product.stockCount} />
              <Button variant="primary" disabled={!product.inStock}>
                Add to Cart
              </Button>
              <Button variant="gold" disabled={!product.inStock}>
                Buy Now
              </Button>
              <span
                role="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
              >
                {isWishlisted ? '♥' : '♡'}
              </span>
            </div>

            {/* Tabs */}
            <div style={detailStyles.tabs} data-product-tabs>
              {['description', 'ingredients', 'dosage', 'usage'].map((tab) => (
                <button
                  key={tab}
                  style={{
                    ...detailStyles.tab,
                    ...(activeTab === tab ? detailStyles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(tab)}
                  data-product-tab
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
                <div>
                  <div style={{ color: 'var(--gold)', fontSize: '12px', marginBottom: '2px' }}>
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green-900)' }}>
                    {review.author}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--charcoal-60)' }}>{review.date}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--charcoal-60)', marginTop: '6px' }}>
                {review.comment}
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* Related Products */}
      <Section title="Related Products">
        <ProductGrid
          products={relatedProducts.map((p) => ({
            ...p,
            category: 'Supplements',
            rating: 4.5,
            reviewCount: 0,
          }))}
          columns={4}
        />
      </Section>

      {/* Responsive Styles */}
      <style>{`
        /* TABLET: 768px */
        @media (max-width: 768px) {
          [data-product-detail-grid] {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          [data-product-gallery] {
            height: 340px !important;
            font-size: 64px !important;
          }
          [data-product-title] {
            font-size: 22px !important;
          }
          [data-product-price] {
            font-size: 22px !important;
          }
          [data-product-tabs] {
            gap: 16px !important;
          }
          [data-product-tab] {
            font-size: 12px !important;
            padding-bottom: 10px !important;
          }
        }

        /* MOBILE: 480px */
        @media (max-width: 480px) {
          [data-product-gallery] {
            height: 280px !important;
            font-size: 48px !important;
          }
          [data-product-title] {
            font-size: 18px !important;
            margin: 0 0 4px !important;
          }
          [data-product-category] {
            font-size: 9px !important;
          }
          [data-product-price] {
            font-size: 20px !important;
          }
          [data-product-description] {
            font-size: 12px !important;
            margin: 0 0 16px !important;
          }
          [data-product-tabs] {
            gap: 12px !important;
            margin: 24px 0 12px !important;
          }
          [data-product-tab] {
            font-size: 11px !important;
            padding-bottom: 8px !important;
          }
          [data-product-thumbs] {
            gap: 6px !important;
          }
          [data-product-thumb] {
            width: 48px !important;
            height: 48px !important;
          }
        }

        /* SMALL MOBILE: < 375px */
        @media (max-width: 374px) {
          [data-product-gallery] {
            height: 240px !important;
            font-size: 40px !important;
          }
          [data-product-title] {
            font-size: 16px !important;
          }
          [data-product-price] {
            font-size: 18px !important;
          }
        }
      `}</style>
    </LayoutWrapper>
  );
}
