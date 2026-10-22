/**
 * Admin API to fix corrupted product image URLs
 * POST /api/admin/fix-product-images
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function POST(request) {
  try {
    await dbConnect();

    // Find products with corrupted URLs (containing multiple URLs or invalid patterns)
    const products = await Product.find({});
    
    let fixedCount = 0;
    
    for (const product of products) {
      if (product.product_image?.image_url) {
        const url = product.product_image.image_url;
        
        // Check if URL is corrupted (contains multiple URLs concatenated)
        // or ends with an invalid pattern
        if (
          url.includes('https://') && 
          url.indexOf('https://') !== url.lastIndexOf('https://')
        ) {
          // Extract the valid Supabase URL (the first one)
          const validUrl = url.substring(0, url.lastIndexOf('.jpeg') + 5);
          
          product.product_image.image_url = validUrl;
          await product.save();
          fixedCount++;
          
          console.log(`Fixed ${product.product_id}: ${validUrl}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product image URLs fixed',
        fixedCount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Fix product images error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to fix product images',
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
