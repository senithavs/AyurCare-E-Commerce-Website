/**
 * Check Email Availability API
 * POST /api/auth/check-email
 */

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    return new Response(
      JSON.stringify({ exists: !!user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Check email error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
