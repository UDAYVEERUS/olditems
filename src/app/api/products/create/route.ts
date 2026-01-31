export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, price, categoryId, images, city, state, pincode, latitude, longitude } = body;

    // Validation
    if (!title || !description || !price || !categoryId || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 images allowed' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(currentUser.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create product
    const newProduct = await Product.create({
      title,
      description,
      price: parseFloat(price),
      categoryId,
      userId: user._id.toString(),
      images,
      city,
      state,
      pincode,
      latitude: latitude || 0,
      longitude: longitude || 0,
      status: 'ACTIVE',
    });

    return NextResponse.json({
      success: true,
      product: {
        id: newProduct._id.toString(),
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        images: newProduct.images,
        status: newProduct.status,
      },
      message: 'Product listed successfully!',
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}