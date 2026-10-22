#!/usr/bin/env node

import mongoose from 'mongoose';
import Category from '../src/lib/models/Category.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:123@cluster0.lwyh57h.mongodb.net/?appName=Cluster0';

async function cleanupTestCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete test categories
    const testCategories = ['Test Category', 'bla bla', 'brocode', 'fsdsfdsf'];
    
    for (const name of testCategories) {
      const result = await Category.deleteOne({ name });
      if (result.deletedCount > 0) {
        console.log(`Deleted: ${name}`);
      }
    }

    // Verify cleanup
    const categories = await Category.find().lean();
    console.log('\nRemaining categories:');
    categories.forEach((cat) => {
      console.log(`  - ${cat.name}`);
    });

    await mongoose.disconnect();
    console.log('\nCleanup complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupTestCategories();
