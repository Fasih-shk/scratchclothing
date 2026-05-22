import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import OrdersClient from './OrdersClient';

export default async function AdminOrders() {
  await connectDB();

  // Fetch all orders from the database, sorted by newest first
  const ordersRaw = await Order.find()
    .sort({ createdAt: -1 })
    .populate('userId');

  // Format orders to match the expected structure in OrdersClient
  const formattedOrders = ordersRaw.map(order => ({
    id: order.orderNumber || order._id.toString(),
    date: new Date(order.createdAt).toISOString().split('T')[0],
    customer: order.userId 
      ? `${order.userId.firstName} ${order.userId.lastName}` 
      : (order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 'Guest'),
    territory: order.shippingAddress?.country || 'Unknown',
    grandTotal: `${order.currency || 'GBP'} ${(order.total || 0).toFixed(2)}`,
    orderStatus: order.status || 'pending',
    paymentStatus: order.paymentStatus || 'pending'
  }));

  return <OrdersClient initialOrders={formattedOrders} />;
}
