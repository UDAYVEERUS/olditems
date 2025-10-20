// src/db/schema.ts
// Database schema using Drizzle ORM for MySQL

import { mysqlTable, varchar, text, float, int, boolean, datetime, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  latitude: float('latitude'),
  longitude: float('longitude'),
  isVerified: boolean('is_verified').default(false),
  
  // Subscription fields
  subscriptionStatus: mysqlEnum('subscription_status', ['INACTIVE', 'ACTIVE', 'PAST_DUE', 'CANCELLED']).default('INACTIVE'),
  subscriptionId: varchar('subscription_id', { length: 255 }),
  subscriptionStartDate: datetime('subscription_start_date'),
  subscriptionEndDate: datetime('subscription_end_date'),
  nextBillingDate: datetime('next_billing_date'),
  freeListingsUsed: int('free_listings_used').default(0),
  
  // Password reset fields
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiry: datetime('reset_token_expiry'),
  
  createdAt: datetime('created_at').notNull().default(new Date()),
  updatedAt: datetime('updated_at').notNull().default(new Date()),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  phoneIdx: index('phone_idx').on(table.phone),
  subscriptionStatusIdx: index('subscription_status_idx').on(table.subscriptionStatus),
}));

// Categories table
export const categories = mysqlTable('categories', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  parentId: varchar('parent_id', { length: 255 }),
  createdAt: datetime('created_at').notNull().default(new Date()),
}, (table) => ({
  slugIdx: index('slug_idx').on(table.slug),
  parentIdIdx: index('parent_id_idx').on(table.parentId),
}));

// Products table
export const products = mysqlTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  price: float('price').notNull(),
  images: text('images').notNull(), // JSON string array
  
  categoryId: varchar('category_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  
  // Location
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  latitude: float('latitude').notNull(),
  longitude: float('longitude').notNull(),
  
  // Status
  status: mysqlEnum('status', ['ACTIVE', 'SOLD', 'HIDDEN', 'ARCHIVED']).default('ACTIVE'),
  
  // Analytics
  views: int('views').default(0),
  phoneClicks: int('phone_clicks').default(0),
  
  createdAt: datetime('created_at').notNull().default(new Date()),
  updatedAt: datetime('updated_at').notNull().default(new Date()),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  categoryIdIdx: index('category_id_idx').on(table.categoryId),
  statusIdx: index('status_idx').on(table.status),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  locationIdx: index('location_idx').on(table.latitude, table.longitude),
}));

// Transactions table
export const transactions = mysqlTable('transactions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['SUBSCRIPTION_PAYMENT', 'SUBSCRIPTION_RENEWAL']).notNull(),
  amount: float('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('INR'),
  status: mysqlEnum('status', ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']).notNull(),
  
  // Razorpay details
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),
  razorpayOrderId: varchar('razorpay_order_id', { length: 255 }),
  razorpaySubscriptionId: varchar('razorpay_subscription_id', { length: 255 }),
  razorpaySignature: varchar('razorpay_signature', { length: 255 }),
  
  // Billing period
  billingPeriodStart: datetime('billing_period_start'),
  billingPeriodEnd: datetime('billing_period_end'),
  
  createdAt: datetime('created_at').notNull().default(new Date()),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  statusIdx: index('status_idx').on(table.status),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  subCategories: many(categories),
}));

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));