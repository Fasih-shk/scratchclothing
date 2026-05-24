import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // Discount Details
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null, // Maximum discount amount if percentage
    },

    // Conditions
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxUsagePerCoupon: {
      type: Number,
      default: null, // null = unlimited
    },
    maxUsagePerUser: {
      type: Number,
      default: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
    },

    // Eligibility
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    applicableUserGroups: [String], // e.g., ['new_customer', 'vip']

    // Validity Period
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Restrictions
    applicableCollections: [String], // e.g., ['mens', 'womens', 'summer']
    excludeOnSale: {
      type: Boolean,
      default: false,
    },
    appliesOnce: {
      type: Boolean,
      default: false, // If true, can only be used once
    },

    // Description & Marketing
    description: String,
    name: String,

    // Status Tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
// Note: code already indexed via index:true on field definition
couponSchema.index({ isActive: 1, endDate: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
