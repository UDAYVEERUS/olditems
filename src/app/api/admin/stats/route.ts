export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
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

    // Get user email to check admin
    const user = await User.findById(currentUser.userId).select('email');

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get active products
    const activeProducts = await Product.countDocuments({ status: 'ACTIVE' });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        activeProducts,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}