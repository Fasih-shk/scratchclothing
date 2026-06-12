import connectDB from '../src/lib/mongodb.js';
import Product from '../src/models/Product.js';

async function run() {
  try {
    await connectDB();
    const products = await Product.find({}).lean();
    console.log(`Found ${products.length} products in the database:`);
    products.forEach(p => {
      console.log(`- ID: ${p._id}, Name: "${p.name}", Status: "${p.status}", Featured: ${p.isFeatured}, Session: "${p.session}"`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
