export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, phone, password, city, state, pincode, latitude, longitude } = body;

    if (!name || !email || !phone || !password || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique user ID
    const uniqueUserId = `U${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // Create user
    const newUser = await User.create({
      userId: uniqueUserId,
      name,
      email,
      phone,
      password: hashedPassword,
      city,
      state,
      pincode,
      latitude: latitude || null,
      longitude: longitude || null,
      isVerified: false,
    });

    // Generate token
    const token = generateToken(newUser._id.toString());
    
    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        state: newUser.state,
        displayId: newUser.userId,
      },
      token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}