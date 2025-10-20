// src/app/api/auth/signup/route.ts
// User registration with OTP verification

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { verifyOTP, clearOTP } from '@/lib/msg91';
import { eq, or } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, otp, city, state, pincode, latitude, longitude } = body;

    // Validation
    if (!name || !email || !phone || !password || !otp || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isOTPValid = verifyOTP(phone, otp);
    if (!isOTPValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)))
      .limit(1);

    if (existingUser.length > 0) {
      clearOTP(phone); // Clear OTP
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user
    await db.insert(users).values({
      id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      city,
      state,
      pincode,
      latitude: latitude || 0,
      longitude: longitude || 0,
      isVerified: true, // Phone verified via OTP
    });

    // Clear OTP after successful signup
    clearOTP(phone);

    // Fetch created user
    const [newUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        city: users.city,
        subscriptionStatus: users.subscriptionStatus,
        subscriptionEndDate: users.subscriptionEndDate,
      })
      .from(users)
      .where(eq(users.id, userId));

    // Send welcome email (don't wait for it)
    // Import at top: import { sendWelcomeEmail } from '@/lib/resend';
    // sendWelcomeEmail(email, name).catch(err => console.error('Welcome email error:', err));

    // Generate token
    const token = generateToken(newUser.id);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}