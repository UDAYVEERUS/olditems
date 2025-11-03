// src/app/api/products/[id]/route.ts
// Update and delete product

import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// Update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      categoryId,
      images,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = body;

    if (
      !title ||
      !description ||
      !price ||
      !categoryId ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 images allowed" },
        { status: 400 }
      );
    }

    // Convert user ID to string for comparison (products.userId is stored as string)
    const userIdString = String(currentUser.id);

    const [product] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, id), eq(products.userId, userIdString))
      )
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    await db
      .update(products)
      .set({
        title,
        description,
        price: parseFloat(price),
        categoryId,
        images: JSON.stringify(images),
        city,
        state,
        pincode,
        latitude: latitude || 0,
        longitude: longitude || 0,
      })
      .where(eq(products.id, id));

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert user ID to string for comparison (products.userId is stored as string)
    const userIdString = String(currentUser.id);

    const [product] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, id), eq(products.userId, userIdString))
      )
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}