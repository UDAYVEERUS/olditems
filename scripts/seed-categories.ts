// scripts/seed-categories.ts
import dbConnect from '../src/lib/db';
import { Category } from '../src/models/Category';

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
  await dbConnect();
  
  console.log('Seeding categories...');

  for (const cat of categoryData) {
    const slug = cat.name.toLowerCase().replace(/\s+/g, '-');

    // Check if parent exists
    let parent = await Category.findOne({ slug });

    if (parent) {
      console.log(`✓ Parent exists: ${parent.name}`);
    } else {
      // Create parent category
      parent = await Category.create({
        name: cat.name,
        slug,
        parentId: null,
      });

      console.log(`✓ Created parent: ${parent.name}`);
    }

    // Create subcategories
    for (const subName of cat.subcategories) {
      const subSlug = subName.toLowerCase().replace(/\s+/g, '-');

      const existingSub = await Category.findOne({ slug: subSlug });

      if (!existingSub) {
        await Category.create({
          name: subName,
          slug: subSlug,
          parentId: parent._id.toString(),
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