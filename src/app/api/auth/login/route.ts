// src/app/api/auth/login/route.ts
// Login endpoint that sets the auth cookie

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';
import { eq, or } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    // Find user by email or phone
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier),
          eq(users.phone, identifier)
        )
      )
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Set the auth cookie - THIS IS THE KEY PART
    await setAuthCookie(token);

    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      // ==================== SUBSCRIPTION FIELDS (COMMENTED OUT) ====================
      // subscriptionStatus: user.subscriptionStatus,
      // subscriptionEndDate: user.subscriptionEndDate,
      // freeListingsUsed: user.freeListingsUsed,
      // ==================== END SUBSCRIPTION FIELDS ====================
    };

    return NextResponse.json({
      user: userData,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}