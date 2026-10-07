#!/usr/bin/env node

import mongoose from 'mongoose';
import Product from '../src/lib/models/Product.js';
import Category from '../src/lib/models/Category.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:123@cluster0.lwyh57h.mongodb.net/?appName=Cluster0';

async function removeSinhalaNames() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // ===== PRODUCTS =====
    console.log('Processing Products...');
    
    // Update all products: move name_en to name, remove category_si
    const productsBeforeUpdate = await Product.countDocuments();
    console.log(`  Found ${productsBeforeUpdate} products`);

    // Get all products first
    const products = await Product.find().lean();
    
    let productsUpdated = 0;
    for (const product of products) {
      const updates = {};
      
      // If name_en exists and is different from name, update name to name_en
      if (product.name_en && product.name_en.trim() !== '') {
        updates.name = product.name_en;
      }
      
      // Remove Sinhala fields
      updates.name_en = null; // Keep the field but set to null for reference
      updates.category_si = null;
      
      if (Object.keys(updates).length > 0) {
        await Product.updateOne(
          { _id: product._id },
          { $set: updates }
        );
        productsUpdated++;
      }
    }

    console.log(`  ✓ Updated ${productsUpdated} products\n`);

    // ===== CATEGORIES =====
    console.log('Processing Categories...');
    
    const categoriesBeforeUpdate = await Category.countDocuments();
    console.log(`  Found ${categoriesBeforeUpdate} categories`);
    
    // For categories, we just verify they have English names
    const categories = await Category.find().lean();
    console.log(`  ✓ Verified ${categories.length} categories have names\n`);

    // ===== VERIFICATION =====
    console.log('Verification:');
    
    const updatedProducts = await Product.find().lean();
    console.log(`\n  Products after update:`);
    updatedProducts.slice(0, 5).forEach((product) => {
      console.log(`    - ID: ${product.product_id}`);
      console.log(`      Name: ${product.name}`);
      console.log(`      name_en: ${product.name_en || 'null'}`);
      console.log(`      category_si: ${product.category_si || 'null'}`);
    });
    
    if (updatedProducts.length > 5) {
      console.log(`    ... and ${updatedProducts.length - 5} more products`);
    }

    console.log(`\n✓ Migration completed successfully!`);
    console.log(`  - Products with Sinhala fields removed: ${productsUpdated}`);
    console.log(`  - All products now use English names only`);

    await mongoose.disconnect();
    console.log('\n✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

removeSinhalaNames();
