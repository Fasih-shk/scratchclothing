import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import CollectionsClient from './CollectionsClient';

export const metadata = {
  title: 'The Collection | Scratch®',
  description: 'Explore the full Scratch® collection. Premium streetwear built from zero.',
};

export default async function CollectionsPage() {
  await connectDB();

  const [products, categories] = await Promise.all([
    Product.find({ status: 'active' }).sort({ createdAt: -1 }).lean(),
    Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean()
  ]);

  // Sanitize for client component
  const sanitizedProducts = JSON.parse(JSON.stringify(products));
  const sanitizedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <CollectionsClient 
      initialProducts={sanitizedProducts} 
      initialCategories={sanitizedCategories} 
    />
  );
}
