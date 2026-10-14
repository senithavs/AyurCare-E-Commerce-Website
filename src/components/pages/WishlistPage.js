'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { EmptyState } from '@/components/utility';
import { useWishlist } from '@/lib/WishlistContext';
import { useCart } from '@/lib/CartContext';
import { Toast } from '@/components/utility';

const wishlistStyles = {
  container: {
    margin: '24px 0',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 120px 120px',
    gap: '16px',
    padding: '14px 0',
    borderBottom: '1px solid var(--line)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--green-900)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 120px 120px',
    gap: '16px',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid var(--line)',
  },
  productImage: {
    fontSize: '40px',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--sage-100)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  productName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-900)',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      color: 'var(--green-700)',
    },
  },
  productCategory: {
    fontSize: '12px',
    color: 'var(--charcoal-60)',
  },
  price: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--green-700)',
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
};

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setToast(`${product.name} added to cart!`);
  };

  const handleRemove = (product) => {
    const productId = product._id || product.id || product.product_id;
    removeFromWishlist(productId);
    setToast('Item removed from wishlist');
  };

  if (wishlistItems.length === 0) {
    return (
        <Section>
          <EmptyState
            icon="♡"
            title="Your wishlist is empty"
            description="Save your favorite products to view them later."
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </Section>

    );
  }

  return (
      <Section title="My Wishlist" subtitle={`${wishlistItems.length} items`}>
        <div style={wishlistStyles.container}>
          <div style={wishlistStyles.tableHeader}>
            <div>Product</div>
            <div></div>
            <div>Price</div>
            <div>Action</div>
          </div>

          {wishlistItems.map((item) => {
            const itemKey = item._id || item.id || item.product_id;
            const imageLoaded = imageLoadStates[itemKey];
            const hasImageUrl = item.product_image?.image_url;
            const hasError = imageLoadStates[`${itemKey}_error`];
            
            return (
            <div key={itemKey} style={wishlistStyles.tableRow}>
              <div style={wishlistStyles.productImage}>
                {hasImageUrl && !hasError ? (
                  <>
                    <img
                      src={item.product_image.image_url}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: imageLoaded ? 'block' : 'none',
                      }}
                      onLoad={() => setImageLoadStates(prev => ({ ...prev, [itemKey]: true }))}
                      onError={() => setImageLoadStates(prev => ({ ...prev, [`${itemKey}_error`]: true }))}
                    />
                    {!imageLoaded && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{item.image || '🌿'}</span>}
                  </>
                ) : (
                  <span>{item.image || '🌿'}</span>
                )}
              </div>
              <div style={wishlistStyles.productInfo}>
                <Link href={`/shop/${item.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={wishlistStyles.productName}>{item.name}</div>
                </Link>
                <div style={wishlistStyles.productCategory}>{item.category}</div>
              </div>
              <div style={wishlistStyles.price}>Rs. {item.price.toLocaleString()}</div>
              <div style={wishlistStyles.actions}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
                <button
                  style={wishlistStyles.removeBtn}
                  onClick={() => handleRemove(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F5DCDC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </Section>
  );
}
