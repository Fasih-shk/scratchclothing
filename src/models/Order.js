import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order Identification
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Order Items
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        variant: {
          size: String,
          color: String,
        },
        discount: {
          type: Number,
          default: 0,
        },
        discountType: {
          type: String,
          enum: ['percentage', 'fixed'],
          default: 'percentage',
        },
        subtotal: Number,
      },
    ],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    shippingMethod: String,
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: String,
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'GBP',
      enum: ['GBP', 'USD', 'EUR'],
    },

    // Shipping Address
    shippingAddress: {
      firstName: String,
      lastName: String,
      phoneNumber: String,
      streetAddress: String,
      streetAddress2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Billing Address
    billingAddress: {
      firstName: String,
      lastName: String,
      phoneNumber: String,
      streetAddress: String,
      streetAddress2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
      index: true,
    },
    transactionId: String,

    // Order Status
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'pending',
      index: true,
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],

    // Shipping & Tracking
    trackingNumber: String,
    carrier: String,
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,

    // Returns
    isReturnable: {
      type: Boolean,
      default: true,
    },
    returnDeadline: Date,
    returnReason: String,
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'returned', 'refunded'],
      default: 'none',
    },

    // Customer Communication
    email: {
      type: String,
      required: true,
    },
    phone: String,
    notes: String,
    adminNotes: String,

    // Metadata
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin'],
      default: 'web',
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
// Note: orderNumber, userId, paymentStatus already indexed via index:true on field definitions
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ email: 1 });

// Generate order number on creation
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
