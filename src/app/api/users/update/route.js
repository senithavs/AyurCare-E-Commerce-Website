import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PUT(request) {
  try {
    await dbConnect();

    const { id, ...updates } = await request.json();

    if (!id) {
      return Response.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Don't allow updating password or email through this endpoint
    const { password, email, username, ...safeUpdates } = updates;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...safeUpdates, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
