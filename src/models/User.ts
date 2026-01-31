// src/models/User.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // ✅ unique creates index automatically
  },
  phone: {
    type: String,
    required: true,
    unique: true,  // ✅ unique creates index automatically
  },
  password: {
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
  latitude: Number,
  longitude: Number,
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: String,
  resetTokenExpiry: Date,
}, {
  timestamps: true,
});

// ❌ REMOVE these duplicate index definitions - unique: true already creates them
// UserSchema.index({ email: 1 });
// UserSchema.index({ phone: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);