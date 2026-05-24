/**
 * MongoDB Schema Migration/Initialization Script
 * This script initializes all MongoDB collections with proper indexes and seed data
 * 
 * Usage:
 * - Run with: node src/scripts/migrate.js
 * - This creates all collections and indexes automatically on first connection
 */

import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Return from '../models/Return.js';
import Address from '../models/Address.js';
import InventoryHistory from '../models/InventoryHistory.js';

async function runMigrations() {
  try {
    console.log('🔄 Starting MongoDB migrations...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    console.log('\n📝 Indexes will be created automatically by Mongoose on first use');

    console.log('\n🌱 Seeding sample data...');
    await seedSampleData();

    console.log('\n✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function seedSampleData() {
  try {
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('⏭️  Categories already exist, skipping seed');
      return;
    }

    // Seed Categories
    const categories = await Category.insertMany([
      {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'High-quality cotton and blend t-shirts',
        displayOrder: 1,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Comfortable hoodies and sweatshirts',
        displayOrder: 2,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Jackets',
        slug: 'jackets',
        description: 'Stylish jackets for all seasons',
        displayOrder: 3,
        isActive: true,
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Hats, bags, and other accessories',
        displayOrder: 4,
        isActive: true,
      },
    ]);

    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed Products
    const products = await Product.insertMany([
      {
        name: 'Classic Black T-Shirt',
        slug: 'classic-black-tshirt',
        description: 'Premium black t-shirt made from 100% cotton',
        shortDescription: 'Premium black cotton t-shirt',
        category: categories[0]._id,
        price: 29.99,
        currency: 'GBP',
        images: [
          {
            url: '/cdn/shop/files/black-tshirt-1.jpg',
            alt: 'Classic Black T-Shirt Front',
            isDefault: true,
          },
        ],
        sku: 'BLK-TSHIRT-001',
        status: 'active',
        isFeatured: true,
        isNewArrival: true,
        collectionName: 'mens',
        inventory: {
          total: 100,
          available: 100,
          reserved: 0,
        },
        rating: {
          average: 4.5,
          count: 12,
        },
      },
      {
        name: 'Comfort Hoodie',
        slug: 'comfort-hoodie',
        description: 'Ultra-soft hoodie perfect for casual wear',
        shortDescription: 'Soft and warm hoodie',
        category: categories[1]._id,
        price: 59.99,
        currency: 'GBP',
        images: [
          {
            url: '/cdn/shop/files/hoodie-1.jpg',
            alt: 'Comfort Hoodie Front',
            isDefault: true,
          },
        ],
        sku: 'HOODIE-001',
        status: 'active',
        isFeatured: true,
        collectionName: 'unisex',
        inventory: {
          total: 50,
          available: 50,
          reserved: 0,
        },
      },
    ]);

    console.log(`✅ Seeded ${products.length} products`);

    // Seed Coupons
    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        maxUsagePerUser: 1,
        name: 'Welcome Discount',
        description: '10% off your first order',
      },
      {
        code: 'SUMMER20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isActive: true,
        maxUsagePerUser: null,
        name: 'Summer Sale',
        description: '20% off orders over £50',
      },
    ]);

    console.log(`✅ Seeded ${coupons.length} coupons`);

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

// Run migrations
runMigrations();