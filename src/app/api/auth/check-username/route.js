/**
 * Check Username Availability API
 * POST /api/auth/check-username
 */

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const { username } = await request.json();

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    return new Response(
      JSON.stringify({ exists: !!user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Check username error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check username' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
