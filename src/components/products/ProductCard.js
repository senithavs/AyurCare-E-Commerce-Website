'use client';

import { Button, Badge } from '@/components/ui';

const productCardStyles = {
  card: {
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-m)',
    overflow: 'hidden',
    background: '#fff',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  photo: {
    height: '150px',
    position: 'relative',
    background: 'linear-gradient(135deg,#DCE9DC,#B9CBB6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '34px',
  },
  wishlistDot: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    boxShadow: '0 2px 6px rgba(0,0,0,.12)',
    cursor: 'pointer',
  },
  discountTag: {
    position: 'absolute',
    top: '10px',
    left: '10px',
  },
  body: {
    padding: '14px',
  },
  category: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--sage)',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  name: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--green-900)',
    margin: '5px 0 4px',
  },
  stars: {
    color: 'var(--gold)',
    fontSize: '11px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '8px 0 12px',
  },
  price: {
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--green-900)',
  },
  oldPrice: {
    fontSize: '11.5px',
    color: 'var(--charcoal-60)',
    textDecoration: 'line-through',
  },
};

export default function ProductCard({
  id,
  image = '🌿',
  category = 'Supplements',
  name = 'Product Name',
  rating = 4.5,
  reviewCount = 0,
  price = 0,
  oldPrice,
  discount,
  inStock = true,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
}) {
  return (
    <div style={productCardStyles.card}>
      {/* Product Photo */}
      <div style={productCardStyles.photo}>
        {discount && (
          <Badge variant="pending" style={productCardStyles.discountTag}>
            {discount}
          </Badge>
        )}
        <button
          style={productCardStyles.wishlistDot}
          onClick={() => onWishlistToggle?.(id)}
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
        {image}
      </div>

      {/* Product Info */}
      <div style={productCardStyles.body}>
        <div style={productCardStyles.category}>{category}</div>
        <div style={productCardStyles.name}>{name}</div>

        {/* Rating */}
        <div style={productCardStyles.stars}>
          ★★★★☆ {reviewCount > 0 && `(${reviewCount})`}
        </div>

        {/* Price */}
        <div style={productCardStyles.priceRow}>
          <span style={productCardStyles.price}>Rs. {price.toLocaleString()}</span>
          {oldPrice && (
            <span style={productCardStyles.oldPrice}>Rs. {oldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="ghost"
          size="sm"
          block
          onClick={() => onAddToCart?.(id)}
          disabled={!inStock}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}
