export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
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

    // Check admin
    const user = await User.findById(currentUser.userId).select('email');

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all users
    const allUsers = await User.find()
      .select('userId name email phone city state createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = allUsers.map(u => ({
      id: u._id.toString(),
      userId: u.userId,
      name: u.name,
      email: u.email,
      phone: u.phone,
      city: u.city,
      state: u.state,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}