// app/sitemap.ts
import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.olditems.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/signup`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/login`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/shipping`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    // Get active products from MongoDB
    const activeProducts = await Product.find({ status: 'ACTIVE' })
      .select('_id updatedAt')
      .limit(10000)
      .lean();

    const productRoutes: MetadataRoute.Sitemap = activeProducts.map((product) => ({
      url: `${BASE_URL}/products/${product._id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Get all categories from MongoDB
    const allCategories = await Category.find()
      .select('_id slug parentId')
      .lean();

    // Build category routes with hierarchy
    const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((category) => {
      // If it's a subcategory, find parent slug
      if (category.parentId) {
        const parent = allCategories.find((c) => c._id.toString() === category.parentId);
        return {
          url: `${BASE_URL}/category/${parent?.slug}/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        };
      }
      
      // Parent category
      return {
        url: `${BASE_URL}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    // Return at least the homepage if database fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}

// Revalidate sitemap every hour
export const revalidate = 3600;