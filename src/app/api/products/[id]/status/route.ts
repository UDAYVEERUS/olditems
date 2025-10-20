// src/app/api/products/[id]/status/route.ts
// Update product status (mark as sold, active, etc)

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'SOLD', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Verify product belongs to user
    const [product] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.id, params.id),
          eq(products.userId, currentUser.userId)
        )
      )
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update status
    await db
      .update(products)
      .set({ status })
      .where(eq(products.id, params.id));

    return NextResponse.json({
      success: true,
      message: `Product marked as ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}