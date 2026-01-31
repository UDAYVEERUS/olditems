export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
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

    // Get product (only if user owns it)
    const product = await Product.findOne({
      _id: id,
      userId: currentUser.userId
    }).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    const productData = {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      images: product.images,
      categoryId: product.categoryId,
      city: product.city,
      state: product.state,
      pincode: product.pincode,
      latitude: product.latitude,
      longitude: product.longitude,
    };

    return NextResponse.json({ product: productData });
  } catch (error) {
    console.error('Get product for edit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}