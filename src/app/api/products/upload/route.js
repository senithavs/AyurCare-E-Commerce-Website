/**
 * Product Image Upload API
 * POST /api/products/upload - Upload product image to Supabase
 * 
 * Expects FormData with:
 * - file: File object (image file)
 * - productId: string (product ID for organizing files)
 */

import { createClient } from '@supabase/supabase-js';

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request) {
  try {
    // Use service role key for server-side uploads
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase credentials:', { supabaseUrl: !!supabaseUrl, serviceRoleKey: !!serviceRoleKey });
      return Response.json(
        { success: false, error: 'Supabase is not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId');

    // Validate inputs
    if (!file) {
      return Response.json(
        { success: false, error: 'File is required' },
        { status: 400 }
      );
    }

    if (!productId) {
      return Response.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength > MAX_FILE_SIZE) {
      return Response.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop();
    const filename = `${productId}_${timestamp}_${randomStr}.${ext}`;
    const filepath = `${productId}/${filename}`;

    console.log('Uploading to Supabase:', { filepath, fileSize: buffer.byteLength, fileType: file.type });

    // Upload to Supabase storage in 'Images' bucket under 'Products' folder
    const { data, error: uploadError } = await supabase.storage
      .from('Images')
      .upload(`Products/${filepath}`, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return Response.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log('Upload successful:', data);

    // Get public URL from 'Images' bucket
    const { data: publicUrlData } = supabase.storage
      .from('Images')
      .getPublicUrl(`Products/${filepath}`);

    const imageUrl = publicUrlData?.publicUrl;

    if (!imageUrl) {
      return Response.json(
        { success: false, error: 'Failed to generate public URL' },
        { status: 500 }
      );
    }

    console.log('Generated public URL:', imageUrl);

    return Response.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        imageUrl,
        filepath,
        filename,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
