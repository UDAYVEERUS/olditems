// src/app/api/auth/me/route.ts
// Get current authenticated user (subscription fields commented out)

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        city: users.city,
        state: users.state,
        pincode: users.pincode,
        // ==================== SUBSCRIPTION FIELDS (COMMENTED OUT) ====================
        // subscriptionStatus: users.subscriptionStatus,
        // subscriptionEndDate: users.subscriptionEndDate,
        // freeListingsUsed: users.freeListingsUsed,
        // ==================== END SUBSCRIPTION FIELDS ====================
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, currentUser.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}