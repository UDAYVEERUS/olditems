export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all products for this user
    const products = await Product.find({ userId: currentUser.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch category details
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        const category = await Category.findById(product.categoryId).select('name').lean();

        return {
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
          createdAt: product.createdAt,
          category: category ? {
            id: category._id.toString(),
            name: category.name,
          } : null,
        };
      })
    );

    return NextResponse.json({
      products: productsWithCategory,
    });
  } catch (error) {
    console.error('Get my products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}