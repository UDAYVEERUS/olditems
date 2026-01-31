// app/sitemap.ts
import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.olditems.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip database connection during build
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    console.log('⚠️ Skipping sitemap generation during build (no MongoDB)');
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }

  try {
    await dbConnect();

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

    const allCategories = await Category.find()
      .select('_id slug parentId')
      .lean();

    const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((category) => {
      if (category.parentId) {
        const parent = allCategories.find((c) => c._id.toString() === category.parentId);
        return {
          url: `${BASE_URL}/category/${parent?.slug}/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        };
      }
      
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

export const dynamic = 'force-dynamic';
export const revalidate = 3600;