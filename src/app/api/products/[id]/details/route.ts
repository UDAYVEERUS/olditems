export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Category } from '@/models/Category';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch user and category
    const user = await User.findById(product.userId).select('name phone city state').lean();
    const category = await Category.findById(product.categoryId).select('name').lean();

    const productWithDetails = {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      images: product.images,
      status: product.status,
      views: product.views,
      phoneClicks: product.phoneClicks,
      city: product.city,
      state: product.state,
      pincode: product.pincode,
      createdAt: product.createdAt,
      user: user ? {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        city: user.city,
        state: user.state,
      } : null,
      category: category ? {
        id: category._id.toString(),
        name: category.name,
      } : null,
    };

    return NextResponse.json({ product: productWithDetails });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}