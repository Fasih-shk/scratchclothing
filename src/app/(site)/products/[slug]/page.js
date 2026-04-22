// Server Component — no 'use client'
import Link from 'next/link';
import { notFound } from 'next/navigation';
// import { getProductBySlug, products } from '@/data/products'; // REMOVED MOCK DATA
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // TODO: Fetch product from Frappe API
  return { title: 'Product Details | Scratch®' };
}

export async function generateStaticParams() {
  return []; // No static params during cleanup
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  // Placeholder for Frappe integration
  const product = null; 

  if (!product) notFound();

  return <ProductDetailClient product={product} relatedProducts={[]} />;
}
