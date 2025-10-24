// src/app/api/products/[id]/view/route.ts
// Track product views for analytics

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Increment views counter
    const { id } = await params;
    await db
      .update(products)
      .set({
        views: sql`${products.views} + 1`,
      })
      .where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}