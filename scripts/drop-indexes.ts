// scripts/drop-indexes.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function dropIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const db = mongoose.connection.db;
    
    // Drop indexes from all collections
    const collections = ['users', 'categories', 'products'];
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        await collection.dropIndexes();
        console.log(`✅ Dropped indexes for ${collectionName}`);
      } catch (err: any) {
        if (err.code === 26) {
          console.log(`⚠️  Collection ${collectionName} doesn't exist yet`);
        } else {
          console.error(`Error dropping indexes for ${collectionName}:`, err.message);
        }
      }
    }
    
    console.log('✅ All indexes dropped successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

dropIndexes();