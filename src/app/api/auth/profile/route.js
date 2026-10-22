/**
 * User Profile API
 * GET /api/auth/profile - Get current user profile
 * PATCH /api/auth/profile - Update user profile
 * PUT /api/auth/profile/password - Change password
 */

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyPassword, hashPassword } from '@/lib/password';

/**
 * GET /api/auth/profile
 * Retrieve current user profile by ID
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get userId from query params or headers
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone,
          address: user.address,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PATCH /api/auth/profile
 * Update user profile information
 */
export async function PATCH(request) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    const updates = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Allowed fields to update
    const allowedFields = ['name', 'phone', 'address'];
    const updateData = {};

    for (const field of allowedFields) {
      if (field in updates) {
        updateData[field] = updates[field];
      }
    }

    // Prevent email/username change
    if (updates.email || updates.username) {
      return new Response(
        JSON.stringify({ error: 'Cannot change email or username' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('User profile updated:', userId);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: updatedUser.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PUT /api/auth/profile/password
 * Change user password
 */
export async function PUT(request) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    const { currentPassword, newPassword } = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Current and new passwords are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify current password using bcrypt
    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: 'Current password is incorrect' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update password with hashing
    user.password = await hashPassword(newPassword);
    await user.save();

    console.log('User password changed:', userId);

    return new Response(
      JSON.stringify({ success: true, message: 'Password changed successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to change password' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
