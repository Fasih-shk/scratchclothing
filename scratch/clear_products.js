import connectDB from '../src/lib/mongodb.js';
import Product from '../src/models/Product.js';

async function run() {
  try {
    await connectDB();
    console.log('🔄 Deleting all products from the database...');
    const result = await Product.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing products:', err);
    process.exit(1);
  }
}

run();
