import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters for filtering and search
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');

    // Build filter object - only fetch customers, exclude admins
    let filter = { role: 'customer' };

    if (searchQuery) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { username: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    // Fetch customers only
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Get total customer count
    const totalCount = await User.countDocuments({ role: 'customer' });

    return Response.json({
      success: true,
      users,
      count: users.length,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return Response.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent deletion of admin users
    const user = await User.findById(userId);
    if (user?.role === 'admin') {
      return Response.json(
        { success: false, error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return Response.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
