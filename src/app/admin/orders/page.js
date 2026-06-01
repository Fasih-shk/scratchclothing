import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import OrdersClient from "./OrdersClient";

export const dynamic = 'force-dynamic';


export default async function AdminOrders() {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI not set — skipping DB fetch for /admin/orders during build",
    );
    return <OrdersClient initialOrders={[]} />;
  }

  await connectDB();

  // Fetch all orders from the database, sorted by newest first
  const ordersRaw = await Order.find()
    .sort({ createdAt: -1 })
    .populate("userId");

  // Format orders to match the expected structure in OrdersClient
  const formattedOrders = ordersRaw.map((order) => ({
    id: order.orderNumber || order._id.toString(),
    date: new Date(order.createdAt).toISOString().split("T")[0],
    customer: order.userId
      ? `${order.userId.firstName} ${order.userId.lastName}`
      : order.shippingAddress?.firstName
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        : "Guest",
    territory: order.shippingAddress?.country || "Unknown",
    grandTotal: `${order.currency || "GBP"} ${(order.total || 0).toFixed(2)}`,
    orderStatus: order.status || "pending",
    paymentStatus: order.paymentStatus || "pending",
    couponCode: order.couponCode || null,
  }));

  return <OrdersClient initialOrders={formattedOrders} />;
}
