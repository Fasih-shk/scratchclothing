/**
 * Database Seeder
 * Seeds all collections with sample data including admin user
 * 
 * Usage: node src/scripts/seed.js
 */

import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';
import { hashPassword } from '../lib/auth.js';

async function seed() {
  try {
    console.log('🔄 Starting database seeding...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    console.log('\n🌱 Seeding data...\n');

    const hashedPassword = await hashPassword('admin123');

    // Seed Admin User
    const existingAdmin = await User.findOne({ email: 'admin@munidrip.com' });
    if (!existingAdmin) {
      await User.create({
        email: 'admin@munidrip.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+447000000000',
        role: 'admin',
        isVerified: true,
        isActive: true,
        currency: 'GBP',
      });
      console.log('✅ Admin user created: admin@munidrip.com / admin123');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // Seed Test Customer
    const existingCustomer = await User.findOne({ email: 'customer@munidrip.com' });
    if (!existingCustomer) {
      await User.create({
        email: 'customer@munidrip.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+447000000001',
        role: 'customer',
        isVerified: true,
        isActive: true,
        currency: 'GBP',
      });
      console.log('✅ Test customer created: customer@munidrip.com / admin123');
    } else {
      console.log('⏭️  Test customer already exists');
    }

    // Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const categories = await Category.insertMany([
        { name: 'T-Shirts', slug: 't-shirts', description: 'Premium cotton t-shirts', displayOrder: 1, isActive: true, isFeatured: true },
        { name: 'Hoodies', slug: 'hoodies', description: 'Comfortable hoodies & sweatshirts', displayOrder: 2, isActive: true, isFeatured: true },
        { name: 'Jackets', slug: 'jackets', description: 'Stylish outerwear for all seasons', displayOrder: 3, isActive: true },
        { name: 'Pants', slug: 'pants', description: 'Quality bottoms & trousers', displayOrder: 4, isActive: true },
        { name: 'Accessories', slug: 'accessories', description: 'Hats, bags & more', displayOrder: 5, isActive: true },
      ]);
      console.log(`✅ Seeded ${categories.length} categories`);
    } else {
      console.log('⏭️  Categories already exist');
    }

    // Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const categories = await Category.find().lean();
      const products = await Product.insertMany([
        {
          name: 'Classic Black T-Shirt',
          slug: 'classic-black-tshirt',
          description: 'Premium heavyweight cotton t-shirt with Boxy fit',
          shortDescription: '100% cotton black tee',
          category: categories.find(c => c.slug === 't-shirts')?._id,
          price: 35,
          originalPrice: 45,
          currency: 'GBP',
          discount: 22,
          discountType: 'percentage',
          images: [{ url: '/images/products/black-tshirt.jpg', alt: 'Black T-Shirt', isDefault: true }],
          sku: 'TSHIRT-BLK-001',
          status: 'active',
          isFeatured: true,
          isNewArrival: true,
          collectionName: 'mens',
          inventory: { total: 100, available: 100, reserved: 0 },
          rating: { average: 4.5, count: 24 },
          material: '100% Cotton',
          weight: { value: 200, unit: 'gsm' },
        },
        {
          name: 'White Urban T-Shirt',
          slug: 'white-urban-tshirt',
          description: 'Clean white tee for everyday wear',
          shortDescription: 'Classic white cotton tee',
          category: categories.find(c => c.slug === 't-shirts')?._id,
          price: 30,
          currency: 'GBP',
          images: [{ url: '/images/products/white-tshirt.jpg', alt: 'White T-Shirt', isDefault: true }],
          sku: 'TSHIRT-WHT-001',
          status: 'active',
          isFeatured: true,
          collectionName: 'unisex',
          inventory: { total: 80, available: 80, reserved: 0 },
          rating: { average: 4.3, count: 15 },
          material: '100% Cotton',
        },
        {
          name: 'Grey Melange Hoodie',
          slug: 'grey-melange-hoodie',
          description: 'Premium brushed fleece hoodie',
          shortDescription: 'Cozy grey hoodie',
          category: categories.find(c => c.slug === 'hoodies')?._id,
          price: 65,
          originalPrice: 80,
          currency: 'GBP',
          discount: 19,
          discountType: 'percentage',
          images: [{ url: '/images/products/grey-hoodie.jpg', alt: 'Grey Hoodie', isDefault: true }],
          sku: 'HOODIE-GRY-001',
          status: 'active',
          isFeatured: true,
          collectionName: 'unisex',
          inventory: { total: 50, available: 50, reserved: 0 },
          rating: { average: 4.7, count: 32 },
          material: '80% Cotton, 20% Polyester',
        },
        {
          name: 'Black Bomber Jacket',
          slug: 'black-bomber-jacket',
          description: 'Classic bomber jacket with satin finish',
          shortDescription: 'Satin bomber jacket',
          category: categories.find(c => c.slug === 'jackets')?._id,
          price: 120,
          currency: 'GBP',
          images: [{ url: '/images/products/bomber-black.jpg', alt: 'Bomber Jacket', isDefault: true }],
          sku: 'JACKET-BOM-001',
          status: 'active',
          isFeatured: true,
          collectionName: 'mens',
          inventory: { total: 25, available: 25, reserved: 0 },
          rating: { average: 4.6, count: 18 },
          material: 'Polyester Satin',
        },
        {
          name: 'Cargo Pants Black',
          slug: 'cargo-pants-black',
          description: 'Utility cargo pants with multiple pockets',
          shortDescription: 'Functional cargo pants',
          category: categories.find(c => c.slug === 'pants')?._id,
          price: 55,
          currency: 'GBP',
          images: [{ url: '/images/products/cargo-black.jpg', alt: 'Cargo Pants', isDefault: true }],
          sku: 'PANTS-CAR-001',
          status: 'active',
          collectionName: 'mens',
          inventory: { total: 40, available: 40, reserved: 0 },
          rating: { average: 4.2, count: 8 },
        },
        {
          name: 'Bucket Hat Black',
          slug: 'bucket-hat-black',
          description: 'Classic bucket hat for street style',
          shortDescription: 'Street bucket hat',
          category: categories.find(c => c.slug === 'accessories')?._id,
          price: 25,
          currency: 'GBP',
          images: [{ url: '/images/products/bucket-hat.jpg', alt: 'Bucket Hat', isDefault: true }],
          sku: 'HAT-BKT-001',
          status: 'active',
          collectionName: 'unisex',
          inventory: { total: 60, available: 60, reserved: 0 },
        },
      ]);
      console.log(`✅ Seeded ${products.length} products`);
    } else {
      console.log('⏭️  Products already exist');
    }

    // Seed Addresses for test customer
    const customer = await User.findOne({ email: 'customer@munidrip.com' });
    if (customer) {
      const addressCount = await Address.countDocuments({ userId: customer._id });
      if (addressCount === 0) {
        await Address.insertMany([
          {
            userId: customer._id,
            type: 'shipping',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+447000000001',
            streetAddress: '123 Street Name',
            city: 'London',
            state: 'Greater London',
            postalCode: 'SW1A 1AA',
            country: 'United Kingdom',
            isDefault: true,
          },
        ]);
        console.log('✅ Seeded addresses for test customer');
      } else {
        console.log('⏭️  Addresses already exist');
      }
    }

    // Seed Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany([
        {
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          isActive: true,
          maxUsagePerUser: 1,
          name: 'Welcome Offer',
          description: '10% off your first order',
        },
        {
          code: 'SAVE20',
          discountType: 'percentage',
          discountValue: 20,
          minOrderAmount: 50,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          isActive: true,
          name: 'Save 20',
          description: '20% off orders over £50',
        },
      ]);
      console.log('✅ Seeded coupons');
    } else {
      console.log('⏭️  Coupons already exist');
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@munidrip.com / admin123');
    console.log('   Customer: customer@munidrip.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();