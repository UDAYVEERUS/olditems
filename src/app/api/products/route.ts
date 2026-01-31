export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Category } from '@/models/Category';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { status: 'ACTIVE' };

    // Search
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (categoryId) {
      query.categoryId = categoryId;
    } else if (category) {
      query.categoryId = category;
    }

    // Location filter
    if (city && city !== '') {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (state && state !== '') {
      query.state = { $regex: state, $options: 'i' };
    }

    // Price range filter
    if (minPrice) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }

    // Sort
    let sort: any = { createdAt: -1 }; // default: latest
    if (sortBy === 'price-low') {
      sort = { price: 1 };
    } else if (sortBy === 'price-high') {
      sort = { price: -1 };
    }

    // Get products
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Product.countDocuments(query);

    // Fetch user and category details for each product
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const user = await User.findById(product.userId).select('name email phone city state').lean();
        const cat = await Category.findById(product.categoryId).select('name slug').lean();

        return {
          id: product._id.toString(),
          title: product.title,
          description: product.description,
          price: product.price,
          images: product.images,
          city: product.city,
          state: product.state,
          pincode: product.pincode,
          status: product.status,
          views: product.views,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          seller: user ? {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            state: user.state,
          } : null,
          category: cat ? {
            id: cat._id.toString(),
            name: cat.name,
            slug: cat.slug,
          } : null,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      products: productsWithDetails,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}