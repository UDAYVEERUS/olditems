// app/sitemap.ts
import { MetadataRoute } from 'next';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.olditems.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/shipping`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    // Get active products directly from DB
    const activeProducts = await db
      .select({
        id: products.id,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.status, 'ACTIVE'))
      .limit(10000); // Adjust limit as needed

    const productRoutes: MetadataRoute.Sitemap = activeProducts.map((product) => ({
      url: `${BASE_URL}/products/${product.id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Get all categories
    const allCategories = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        parentId: categories.parentId,
      })
      .from(categories);

    // Build category routes with hierarchy
    const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((category) => {
      // If it's a subcategory, find parent slug
      if (category.parentId) {
        const parent = allCategories.find((c) => c.id === category.parentId);
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
    console.error('Sitemap generation error:', error);
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