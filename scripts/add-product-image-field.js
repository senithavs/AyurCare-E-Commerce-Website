/**
 * Migration script: Add product_image field to products that don't have it
 * Run with: node scripts/add-product-image-field.js
 */

const mongoose = require('mongoose');
const Product = require('../src/lib/models/Product').default;

async function migrateProductImages() {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    }

    // Find products without product_image field
    const productsWithoutImage = await Product.find({ 
      product_image: { $exists: false } 
    });

    console.log(`Found ${productsWithoutImage.length} products without product_image field`);

    if (productsWithoutImage.length === 0) {
      console.log('All products already have product_image field!');
      await mongoose.disconnect();
      return;
    }

    // Update all products without product_image field
    const result = await Product.updateMany(
      { product_image: { $exists: false } },
      { 
        $set: { 
          product_image: {
            image_id: null,
            image_url: null
          }
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} products with product_image field`);
    console.log(`Matched ${result.matchedCount} products`);

    // Verify the update
    const verifyCount = await Product.countDocuments({ 
      product_image: { $exists: false } 
    });

    console.log(`Remaining products without product_image: ${verifyCount}`);

    if (verifyCount === 0) {
      console.log('✓ Migration completed successfully!');
    } else {
      console.log('⚠ Some products still missing product_image field');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrateProductImages();
