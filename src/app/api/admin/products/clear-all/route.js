import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { authenticateAdmin } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const result = await Product.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} products successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Clear all products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete products' },
      { status: 500 }
    );
  }
}
