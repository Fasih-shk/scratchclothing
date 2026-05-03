import connectDB from './src/lib/mongodb.js';
import Product from './src/models/Product.js';

async function updateSlug() {
  await connectDB();
  const product = await Product.findOne({ slug: 'test-product' });
  if (product) {
    product.slug = 'product-details';
    await product.save();
    console.log('Product slug updated from test-product to product-details');
  } else {
    console.log('Product with slug test-product not found');
  }
  process.exit(0);
}

updateSlug();
