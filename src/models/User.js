import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Authentication & Identity
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password by default
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[+]?\d{7,15}$/, 'Please provide a valid phone number'],
    },
    avatar: {
      type: String,
      default: null,
    },

    // Address Information
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    defaultShippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    defaultBillingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },

    // Account Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    isActive: {
      type: Boolean,
      default: true,
    },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    // OTP
    otpCode: String,
    otpExpiry: Date,

    // Preferences
    marketingConsent: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: 'GBP',
      enum: ['GBP', 'USD', 'EUR'],
    },

    // Account Metadata
    role: {
      type: String,
      enum: ['customer', 'admin', 'vendor'],
      default: 'customer',
    },
    notes: String,
    totalSpent: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Password hashing will be handled by auth service
    // This is a placeholder for bcrypt integration
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
