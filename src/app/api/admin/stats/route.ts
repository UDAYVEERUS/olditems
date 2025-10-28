// src/app/api/admin/stats/route.ts
// Get admin dashboard statistics (SUBSCRIPTION STATS COMMENTED OUT)

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, products } from '@/db/schema'; // Removed transactions import
import { getCurrentUser } from '@/lib/auth';
import { count, eq } from 'drizzle-orm'; // Removed: sum, and, gte

const ADMIN_EMAILS = ['udayveerus348566@gmail.com'];

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user email to check admin
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, currentUser.userId))
      .limit(1);

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get total users
    const [{ value: totalUsers }] = await db
      .select({ value: count() })
      .from(users);

    // ==================== SUBSCRIPTION STATS (COMMENTED OUT) ====================
    // Get active subscribers
    // const [{ value: activeSubscribers }] = await db
    //   .select({ value: count() })
    //   .from(users)
    //   .where(eq(users.subscriptionStatus, 'ACTIVE'));
    // ==================== END SUBSCRIPTION STATS ====================

    // Get total products
    const [{ value: totalProducts }] = await db
      .select({ value: count() })
      .from(products);

    // Get active products
    const [{ value: activeProducts }] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.status, 'ACTIVE'));

    // ==================== REVENUE STATS (COMMENTED OUT) ====================
    // Get total revenue (all successful transactions)
    // const [revenueData] = await db
    //   .select({ value: sum(transactions.amount) })
    //   .from(transactions)
    //   .where(eq(transactions.status, 'SUCCESS'));
    // const totalRevenue = revenueData?.value || 0;

    // Get this month's revenue
    // const now = new Date();
    // const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // const [monthRevenueData] = await db
    //   .select({ value: sum(transactions.amount) })
    //   .from(transactions)
    //   .where(
    //     and(
    //       eq(transactions.status, 'SUCCESS'),
    //       gte(transactions.createdAt, firstDayOfMonth)
    //     )
    //   );
    // const monthlyRevenue = monthRevenueData?.value || 0;
    // ==================== END REVENUE STATS ====================

    return NextResponse.json({
      stats: {
        totalUsers,
        // activeSubscribers, // COMMENTED OUT
        totalProducts,
        activeProducts,
        // totalRevenue, // COMMENTED OUT
        // monthlyRevenue, // COMMENTED OUT
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