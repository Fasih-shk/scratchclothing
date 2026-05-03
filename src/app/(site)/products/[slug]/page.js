import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug, status: 'active' }).lean();
  
  if (!product) return { title: 'Product Not Found | Scratch®' };
  
  return { 
    title: `${product.name} | Scratch®`,
    description: product.shortDescription || product.description
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  await connectDB();
  
  const product = await Product.findOne({ slug, status: 'active' })
    .populate('category', 'name slug')
    .lean();

  if (!product) notFound();

  // Fetch related products from same category
  const relatedProducts = await Product.find({ 
    category: product.category._id,
    _id: { $ne: product._id },
    status: 'active'
  })
  .limit(4)
  .lean();

  // Convert MongoDB IDs to strings for the client component
  const sanitizedProduct = JSON.parse(JSON.stringify(product));
  const sanitizedRelated = JSON.parse(JSON.stringify(relatedProducts));

  return <ProductDetailClient product={sanitizedProduct} relatedProducts={sanitizedRelated} />;
}
