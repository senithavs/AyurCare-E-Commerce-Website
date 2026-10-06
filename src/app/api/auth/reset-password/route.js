/**
 * Reset Password API (Forgot Password)
 * POST /api/auth/reset-password
 */

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/password';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Email and new password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No account found with this email' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update password with hashing
    user.password = await hashPassword(newPassword);
    await user.save();

    console.log('Password reset for user:', email);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password reset successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to reset password' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
