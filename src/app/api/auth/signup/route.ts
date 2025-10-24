// src/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { eq, or, sql } from 'drizzle-orm';

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

    // Generate unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Use raw SQL to avoid Drizzle adding default columns
    await db.execute(sql`
      INSERT INTO users (
        id, name, email, phone, password, city, state, pincode, 
        latitude, longitude, is_verified
      ) VALUES (
        ${userId}, ${name}, ${email}, ${phone}, ${hashedPassword},
        ${city}, ${state}, ${pincode}, ${latitude || 0}, ${longitude || 0}, true
      )
    `);

    // Fetch created user
    const [newUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        city: users.city,
        subscriptionStatus: users.subscriptionStatus,
      })
      .from(users)
      .where(eq(users.id, userId));

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