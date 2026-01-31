// src/models/Product.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  userId: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';
  views: number;
  phoneClicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SOLD', 'HIDDEN', 'ARCHIVED'],
    default: 'ACTIVE',
  },
  views: {
    type: Number,
    default: 0,
  },
  phoneClicks: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// ✅ These are all good - no duplicates
ProductSchema.index({ userId: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ latitude: 1, longitude: 1 });

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);