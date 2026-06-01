import connectDB from '../src/lib/mongodb.js';
import Subscriber from '../src/models/Subscriber.js';

async function check() {
  await connectDB();
  const list = await Subscriber.find({});
  console.log('Subscribers in DB:', JSON.stringify(list, null, 2));
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
