import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        variant: {
          size: String,
          color: String,
          // Add other variant fields as needed
        },
        price: {
          type: Number,
          required: true,
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
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Subtotals
    subtotal: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },

    // Coupon & Promotions
    couponCode: String,
    couponDiscount: {
      type: Number,
      default: 0,
    },

    // Cart Status
    status: {
      type: String,
      enum: ['active', 'abandoned', 'converted'],
      default: 'active',
      index: true,
    },
    abandonedAt: Date,

    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ status: 1, updatedAt: -1 });

// Auto-update cart status to abandoned after 24 hours of inactivity
cartSchema.pre('save', function (next) {
  if (this.status === 'active') {
    const now = new Date();
    const lastUpdated = new Date(this.updatedAt);
    const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      this.status = 'abandoned';
      this.abandonedAt = now;
    }
  }
  next();
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
