export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    
    await Product.findByIdAndUpdate(id, {
      $inc: { phoneClicks: 1 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track phone click error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}