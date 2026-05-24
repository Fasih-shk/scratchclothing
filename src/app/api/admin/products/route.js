import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { authenticateAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const collection = searchParams.get('collection') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    await connectDB();

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Collection filter
    if (collection) {
      query.collection = collection;
    }

    // Sort options
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean();

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories,
    });
  } catch (error) {
    console.error('Products list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name, slug, description, category, price, originalPrice, discount, discountType, currency, images, sku, status, isFeatured, isNewArrival, collection, session, inventory, tags, shortDescription, material, brand, lowStockThreshold, trackInventory, seoTitle, seoDescription, seoKeywords, requiresShipping } = body;

    // Validation
    if (!name || !slug || !description || !category || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, description, category and price are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for existing slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Check for existing SKU if provided
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return NextResponse.json(
          { success: false, error: 'Product with this SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      slug: slug.toLowerCase(),
      description,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discount: discount ? parseFloat(discount) : 0,
      discountType: discountType || 'percentage',
      currency: currency || 'GBP',
      images: images || [],
      sku: sku || undefined,
      status: status || 'active',
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false,
      collection: collection || undefined,
      session: session || undefined,
      tags: tags || [],
      shortDescription: shortDescription || undefined,
      material: material || undefined,
      brand: brand || undefined,
      lowStockThreshold: lowStockThreshold || 10,
      trackInventory: trackInventory !== false,
      inventory: inventory || { total: 0, available: 0, reserved: 0 },
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || [],
      requiresShipping: requiresShipping !== false,
    });

    await product.populate('category', 'name slug');

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}