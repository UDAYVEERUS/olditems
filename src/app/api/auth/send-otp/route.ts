// src/app/api/auth/send-otp/route.ts
// Send OTP to phone number for verification

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateOTP, sendOTPViaSMS, storeOTP } from '@/lib/msg91';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    // Validation
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone format (10 digits)
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be 10 digits.' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in memory (expires in 5 minutes)
    storeOTP(phone, otp);

    // Send OTP via SMS
    const result = await sendOTPViaSMS(phone, otp);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    // For development: Log OTP (remove in production!)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${phone}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}