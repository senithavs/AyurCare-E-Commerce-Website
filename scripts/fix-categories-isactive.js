#!/usr/bin/env node

import mongoose from 'mongoose';
import Category from '../src/lib/models/Category.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:123@cluster0.lwyh57h.mongodb.net/?appName=Cluster0';

async function fixCategoriesIsActive() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all categories with null or missing isActive to true
    const result = await Category.updateMany(
      { isActive: { $in: [null, undefined] } },
      { isActive: true }
    );

    console.log(`Updated ${result.modifiedCount} categories with isActive: true`);

    // Verify the update
    const categories = await Category.find().lean();
    console.log('\nAll categories:');
    categories.forEach((cat) => {
      console.log(`  - ${cat.name}: isActive=${cat.isActive}`);
    });

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCategoriesIsActive();
