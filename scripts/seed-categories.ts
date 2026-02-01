// scripts/seed-categories.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// Use your existing Category model
interface ICategory {
  name: string;
  slug: string;
  subcategories?: string[];
  parentId?: string | null;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  subcategories: [{ type: String }],
  parentId: { type: String, default: null },
}, {
  timestamps: true,
});

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

const categoryData: ICategory[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    subcategories: ['Mobile Phones', 'Laptops', 'Cameras', 'TVs', 'Audio', 'Accessories'],
    parentId: null,
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    subcategories: ['Cars', 'Bikes', 'Scooters', 'Bicycles', 'Spare Parts'],
    parentId: null,
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    subcategories: ['Sofa', 'Beds', 'Tables', 'Chairs', 'Wardrobes', 'Home Decor'],
    parentId: null,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    subcategories: ['Men Clothing', 'Women Clothing', 'Kids Clothing', 'Shoes', 'Accessories'],
    parentId: null,
  },
  {
    name: 'Books & Sports',
    slug: 'books-sports',
    subcategories: ['Books', 'Gym Equipment', 'Sports Equipment', 'Musical Instruments'],
    parentId: null,
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    subcategories: ['Kitchen Appliances', 'Garden Tools', 'Home Improvement', 'Bathroom'],
    parentId: null,
  },
  {
    name: 'Pets',
    slug: 'pets',
    subcategories: ['Pet Food', 'Pet Accessories', 'Pet Care', 'Aquariums'],
    parentId: null,
  },
  {
    name: 'Services',
    slug: 'services',
    subcategories: ['Education', 'Health', 'Repair', 'Moving', 'Cleaning'],
    parentId: null,
  },
];

async function seedCategories() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', mongoose.connection.db.databaseName);

    // Drop the collection to clear all data and indexes
    console.log('🗑️  Dropping categories collection...');
    await mongoose.connection.db.dropCollection('categories').catch(() => {
      console.log('   Collection does not exist, skipping drop');
    });

    console.log('📦 Inserting new categories...');
    const result = await Category.insertMany(categoryData);
    console.log(`✅ Successfully seeded ${result.length} categories\n`);

    result.forEach((cat, index) => {
      console.log(`${index + 1}. 📁 ${cat.name} (/${cat.slug})`);
      if (cat.subcategories && cat.subcategories.length > 0) {
        console.log(`   └─ ${cat.subcategories.join(', ')}\n`);
      }
    });

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedCategories();