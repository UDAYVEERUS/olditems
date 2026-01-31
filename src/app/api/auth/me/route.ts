export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(currentUser.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}