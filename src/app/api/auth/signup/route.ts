// src/app/api/auth/signup/route.ts
// User registration (subscription fields commented out)

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { eq, or } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);

    const body = await request.json();
    const { name, email, phone, password, city, state, pincode, latitude, longitude } = body;

    // Validation
    if (!name || !email || !phone || !password || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique formatted user ID (for user_id field)
    const uniqueUserId = `U${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // Insert new user using Drizzle ORM properly
    const [insertResult] = await db.insert(users).values({
      userId: uniqueUserId, // This is the formatted readable ID
      name,
      email,
      phone,
      password: hashedPassword,
      city,
      state,
      pincode,
      latitude: latitude || null,
      longitude: longitude || null,
      isVerified: false, // Default value
    });

    // Fetch the created user with auto-generated id
    const [newUser] = await db
      .select({
        id: users.id, // Auto-increment ID (number)
        userId: users.userId, // Formatted readable ID (string)
        name: users.name,
        email: users.email,
        phone: users.phone,
        city: users.city,
        state: users.state,
        // ==================== SUBSCRIPTION FIELD (COMMENTED OUT) ====================
        // subscriptionStatus: users.subscriptionStatus,
        // ==================== END SUBSCRIPTION FIELD ====================
      })
      .from(users)
      .where(eq(users.userId, uniqueUserId)); // Query by userId field

    // Generate token using the numeric id directly (no toString())
    const token = generateToken(newUser.id); // Pass number directly
    
    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        ...newUser,
        // Send formatted userId to frontend for display
        displayId: newUser.userId,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}