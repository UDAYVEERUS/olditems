export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();

    // Get all parent categories
    const parentCategories = await Category.find({ parentId: null });

    // Get subcategories for each parent
    const categoriesWithSubs = await Promise.all(
      parentCategories.map(async (parent) => {
        const subCategories = await Category.find({ parentId: parent._id.toString() });

        return {
          id: parent._id.toString(),
          name: parent.name,
          slug: parent.slug,
          subCategories: subCategories.map(sub => ({
            id: sub._id.toString(),
            name: sub.name,
            slug: sub.slug,
          })),
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithSubs });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const category = await Category.create({
      name,
      slug,
      parentId: parentId || null,
    });

    return NextResponse.json({
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}