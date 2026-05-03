import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: String,

    // Categorization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    tags: [String],
    collection: {
      type: String,
      enum: ['mens', 'womens', 'unisex', 'winter', 'summer'],
      index: true,
    },

    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: Number,
    currency: {
      type: String,
      default: 'GBP',
      enum: ['GBP', 'USD', 'EUR'],
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },

    // Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isDefault: Boolean,
      },
    ],

    // Variants (Size, Color, etc.)
    variants: [
      {
        name: String, // e.g., "Size", "Color"
        options: [
          {
            value: String, // e.g., "S", "M", "L"
            sku: String,
          },
        ],
      },
    ],

    // Stock & Inventory
    inventory: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      available: {
        type: Number,
        default: 0,
        min: 0,
      },
      reserved: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },

    // Product Details
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    weight: {
      value: Number,
      unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
    },
    material: String,
    brand: String,

    // Ratings & Reviews
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    // SEO
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],

    // Shipping
    requiresShipping: {
      type: Boolean,
      default: true,
    },
    shippingClass: String,

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },

    // Metadata
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ collection: 1 });
productSchema.index({ status: 1, isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Calculate discount price
productSchema.virtual('discountedPrice').get(function () {
  if (this.discount && this.discount > 0) {
    if (this.discountType === 'percentage') {
      return this.price * (1 - this.discount / 100);
    } else {
      return this.price - this.discount;
    }
  }
  return this.price;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
