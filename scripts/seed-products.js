/**
 * Script to seed 20 products into MongoDB
 * Ensures at least one product per category
 * 
 * Run with: node scripts/seed-products.js
 */

const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = 'mongodb+srv://admin:123@cluster0.lwyh57h.mongodb.net/?appName=Cluster0';

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    name_en: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    category_si: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Pre-order'],
      default: 'In Stock',
    },
    product_benefits: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    product_image: {
      image_id: String,
      image_url: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    stock_quantity: {
      type: Number,
      default: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// 20 curated products - at least one per category
const productsToSeed = [
  // Herbal Supplements (5 products)
  {
    product_id: 'AYU-001',
    name: 'ත්‍රිඵලා චූර්ණය (100g)',
    name_en: 'Triphala Churna - 100g',
    category: 'Herbal Supplements',
    category_si: 'ඖෂධීය අතිරේක',
    price: 1760.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'සන්ධි සෞඛ්‍යයට හිතකර වේ',
      'ශරීරයේ විෂ ඉවත් කිරීමට සහාය වේ',
      'ආහාර දිරවීමට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-001',
      image_url: 'https://images.example.com/ayurveda/ayu-001.jpg',
    },
    rating: 4.5,
    reviewCount: 24,
    stock_quantity: 150,
  },
  {
    product_id: 'AYU-003',
    name: 'අශ්වගන්ධා කැප්සියුල (100g)',
    name_en: 'Ashwagandha Capsules - 100g',
    category: 'Herbal Supplements',
    category_si: 'ඖෂධීය අතිරේක',
    price: 1660.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ප්‍රතිශක්තිකරණ පද්ධතිය ශක්තිමත් කරයි',
      'සන්ධි සෞඛ්‍යයට හිතකර වේ',
      'ආහාර දිරවීමට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-003',
      image_url: 'https://images.example.com/ayurveda/ayu-003.jpg',
    },
    rating: 4.7,
    reviewCount: 31,
    stock_quantity: 120,
  },
  {
    product_id: 'AYU-005',
    name: 'බ්‍රාහ්මී පෙති (100g)',
    name_en: 'Brahmi Tablets - 100g',
    category: 'Herbal Supplements',
    category_si: 'ඖෂධීය අතිරේක',
    price: 1920.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ආතතිය අවම කිරීමට උපකාරී වේ',
      'ස්වාභාවික ශක්තියක් ලබා දෙයි',
      'ආහාර දිරවීමට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-005',
      image_url: 'https://images.example.com/ayurveda/ayu-005.jpg',
    },
    rating: 4.6,
    reviewCount: 18,
    stock_quantity: 95,
  },
  {
    product_id: 'AYU-009',
    name: 'කොහොඹ කැප්සියුල (100g)',
    name_en: 'Neem Capsules - 100g',
    category: 'Herbal Supplements',
    category_si: 'ඖෂධීය අතිරේක',
    price: 2100.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ස්වාභාවික ශක්තියක් ලබා දෙයි',
      'ආතතිය අවම කිරීමට උපකාරී වේ',
      'ප්‍රතිශක්තිකරණ පද්ධතිය ශක්තිමත් කරයි',
    ],
    product_image: {
      image_id: 'IMG-009',
      image_url: 'https://images.example.com/ayurveda/ayu-009.jpg',
    },
    rating: 4.4,
    reviewCount: 22,
    stock_quantity: 110,
  },
  {
    product_id: 'AYU-011',
    name: 'කහ (කුර්කුමින්) කැප්සියුල (100g)',
    name_en: 'Turmeric Curcumin Capsules - 100g',
    category: 'Herbal Supplements',
    category_si: 'ඖෂධීය අතිරේක',
    price: 1630.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ප්‍රතිශක්තිකරණ පද්ධතිය ශක්තිමත් කරයි',
      'සන්ධි සෞඛ්‍යයට හිතකර වේ',
      'ආහාර දිරවීමට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-011',
      image_url: 'https://images.example.com/ayurveda/ayu-011.jpg',
    },
    rating: 4.8,
    reviewCount: 45,
    stock_quantity: 140,
  },

  // Ayurvedic Oils (5 products)
  {
    product_id: 'AYU-019',
    name: 'තල තෙල් (100ml)',
    name_en: 'Pure Sesame Oil - 100ml',
    category: 'Ayurvedic Oils',
    category_si: 'ආයුර්වේද තෙල්',
    price: 1890.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'සම මෘදු හා පෝෂණය කරයි',
      'හිසේ රුදාව අවම කිරීමට උපකාරී වේ',
      'නින්ද වැඩි දියුණු කිරීමට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-019',
      image_url: 'https://images.example.com/ayurveda/ayu-019.jpg',
    },
    rating: 4.5,
    reviewCount: 35,
    stock_quantity: 200,
  },
  {
    product_id: 'AYU-021',
    name: 'ඖෂධමය පොල් තෙල් (100ml)',
    name_en: 'Herbal Coconut Oil - 100ml',
    category: 'Ayurvedic Oils',
    category_si: 'ආයුර්වේද තෙල්',
    price: 2350.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'සම මෘදු හා පෝෂණය කරයි',
      'රුධිර සංසරණය වැඩි දියුණු කරයි',
      'ශරීර මාංශ පේශි සැහැල්ලු කරයි',
    ],
    product_image: {
      image_id: 'IMG-021',
      image_url: 'https://images.example.com/ayurveda/ayu-021.jpg',
    },
    rating: 4.6,
    reviewCount: 28,
    stock_quantity: 180,
  },
  {
    product_id: 'AYU-023',
    name: 'බ්‍රාහ්මී තෙල් (100ml)',
    name_en: 'Brahmi Oil - 100ml',
    category: 'Ayurvedic Oils',
    category_si: 'ආයුර්වේද තෙල්',
    price: 1230.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'හිසේ රුදාව අවම කිරීමට උපකාරී වේ',
      'සම මෘදු හා පෝෂණය කරයි',
      'හිසකෙස් වර්ධනයට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-023',
      image_url: 'https://images.example.com/ayurveda/ayu-023.jpg',
    },
    rating: 4.7,
    reviewCount: 40,
    stock_quantity: 160,
  },
  {
    product_id: 'AYU-025',
    name: 'කොහොඹ තෙල් (100ml)',
    name_en: 'Neem Oil - 100ml',
    category: 'Ayurvedic Oils',
    category_si: 'ආයුර්වේද තෙල්',
    price: 650.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'හිසකෙස් වර්ධනයට උපකාරී වේ',
      'නින්ද වැඩි දියුණු කිරීමට උපකාරී වේ',
      'රුධිර සංසරණය වැඩි දියුණු කරයි',
    ],
    product_image: {
      image_id: 'IMG-025',
      image_url: 'https://images.example.com/ayurveda/ayu-025.jpg',
    },
    rating: 4.3,
    reviewCount: 19,
    stock_quantity: 175,
  },
  {
    product_id: 'AYU-029',
    name: 'ධන්වන්තරම් තෙල් (100ml)',
    name_en: 'Dhanwantharam Oil - 100ml',
    category: 'Ayurvedic Oils',
    category_si: 'ආයුර්වේද තෙල්',
    price: 1230.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ශරීර මාංශ පේශි සැහැල්ලු කරයි',
      'නින්ද වැඩි දියුණු කිරීමට උපකාරී වේ',
      'හිසකෙස් වර්ධනයට උපකාරී වේ',
    ],
    product_image: {
      image_id: 'IMG-029',
      image_url: 'https://images.example.com/ayurveda/ayu-029.jpg',
    },
    rating: 4.5,
    reviewCount: 26,
    stock_quantity: 145,
  },

  // Natural Skincare (7 products)
  {
    product_id: 'AYU-037',
    name: 'සඳුන් මුහුණු ආලේපය (100g)',
    name_en: 'Sandalwood Face Pack - 100g',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 1880.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ස්වභාවික අමුද්‍රව්‍යවලින් සාදන ලදී',
      'කුරුලෑ හා පැල්ලම් අඩු කරයි',
      'සියලුම සම වර්ග සඳහා සුදුසුයි',
    ],
    product_image: {
      image_id: 'IMG-037',
      image_url: 'https://images.example.com/ayurveda/ayu-037.jpg',
    },
    rating: 4.6,
    reviewCount: 32,
    stock_quantity: 90,
  },
  {
    product_id: 'AYU-038',
    name: 'කහ මුහුණු ක්‍රීම් (50g)',
    name_en: 'Turmeric Face Cream - 50g',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 530.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'සියලුම සම වර්ග සඳහා සුදුසුයි',
      'සමේ දීප්තිය වැඩි කරයි',
      'කුරුලෑ හා පැල්ලම් අඩු කරයි',
    ],
    product_image: {
      image_id: 'IMG-038',
      image_url: 'https://images.example.com/ayurveda/ayu-038.jpg',
    },
    rating: 4.4,
    reviewCount: 15,
    stock_quantity: 200,
  },
  {
    product_id: 'AYU-040',
    name: 'කොහොඹ මුහුණු සෝදනය (100ml)',
    name_en: 'Neem Face Wash - 100ml',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 1640.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'කුරුලෑ හා පැල්ලම් අඩු කරයි',
      'ස්වභාවික අමුද්‍රව්‍යවලින් සාදන ලදී',
      'සියලුම සම වර්ග සඳහා සුදුසුයි',
    ],
    product_image: {
      image_id: 'IMG-040',
      image_url: 'https://images.example.com/ayurveda/ayu-040.jpg',
    },
    rating: 4.5,
    reviewCount: 27,
    stock_quantity: 220,
  },
  {
    product_id: 'AYU-041',
    name: 'රෝස ජලය (ටෝනර්) (200ml)',
    name_en: 'Rose Water Toner - 200ml',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 2840.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'කුරුලෑ හා පැල්ලම් අඩු කරයි',
      'සමේ වයස්ගත වීම මන්දගාමී කරයි',
      'ස්වභාවික අමුද්‍රව්‍යවලින් සාදන ලදී',
    ],
    product_image: {
      image_id: 'IMG-041',
      image_url: 'https://images.example.com/ayurveda/ayu-041.jpg',
    },
    rating: 4.7,
    reviewCount: 38,
    stock_quantity: 130,
  },
  {
    product_id: 'AYU-043',
    name: 'කුංකුමාදි මුහුණු තෙල් (30ml)',
    name_en: 'Kumkumadi Face Oil - 30ml',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 2230.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'සියලුම සම වර්ග සඳහා සුදුසුයි',
      'සමේ දීප්තිය වැඩි කරයි',
      'ස්වභාවික අමුද්‍රව්‍යවලින් සාදන ලදී',
    ],
    product_image: {
      image_id: 'IMG-043',
      image_url: 'https://images.example.com/ayurveda/ayu-043.jpg',
    },
    rating: 4.8,
    reviewCount: 52,
    stock_quantity: 85,
  },
  {
    product_id: 'AYU-046',
    name: 'කහ සබන් (100g)',
    name_en: 'Turmeric Herbal Soap - 100g',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 1250.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'කුරුලෑ හා පැල්ලම් අඩු කරයි',
      'සමේ දීප්තිය වැඩි කරයි',
      'සමේ වයස්ගත වීම මන්දගාමී කරයි',
    ],
    product_image: {
      image_id: 'IMG-046',
      image_url: 'https://images.example.com/ayurveda/ayu-046.jpg',
    },
    rating: 4.4,
    reviewCount: 21,
    stock_quantity: 165,
  },
  {
    product_id: 'AYU-049',
    name: 'කේසර ක්‍රීම් (50g)',
    name_en: 'Saffron Brightening Cream - 50g',
    category: 'Natural Skincare',
    category_si: 'ස්වභාවික සම සත්කාරය',
    price: 2490.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'සමේ වයස්ගත වීම මන්දගාමී කරයි',
      'සමේ දීප්තිය වැඩි කරයි',
      'කුරුලෑ හා පැල්ලම් අඩු කරයි',
    ],
    product_image: {
      image_id: 'IMG-049',
      image_url: 'https://images.example.com/ayurveda/ayu-049.jpg',
    },
    rating: 4.6,
    reviewCount: 41,
    stock_quantity: 75,
  },

  // Organic Teas (3 products)
  {
    product_id: 'AYU-055',
    name: 'ඉඟුරු තේ (50 bags)',
    name_en: 'Ginger Tea - 50 bags',
    category: 'Organic Teas',
    category_si: 'කාබනික තේ',
    price: 960.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ප්‍රතිඔක්සිකාරක වලින් පොහොසත් වේ',
      'ආතතිය අවම කර මනස සන්සුන් කරයි',
      'ආහාර දිරවීමට සහාය වේ',
    ],
    product_image: {
      image_id: 'IMG-055',
      image_url: 'https://images.example.com/ayurveda/ayu-055.jpg',
    },
    rating: 4.5,
    reviewCount: 29,
    stock_quantity: 250,
  },
  {
    product_id: 'AYU-056',
    name: 'තුලසි තේ (50 bags)',
    name_en: 'Tulsi (Holy Basil) Tea - 50 bags',
    category: 'Organic Teas',
    category_si: 'කාබනික තේ',
    price: 1180.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'ප්‍රතිඔක්සිකාරක වලින් පොහොසත් වේ',
      'ශ්වසන පද්ධතිය උසස් කරයි',
      'ආතුරේ ඉක්මවා යනු අවම කරයි',
    ],
    product_image: {
      image_id: 'IMG-056',
      image_url: 'https://images.example.com/ayurveda/ayu-056.jpg',
    },
    rating: 4.6,
    reviewCount: 33,
    stock_quantity: 220,
  },
  {
    product_id: 'AYU-057',
    name: 'පුද්ගල තේ (50 bags)',
    name_en: 'Moringa Tea - 50 bags',
    category: 'Organic Teas',
    category_si: 'කාබනික තේ',
    price: 1350.0,
    currency: 'LKR',
    availability: 'In Stock',
    inStock: true,
    product_benefits: [
      'පෝෂණ වලින් පොහොසත් වේ',
      'ස්වභාවික ශක්තිය ලබා දෙයි',
      'වන්නේ වෛර ශක්තිය පැතිර දෙයි',
    ],
    product_image: {
      image_id: 'IMG-057',
      image_url: 'https://images.example.com/ayurveda/ayu-057.jpg',
    },
    rating: 4.7,
    reviewCount: 36,
    stock_quantity: 190,
  },
];

async function seedProducts() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});

    // Insert new products
    console.log(`\n📦 Seeding ${productsToSeed.length} products...\n`);
    const createdProducts = await Product.insertMany(productsToSeed);

    console.log('✅ Products seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('━'.repeat(60));

    // Group by category
    const categories = {};
    createdProducts.forEach((product) => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Display summary
    for (const [category, products] of Object.entries(categories)) {
      console.log(`\n${category}:`);
      products.forEach((product) => {
        console.log(`  ✓ ${product.name_en} (₹${product.price})`);
      });
      console.log(`  Total: ${products.length} product(s)`);
    }

    console.log('\n' + '━'.repeat(60));
    console.log(`Total Products: ${createdProducts.length}`);
    console.log(`Total Categories: ${Object.keys(categories).length}`);
    console.log('━'.repeat(60) + '\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  } catch (error) {
    console.error('\n❌ Error seeding products:', error.message);
    process.exit(1);
  }
}

seedProducts();
