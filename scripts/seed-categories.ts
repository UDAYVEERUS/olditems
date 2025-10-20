// scripts/seed-categories.ts
// Run: npx tsx scripts/seed-categories.ts

import { db } from '../src/db';
import { categories } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const categoryData = [
  {
    name: 'Electronics',
    subcategories: ['Mobile Phones', 'Laptops', 'Cameras', 'TVs', 'Audio', 'Accessories'],
  },
  {
    name: 'Vehicles',
    subcategories: ['Cars', 'Bikes', 'Scooters', 'Bicycles', 'Spare Parts'],
  },
  {
    name: 'Furniture',
    subcategories: ['Sofa', 'Beds', 'Tables', 'Chairs', 'Wardrobes', 'Home Decor'],
  },
  {
    name: 'Fashion',
    subcategories: ['Men Clothing', 'Women Clothing', 'Kids Clothing', 'Shoes', 'Accessories'],
  },
  {
    name: 'Home Appliances',
    subcategories: ['Refrigerators', 'Washing Machines', 'ACs', 'Kitchen Appliances'],
  },
  {
    name: 'Books & Sports',
    subcategories: ['Books', 'Sports Equipment', 'Gym Equipment', 'Musical Instruments'],
  },
  {
    name: 'Real Estate',
    subcategories: ['Houses for Sale', 'Houses for Rent', 'Commercial', 'Plots'],
  },
  {
    name: 'Services',
    subcategories: ['Tutors', 'Home Repair', 'Cleaning', 'Photography', 'Event Planning'],
  },
];

async function main() {
  console.log('Seeding categories...');

  for (const cat of categoryData) {
    const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
    const parentId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check if parent exists
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    let parent;
    if (existing) {
      parent = existing;
      console.log(`✓ Parent exists: ${parent.name}`);
    } else {
      // Create parent category
      await db.insert(categories).values({
        id: parentId,
        name: cat.name,
        slug,
        parentId: null,
      });

      [parent] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parentId));

      console.log(`✓ Created parent: ${parent.name}`);
    }

    // Create subcategories
    for (const subName of cat.subcategories) {
      const subSlug = subName.toLowerCase().replace(/\s+/g, '-');
      const subId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const [existingSub] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, subSlug))
        .limit(1);

      if (!existingSub) {
        await db.insert(categories).values({
          id: subId,
          name: subName,
          slug: subSlug,
          parentId: parent.id,
        });
        console.log(`  ✓ Created sub: ${subName}`);
      } else {
        console.log(`  ✓ Sub exists: ${subName}`);
      }
    }
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

main().catch((e) => {
  console.error('Error seeding:', e);
  process.exit(1);
});