import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema(
  {
    // Return Identification
    returnNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Items Being Returned
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
        price: Number,
        variant: {
          size: String,
          color: String,
        },
        condition: {
          type: String,
          enum: ['new', 'like_new', 'good', 'fair', 'poor'],
          required: true,
        },
      },
    ],

    // Return Details
    reason: {
      type: String,
      enum: [
        'defective',
        'not_as_described',
        'changed_mind',
        'too_small',
        'too_large',
        'color_different',
        'damaged_in_shipping',
        'other',
      ],
      required: true,
    },
    reasonNotes: String,

    // Return Process
    status: {
      type: String,
      enum: [
        'requested',
        'approved',
        'rejected',
        'shipped',
        'received',
        'inspected',
        'refunded',
        'exchanged',
      ],
      default: 'requested',
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

    // Refund/Exchange
    returnType: {
      type: String,
      enum: ['refund', 'exchange'],
      required: true,
    },
    exchangeProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    exchangeVariant: {
      size: String,
      color: String,
    },

    // Refund Information
    refundAmount: Number,
    refundMethod: {
      type: String,
      enum: ['original_payment', 'store_credit', 'bank_transfer'],
    },
    refundTransactionId: String,
    refundProcessedDate: Date,

    // Shipping
    returnShippingLabel: String,
    returnTrackingNumber: String,
    shippingCarrier: String,
    shippedDate: Date,
    receivedDate: Date,

    // Inspection
    inspectionNotes: String,
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    inspectionDate: Date,
    inspectionResult: {
      type: String,
      enum: ['approved', 'partial', 'rejected'],
    },

    // Approval/Rejection
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
    rejectionReason: String,

    // Timeline
    requestDate: {
      type: Date,
      default: Date.now,
    },
    deadlineDate: Date,

    // Additional Info
    customerNotes: String,
    adminNotes: String,
    attachments: [
      {
        url: String,
        type: String, // photo, video, receipt
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate return number
returnSchema.pre('save', async function (next) {
  if (this.isNew && !this.returnNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.returnNumber = `RET-${year}${month}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
// Note: returnNumber, orderId, userId already indexed via index:true on field definitions
returnSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Return || mongoose.model('Return', returnSchema);
