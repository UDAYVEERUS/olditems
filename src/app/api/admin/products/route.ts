export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Category } from '@/models/Category';
import { getCurrentUser } from '@/lib/auth';

const ADMIN_EMAILS = ['udayveerus348566@gmail.com'];

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

    // Check admin status
    const adminUser = await User.findById(currentUser.userId).select('email');

    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all products
    const allProducts = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    // Get user and category details for each product
    const productsWithDetails = await Promise.all(
      allProducts.map(async (p) => {
        const user = await User.findById(p.userId).select('name email phone').lean();
        const category = await Category.findById(p.categoryId).select('name').lean();

        return {
          id: p._id.toString(),
          title: p.title,
          price: p.price,
          images: p.images,
          status: p.status,
          views: p.views,
          phoneClicks: p.phoneClicks,
          createdAt: p.createdAt,
          user: user ? {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
          } : null,
          category: category ? {
            name: category.name,
          } : null,
        };
      })
    );

    return NextResponse.json({ products: productsWithDetails });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}