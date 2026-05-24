import mongoose from 'mongoose';

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const products = await Product.find({}, 'name session status').lean();
    console.log('Products:', JSON.stringify(products, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkProducts();
