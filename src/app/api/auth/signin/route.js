/**
 * User Sign In API
 * POST /api/auth/signin
 * 
 * Authenticates user and returns session token
 */

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyPassword } from '@/lib/password';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check password using bcrypt verification
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return new Response(
        JSON.stringify({ error: 'User account is inactive' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('User logged in:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Return user data (without password)
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
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
