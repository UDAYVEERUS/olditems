// src/models/Category.ts
import mongoose, { Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,  // ✅ unique creates index automatically
  },
  parentId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// ❌ REMOVE this duplicate index - unique: true already creates it
// CategorySchema.index({ slug: 1 });

CategorySchema.index({ parentId: 1 });  // ✅ Keep this one - it's not duplicate

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);