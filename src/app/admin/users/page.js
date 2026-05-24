import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import UsersClient from "./UsersClient";

export default async function AdminUsers() {
  // Prevent attempting a DB connection during static builds when no MONGODB_URI is provided
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI not set — skipping DB fetch for /admin/users during build",
    );
    return <UsersClient initialCustomers={[]} />;
  }

  await connectDB();

  // Fetch all users
  const usersRaw = await User.find().sort({ createdAt: -1 });

  // For lifetime value, we could aggregate orders by userId, but for simplicity we will just do a sum if possible
  // Or we can just use the totalSpent field if it's maintained
  const formattedUsers = await Promise.all(
    usersRaw.map(async (user) => {
      // Some models might not have totalSpent perfectly updated, so we could calculate it or just rely on it
      let lifetimeValue = user.totalSpent || 0;

      // If you want to calculate live:
      // const userOrders = await Order.find({ userId: user._id, paymentStatus: { $in: ['completed', 'paid'] } });
      // lifetimeValue = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        customerId: user._id.toString(),
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
        email: user.email,
        segment: user.role === "wholesale" ? "Wholesale" : "Retail",
        city: "Unknown", // Need address populate if we want accurate city
        lifetimeValue: `${user.currency || "GBP"} ${lifetimeValue.toFixed(2)}`,
        status: user.isActive ? "Active" : "Watch", // Just a mapping example
      };
    }),
  );

  return <UsersClient initialCustomers={formattedUsers} />;
}
