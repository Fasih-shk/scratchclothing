import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDB();

    const product = await Product.findById(id).populate('category', 'name slug').lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check for existing slug if being updated
    if (body.slug && body.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: body.slug.toLowerCase() });
      if (existingProduct && existingProduct._id.toString() !== id) {
        return NextResponse.json(
          { success: false, error: 'Product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Check for existing SKU if being updated
    if (body.sku && body.sku !== product.sku) {
      const existingSku = await Product.findOne({ sku: body.sku });
      if (existingSku && existingSku._id.toString() !== id) {
        return NextResponse.json(
          { success: false, error: 'Product with this SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Update fields
    const updateFields = [
      'name', 'slug', 'description', 'shortDescription', 'category',
      'price', 'originalPrice', 'discount', 'discountType', 'currency',
      'images', 'sku', 'status', 'isFeatured', 'isNewArrival', 'collection',
      'tags', 'material', 'brand', 'lowStockThreshold', 'trackInventory',
      'seoTitle', 'seoDescription', 'seoKeywords', 'requiresShipping', 'inventory'
    ];

    updateFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'price' || field === 'originalPrice' || field === 'discount') {
          product[field] = parseFloat(body[field]);
        } else if (field === 'slug') {
          product[field] = body[field].toLowerCase();
        } else {
          product[field] = body[field];
        }
      }
    });

    await product.save();
    await product.populate('category', 'name slug');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}