import productsJson from '../../docs/ayurvedic_products.json';

// Deterministic rating/review based on product ID (consistent between server/client)
function getDeterministicRating(productId) {
  // Use product ID to generate consistent value
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 4 + (hash % 10) / 10; // Rating between 4.0-4.9
}

function getDeterministicReviewCount(productId) {
  // Use product ID to generate consistent review count
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((hash * 7) % 150) + 30; // Review count between 30-180
}

function getDeterministicStockCount(productId, inStock) {
  if (!inStock) return 0;
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((hash * 3) % 50) + 10; // Stock between 10-60
}

// Transform product data to match component requirements
export function transformProduct(product) {
  // Create slug from product name or ID
  const slug = product.product_id.toLowerCase().replace('ayu-', 'product-');
  const inStock = product.availability === 'In Stock';
  
  return {
    id: product.product_id,
    slug,
    name: product.name_en || product.name,
    category: product.category,
    price: product.price,
    oldPrice: product.price * 1.15, // Add 15% as original price for discount display
    discount: '-13%',
    rating: getDeterministicRating(product.product_id),
    reviewCount: getDeterministicReviewCount(product.product_id),
    inStock,
    stockCount: getDeterministicStockCount(product.product_id, inStock),
    image: '🌿', // Default emoji - can be customized per category
    availability: product.availability,
    description: `High-quality ${product.name_en || product.name}. ` + 
                 (product.product_benefits ? product.product_benefits[0] : 'Premium Ayurvedic product'),
    longDescription: `Premium ${product.name_en || product.name} sourced from authentic Ayurvedic suppliers.

Key Benefits:
${product.product_benefits ? product.product_benefits.map(b => `• ${b}`).join('\n') : '• Premium quality\n• Authentic ingredients\n• Trusted Ayurvedic formula'}

This traditional Ayurvedic product is carefully formulated to deliver maximum potency and effectiveness.`,
    ingredients: [
      `${product.name_en || product.name}`,
      'Premium natural ingredients',
      'No artificial additives',
      'Traditionally prepared',
    ],
    dosage: 'Follow package instructions or consult an Ayurvedic practitioner.',
    usage: 'Use consistently for best results. Can be used as part of daily wellness routine.',
    productImage: product.product_image?.image_url || null,
  };
}

// Get emoji based on category
function getCategoryEmoji(category) {
  const emojiMap = {
    'Herbal Supplements': '🌿',
    'Ayurvedic Oils': '🧴',
    'Natural Skincare': '✨',
    'Organic Teas': '🍵',
    'Personal Care': '🧼',
    'Wellness Kits': '🕉️',
  };
  return emojiMap[category] || '🌿';
}

// Get all products
export function getAllProducts() {
  return productsJson.map(p => ({
    ...transformProduct(p),
    image: getCategoryEmoji(p.category),
  }));
}

// Get product by slug
export function getProductBySlug(slug) {
  const products = getAllProducts();
  return products.find(p => p.slug === slug);
}

// Get products by category
export function getProductsByCategory(category) {
  return getAllProducts().filter(p => p.category === category);
}

// Get featured products (first 4, in stock)
export function getFeaturedProducts(limit = 4) {
  return getAllProducts()
    .filter(p => p.inStock)
    .slice(0, limit);
}

// Get all unique categories
export function getCategories() {
  const categories = new Set(productsJson.map(p => p.category));
  return Array.from(categories);
}

// Create mock reviews for a product (deterministic based on productId)
export function getMockReviews(productId, count = 5) {
  const reviews = [];
  const names = ['Priya', 'Rajesh', 'Amelia', 'Deepak', 'Sneha', 'Vikram', 'Neha'];
  const comments = [
    'Excellent product! Highly recommended.',
    'Great quality and fast delivery.',
    'Works as described. Very satisfied.',
    'Amazing results! Will buy again.',
    'Best Ayurvedic product I\'ve tried.',
  ];

  // Use product ID hash for deterministic values
  const hash = String(productId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < count; i++) {
    const nameIndex = (hash + i) % names.length;
    const commentIndex = (hash + i * 2) % comments.length;
    const rating = ((hash + i * 3) % 2) + 4; // 4-5 stars
    const daysAgo = ((hash + i * 4) % 30) + 1;

    reviews.push({
      author: names[nameIndex],
      rating,
      comment: comments[commentIndex],
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  }

  return reviews;
}
