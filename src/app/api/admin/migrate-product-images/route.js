/**
 * Admin API to migrate product_image field
 * POST /api/admin/migrate-product-images
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function POST(request) {
  try {
    await dbConnect();

    // Find products without product_image field
    const productsWithoutImage = await Product.find({ 
      product_image: { $exists: false } 
    });

    console.log(`Found ${productsWithoutImage.length} products without product_image field`);

    if (productsWithoutImage.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All products already have product_image field',
          migratedCount: 0,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
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

    // Verify the update
    const verifyCount = await Product.countDocuments({ 
      product_image: { $exists: false } 
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration completed successfully',
        migratedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
        remainingWithoutImage: verifyCount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Migration failed',
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
