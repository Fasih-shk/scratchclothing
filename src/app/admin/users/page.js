import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import UsersClient from "./UsersClient";

export const dynamic = 'force-dynamic';


export default async function AdminUsers() {
  // Prevent attempting a DB connection during static builds when no MONGODB_URI is provided
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI not set — skipping DB fetch for /admin/users during build",
    );
    return <UsersClient initialCustomers={[]} />;
  }

  await connectDB();

  // Fetch all users and subscribers
  const [usersRaw, subscribersRaw] = await Promise.all([
    User.find().sort({ createdAt: -1 }),
    Subscriber.find().sort({ createdAt: -1 })
  ]);

  const formattedUsers = await Promise.all(
    usersRaw.map(async (user) => {
      let lifetimeValue = user.totalSpent || 0;

      return {
        customerId: user._id.toString(),
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
        email: user.email,
        segment: user.role === "wholesale" ? "Wholesale" : "Retail",
        city: "Unknown",
        lifetimeValue: `${user.currency || "GBP"} ${lifetimeValue.toFixed(2)}`,
        status: user.isActive ? "Active" : "Watch",
      };
    })
  );

  const formattedSubscribers = subscribersRaw.map((sub) => ({
    customerId: sub._id.toString(),
    name: sub.firstName || "Subscriber",
    email: sub.email,
    segment: "Subscriber",
    city: "Unknown",
    lifetimeValue: "GBP 0.00",
    status: sub.isActive ? "Active" : "Watch",
  }));

  const allCustomers = [...formattedUsers, ...formattedSubscribers];

  return <UsersClient initialCustomers={allCustomers} />;
}

