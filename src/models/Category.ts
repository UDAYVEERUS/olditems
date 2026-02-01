// src/models/Category.ts
import mongoose, { Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  subcategories?: string[]; // Add this if you want subcategories
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
    unique: true,
  },
  subcategories: [{ 
    type: String 
  }], // Add this field
  parentId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

CategorySchema.index({ parentId: 1 });

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);