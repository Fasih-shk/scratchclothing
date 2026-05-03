import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
      index: true,
    },

    // Stock Levels
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0,
    },
    available: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Stock Management
    reorderLevel: {
      type: Number,
      default: 10,
    },
    reorderQuantity: {
      type: Number,
      default: 100,
    },
    isLowStock: {
      type: Boolean,
      default: false,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },

    // Warehouse/Location
    warehouse: {
      name: String,
      location: String,
      code: String,
    },

    // Variants
    variants: [
      {
        size: String,
        color: String,
        sku: String,
        quantity: Number,
        reserved: Number,
        available: Number,
      },
    ],

    // Stock History
    stockHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryHistory',
      },
    ],

    // Last Stock Check
    lastStockCheckDate: Date,
    lastRestockDate: Date,

    // Metadata
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Virtual to calculate available stock
inventorySchema.virtual('calculatedAvailable').get(function () {
  return this.quantity - this.reserved;
});

inventorySchema.set('toJSON', { virtuals: true });

// Indexes
inventorySchema.index({ productId: 1 });
inventorySchema.index({ isLowStock: 1 });
inventorySchema.index({ isOutOfStock: 1 });

export default mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
