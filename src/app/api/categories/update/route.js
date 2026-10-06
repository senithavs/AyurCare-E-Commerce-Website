import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';

export async function PUT(request) {
  try {
    await dbConnect();

    const { id, name, icon, image, description } = await request.json();

    if (!id) {
      return Response.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return Response.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return Response.json(
        { success: false, error: 'Category name already exists' },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        icon: icon || '📦',
        image,
        description,
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!updatedCategory) {
      return Response.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      category: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}
