'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { LayoutWrapper, Section } from '@/components/layout';
import { Button, Badge, Breadcrumb, QtyBox, Avatar } from '@/components/ui';
import { ProductGrid } from '@/components/products';
import { useAuth } from '@/lib/AuthContext';
import { useWishlist } from '@/lib/WishlistContext';

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
    overflow: 'hidden',
    position: 'relative',
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
  const { user, isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('benefits');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

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

          // Fetch reviews for this product
          const reviewsResponse = await fetch(
            `/api/reviews?product_id=${encodeURIComponent(fetchedProduct.product_id)}&limit=10`
          );

          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            if (reviewsData.success) {
              setReviews(reviewsData.reviews);
            }
          }

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

  const handleSubmitReview = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setSubmitMessage({
          type: 'error',
          text: 'Please sign in to submit a review',
        });
        return;
      }

      if (!reviewForm.comment.trim()) {
        setSubmitMessage({
          type: 'error',
          text: 'Please enter a comment',
        });
        return;
      }

      setSubmittingReview(true);
      setSubmitMessage(null);

      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.product_id,
          customer_id: user.id || user._id,
          customer_name: user.name || user.username || 'Anonymous',
          customer_email: user.email,
          rating: reviewForm.rating,
          title: reviewForm.title || `${reviewForm.rating} Star Review`,
          comment: reviewForm.comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Failed to submit review',
        });
        console.error('Review submission error:', data);
        return;
      }

      // Add new review to list
      setReviews([data.review, ...reviews]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      
      setSubmitMessage({
        type: 'success',
        text: '✓ Review submitted successfully!',
      });

      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to submit review: ' + error.message,
      });
    } finally {
      setSubmittingReview(false);
    }
  };

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
            <div style={detailStyles.gallery}>
              {product.product_image?.image_url && !imageError ? (
                <img
                  src={product.product_image.image_url}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: imageLoaded ? 'block' : 'none',
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(false);
                  }}
                />
              ) : null}
              {!imageLoaded || imageError ? (
                <span>🌿</span>
              ) : null}
            </div>
          </div>
          {/* Details */}
          <div>
            <div style={detailStyles.category}>{product.category}</div>
            <h1 style={detailStyles.title}>{product.name}</h1>
            <div style={{ color: 'var(--gold)', fontSize: '14px', margin: '4px 0 12px' }}>
              {'★'.repeat(Math.floor(product.rating || 4.5))}
              {'☆'.repeat(5 - Math.floor(product.rating || 4.5))} &nbsp;{(product.rating || 4.5).toFixed(1)} (
              {reviews.length} reviews)
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
              {product.stock_quantity < 10 && product.inStock && (
                <span style={{ fontSize: '12px', color: 'var(--charcoal-60)' }}>
                  {product.stock_quantity} available
                </span>
              )}
              {!product.inStock && (
                <span style={{ fontSize: '12px', color: 'var(--charcoal-60)' }}>
                  Currently unavailable
                </span>
              )}
            </div>
            <div style={detailStyles.buttonRow}>
              <Button variant="primary" disabled={!product.inStock}>
                Add to Cart
              </Button>
              <span
                onClick={() => toggleWishlist(product)}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  color: isInWishlist(product._id || product.id || product.product_id) ? 'var(--danger)' : 'var(--charcoal-60)',
                }}
              >
                {isInWishlist(product._id || product.id || product.product_id) ? '♥' : '♡'}
              </span>
            </div>
            {/* Tabs */}
            <div style={detailStyles.tabs}>
              {['benefits'].map((tab) => (
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
                <>
                  {(product.product_benefits || []).length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {product.product_benefits.map((benefit, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--charcoal-60)' }}>No benefits information available.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
      {/* Reviews Section */}
      <Section title="Customer Reviews" subtitle={`${reviews.length} reviews`}>
        {/* Submit Message */}
        {submitMessage && (
          <div style={{
            background: submitMessage.type === 'success' ? '#D4EDDA' : '#F8D7DA',
            border: `1px solid ${submitMessage.type === 'success' ? '#C3E6CB' : '#F5C6CB'}`,
            color: submitMessage.type === 'success' ? '#155724' : '#721C24',
            padding: '14px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            {submitMessage.text}
          </div>
        )}
        {!isAuthenticated ? (
          <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid var(--line)',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--charcoal-60)', marginBottom: '12px' }}>
              Please sign in to write a review
            </p>
            <Link href="/signin">
              <Button variant="primary">Sign In</Button>
            </Link>
          </div>
        ) : !showReviewForm ? (
          <Button 
            variant="primary" 
            onClick={() => setShowReviewForm(true)}
            style={{ marginBottom: '24px' }}
          >
            + Write a Review
          </Button>
        ) : (
          <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid var(--line)',
          }}>
            <h3 style={{ marginTop: 0, color: 'var(--green-900)' }}>Share Your Review</h3>
            
            {/* Rating */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Rating
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      opacity: star <= reviewForm.rating ? 1 : 0.3,
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Review Title (Optional)
              </label>
              <input
                type="text"
                placeholder="Summarize your experience"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Comment */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Your Review *
              </label>
              <textarea
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewForm({ rating: 5, title: '', comment: '' });
                }}
                disabled={submittingReview}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} style={detailStyles.reviewRow}>
              <Avatar size="sm" initials={review.customer_name.charAt(0)} />
              <div style={{ flex: 1 }}>
                <div style={detailStyles.reviewHeader}>
                  <span style={detailStyles.reviewAuthor}>{review.customer_name}</span>
                  <span style={detailStyles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '6px' }}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                  <span style={{ marginLeft: '8px', color: 'var(--charcoal-60)' }}>
                    {review.title}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--charcoal-60)', margin: 0 }}>
                  {review.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--charcoal-60)' }}>
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
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
