import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let filter = { isActive: true };

    if (search) {
      filter = {
        ...filter,
        name: { $regex: search, $options: 'i' },
      };
    }

    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const { name, icon, image, description } = await request.json();

    if (!name) {
      return Response.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return Response.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      );
    }

    const category = new Category({
      name,
      icon: icon || '📦',
      image,
      description,
      isActive: true,
    });

    await category.save();
    const savedCategory = category.toObject();

    return Response.json({
      success: true,
      category: savedCategory,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return Response.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return Response.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
