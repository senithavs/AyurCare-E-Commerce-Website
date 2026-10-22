/**
 * Create Review API
 * POST /api/reviews/create - Submit a new product review
 */

import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import Product from '@/lib/models/Product';

export async function POST(request) {
  try {
    await dbConnect();

    const {
      product_id,
      customer_id,
      customer_name,
      customer_email,
      rating,
      title,
      comment,
    } = await request.json();

    // Validate required fields
    if (!product_id || !customer_id || !customer_name || !customer_email || !rating || !comment) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rating must be between 1 and 5',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if product exists
    const product = await Product.findOne({ product_id });
    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Product not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if customer already reviewed this product
    const existingReview = await Review.findOne({
      product_id,
      customer_id,
    });

    if (existingReview) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'You have already reviewed this product',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new review
    const review = new Review({
      product_id,
      customer_id,
      customer_name,
      customer_email,
      rating,
      title: title || `${rating} Star Review`,
      comment,
      status: 'approved', // Store all reviews
    });

    await review.save();

    // Update product rating and review count
    const allReviews = await Review.find({
      product_id,
      status: 'approved',
    });

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.updateOne(
      { product_id },
      {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: allReviews.length,
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        review: review.toObject(),
        message: 'Review submitted successfully',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create review error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: 'Failed to submit review',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
