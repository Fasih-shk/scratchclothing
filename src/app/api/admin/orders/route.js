import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    await connectDB();

    // Try to find a user, or use a dummy email if none exist
    let user = await User.findOne();
    
    // Try to find a product
    let product = await Product.findOne();

    if (!product) {
      return NextResponse.json({ error: 'No products available to create an order.' }, { status: 400 });
    }

    const count = await Order.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(6, '0')}`;

    const orderData = {
      orderNumber,
      userId: user ? user._id : null,
      email: user ? user.email : 'guest@example.com',
      items: [
        {
          productId: product._id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          variant: { size: 'M', color: 'Black' },
          subtotal: product.price
        }
      ],
      subtotal: product.price,
      total: product.price + 10, // Add dummy shipping
      shippingCost: 10,
      currency: 'GBP',
      shippingAddress: {
        firstName: user ? user.firstName : 'John',
        lastName: user ? user.lastName : 'Doe',
        phoneNumber: '1234567890',
        streetAddress: '123 Main St',
        city: 'London',
        country: 'UK',
        postalCode: 'W1 1AA'
      },
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
      status: 'pending',
    };

    // Note: orderNumber is auto-generated in the schema pre-save hook
    const newOrder = await Order.create(orderData);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating dummy order:', error);
    return NextResponse.json({ error: 'Failed to create order', details: error.message, stack: error.stack }, { status: 500 });
  }
}
