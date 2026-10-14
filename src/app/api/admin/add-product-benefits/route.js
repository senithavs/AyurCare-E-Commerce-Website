/**
 * Admin API to add benefits to products that don't have them
 * POST /api/admin/add-product-benefits
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// Default benefits based on product categories and keywords
const defaultBenefitsByCategory = {
  'Natural Skincare': [
    'Natural ingredients',
    'Gentle on skin',
    'Promotes skin health'
  ],
  'Hair Care': [
    'Strengthens hair',
    'Promotes growth',
    'Reduces hair fall'
  ],
  'Supplements': [
    'Supports immunity',
    'Promotes wellness',
    'Natural nutrition'
  ],
  'Oils': [
    'Deep nourishment',
    'Therapeutic benefits',
    'Aromatic relief'
  ],
  'Herbs': [
    'Medicinal properties',
    'Traditional wellness',
    'Natural healing'
  ],
};

// Get benefits based on product name keywords
function getBenefitsByProductName(name, category) {
  const nameUpper = name.toUpperCase();
  
  if (nameUpper.includes('DETOX')) {
    return ['Detoxification', 'Cleansing', 'Wellness support'];
  }
  if (nameUpper.includes('OIL')) {
    return ['Nourishing', 'Therapeutic massage', 'Skin & body care'];
  }
  if (nameUpper.includes('SOAP')) {
    return ['Gentle cleansing', 'Natural moisturizing', 'Skin protection'];
  }
  if (nameUpper.includes('TEA')) {
    return ['Immune support', 'Relaxation', 'Wellness boost'];
  }
  if (nameUpper.includes('BALM')) {
    return ['Protection', 'Healing', 'Nourishing care'];
  }
  if (nameUpper.includes('PASTE')) {
    return ['Daily wellness', 'Natural support', 'Health benefit'];
  }
  if (nameUpper.includes('HONEY')) {
    return ['Energy boost', 'Natural sweetness', 'Health benefits'];
  }
  if (nameUpper.includes('SUPPLEMENT')) {
    return ['Nutritional support', 'Wellness enhancement', 'Natural strength'];
  }
  
  // Use category defaults
  return defaultBenefitsByCategory[category] || ['Wellness support', 'Natural benefits', 'Quality product'];
}

export async function POST(request) {
  try {
    await dbConnect();

    // Find all products
    const products = await Product.find({});
    
    let updatedCount = 0;
    const updates = [];
    
    for (const product of products) {
      // Check if product has no benefits or empty benefits array
      if (!product.product_benefits || product.product_benefits.length === 0) {
        // Get suitable benefits based on product name and category
        const benefits = getBenefitsByProductName(product.name, product.category);
        
        product.product_benefits = benefits;
        await product.save();
        updatedCount++;
        
        updates.push({
          product_id: product.product_id,
          name: product.name,
          benefits: benefits
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product benefits added successfully',
        updatedCount,
        updates: updates.slice(0, 10), // Return first 10 for preview
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Add product benefits error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to add product benefits',
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
