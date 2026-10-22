require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  icon: {
    type: String,
    default: '📦',
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  productCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

let Category;
try {
  Category = mongoose.model('Category');
} catch {
  Category = mongoose.model('Category', categorySchema);
}

const categories = [
  {
    name: 'Herbal Supplements',
    icon: '🌱',
    description: 'Natural herbal supplements for wellness',
  },
  {
    name: 'Ayurvedic Oils',
    icon: '🧴',
    description: 'Authentic ayurvedic oils for healing',
  },
  {
    name: 'Natural Skincare',
    icon: '✨',
    description: 'Natural and organic skincare products',
  },
  {
    name: 'Organic Teas',
    icon: '🍵',
    description: 'Organic herbal and medicinal teas',
  },
];

async function seedCategories() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`✅ Successfully seeded ${result.length} categories`);

    result.forEach((cat) => {
      console.log(`   • ${cat.icon} ${cat.name}`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    process.exit(1);
  }
}

seedCategories();
