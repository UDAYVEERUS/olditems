// src/app/api/products/[id]/phone-click/route.ts
// Track phone number clicks for analytics

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }:{ params: Promise<{ id: string }> }
) {
  try {
    // Increment phone clicks counter
    const { id } = await params;
    await db
      .update(products)
      .set({
        phoneClicks: sql`${products.phoneClicks} + 1`,
      })
      .where(eq(products.id,id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track phone click error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}