import mongoose from 'mongoose';

const inventoryHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true,
      index: true,
    },

    // Stock Movement
    type: {
      type: String,
      enum: [
        'restock',
        'sale',
        'return',
        'adjustment',
        'damage',
        'theft',
        'sample',
        'transfer',
      ],
      required: true,
      index: true,
    },

    // Quantity Change
    quantityBefore: Number,
    quantityAfter: Number,
    quantityChanged: {
      type: Number,
      required: true,
    },

    // Reference Information
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    returnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Return',
    },
    purchaseOrderId: String,

    // Details
    reason: String,
    notes: String,

    // User Information
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedByRole: {
      type: String,
      enum: ['admin', 'system', 'vendor'],
    },

    // Variant Information
    variant: {
      size: String,
      color: String,
      sku: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
inventoryHistorySchema.index({ productId: 1, createdAt: -1 });
inventoryHistorySchema.index({ type: 1, createdAt: -1 });
inventoryHistorySchema.index({ orderId: 1 });

export default mongoose.models.InventoryHistory ||
  mongoose.model('InventoryHistory', inventoryHistorySchema);
