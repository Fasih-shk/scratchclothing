/**
 * MongoDB Database Utilities
 * Common functions for database operations
 */

import connectDB from '@/lib/mongodb';
import { Product, Order, User, Inventory, Cart } from '@/models';

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8) {
  await connectDB();
  return await Product.find({
    isFeatured: true,
    status: 'active',
  })
    .limit(limit)
    .populate('category')
    .sort({ createdAt: -1 });
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId, limit = 20, skip = 0) {
  await connectDB();
  return await Product.find({
    category: categoryId,
    status: 'active',
  })
    .limit(limit)
    .skip(skip)
    .populate('category')
    .sort({ createdAt: -1 });
}

/**
 * Search products
 */
export async function searchProducts(query, limit = 20) {
  await connectDB();
  return await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .where('status')
    .equals('active')
    .limit(limit)
    .sort({ score: { $meta: 'textScore' } });
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug) {
  await connectDB();
  return await Product.findOne({ slug })
    .populate('category')
    .populate('reviews');
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId, limit = 10, skip = 0) {
  await connectDB();
  return await Order.find({ userId })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .populate('items.productId');
}

/**
 * Get user's cart
 */
export async function getUserCart(userId) {
  await connectDB();
  return await Cart.findOne({ userId }).populate('items.productId');
}

/**
 * Update cart
 */
export async function updateCart(userId, items, totals) {
  await connectDB();
  return await Cart.findOneAndUpdate(
    { userId },
    {
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shippingCost: totals.shippingCost,
      total: totals.total,
      status: 'active',
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );
}

/**
 * Check product inventory
 */
export async function checkInventory(productId) {
  await connectDB();
  return await Inventory.findOne({ productId });
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(limit = 20) {
  await connectDB();
  return await Inventory.find({ isLowStock: true })
    .limit(limit)
    .populate('productId');
}

/**
 * Get product by ID
 */
export async function getProductById(id) {
  await connectDB();
  return await Product.findById(id).populate('category');
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
  await connectDB();
  return await User.findOne({ email });
}

/**
 * Create new order
 */
export async function createOrder(orderData) {
  await connectDB();
  const order = new Order(orderData);
  await order.save();
  return order;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status, note = '') {
  await connectDB();
  return await Order.findByIdAndUpdate(
    orderId,
    {
      status,
      $push: {
        statusHistory: {
          status,
          timestamp: new Date(),
          note,
        },
      },
    },
    { new: true }
  );
}

/**
 * Get recent orders (for admin dashboard)
 */
export async function getRecentOrders(limit = 10) {
  await connectDB();
  return await Order.find()
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName email');
}

/**
 * Get order statistics
 */
export async function getOrderStats() {
  await connectDB();
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        avgOrderValue: { $avg: '$total' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
        },
      },
    },
  ]);
  return stats[0] || {};
}

export default {
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getProductBySlug,
  getUserOrders,
  getUserCart,
  updateCart,
  checkInventory,
  getLowStockProducts,
  getProductById,
  getUserByEmail,
  createOrder,
  updateOrderStatus,
  getRecentOrders,
  getOrderStats,
};
