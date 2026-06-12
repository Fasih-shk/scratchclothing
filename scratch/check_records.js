import connectDB from '../src/lib/mongodb.js';
import User from '../src/models/User.js';
import Order from '../src/models/Order.js';
import Subscriber from '../src/models/Subscriber.js';

async function check() {
  await connectDB();
  
  const users = await User.find({}).sort({ createdAt: -1 });
  const orders = await Order.find({}).sort({ createdAt: -1 });
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

  console.log('Total Users:', users.length);
  console.log('Users:', JSON.stringify(users.map(u => ({ id: u._id, email: u.email, name: `${u.firstName} ${u.lastName}`, role: u.role, createdAt: u.createdAt })), null, 2));

  console.log('Total Orders:', orders.length);
  console.log('Orders:', JSON.stringify(orders.map(o => ({ id: o._id, orderNumber: o.orderNumber, email: o.email, status: o.status, paymentStatus: o.paymentStatus, total: o.total, createdAt: o.createdAt })), null, 2));

  console.log('Total Subscribers:', subscribers.length);
  console.log('Subscribers:', JSON.stringify(subscribers.map(s => ({ id: s._id, email: s.email, name: s.firstName, createdAt: s.createdAt })), null, 2));

  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
