import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['shipping', 'billing', 'both'],
      default: 'both',
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required'],
    },
    streetAddress2: String, // Apartment, suite, etc.
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: String,
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

addressSchema.index({ userId: 1 });

export default mongoose.models.Address || mongoose.model('Address', addressSchema);
