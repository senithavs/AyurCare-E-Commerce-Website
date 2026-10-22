/**
 * User Sign Up API
 * POST /api/auth/signup
 * 
 * Creates a new user account in MongoDB with hashed password
 */

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/password';

export async function POST(request) {
  try {
    await dbConnect();

    const { username, email, password, name } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email or username already registered' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: await hashPassword(password), // Hash password before saving
      name,
      role: 'customer',
      isActive: true,
    });

    await newUser.save();

    console.log('New user created:', {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });

    // Return user data (without password)
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create account' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
