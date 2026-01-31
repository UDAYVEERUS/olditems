export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

// Update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      categoryId,
      images,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = body;

    if (
      !title ||
      !description ||
      !price ||
      !categoryId ||
      !city ||
      !state ||
      !pincode
    ) {
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

    const product = await Product.findOne({
      _id: id,
      userId: currentUser.userId
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update product
    product.title = title;
    product.description = description;
    product.price = parseFloat(price);
    product.categoryId = categoryId;
    product.images = images;
    product.city = city;
    product.state = state;
    product.pincode = pincode;
    product.latitude = latitude || 0;
    product.longitude = longitude || 0;

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await Product.findOne({
      _id: id,
      userId: currentUser.userId
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}