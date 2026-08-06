import {
  Schema,
  model,
  type InferSchemaType,
} from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    filling: {
      type: String,
      trim: true,
      default: '',
    },

    sauces: {
      type: [String],
      default: [],
    },

    extras: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '',
      },

      address: {
        type: String,
        trim: true,
        default: '',
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (
          items: unknown[],
        ) => Array.isArray(items) && items.length > 0,
        message:
          'An order must contain at least one item.',
      },
    },

    orderType: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true,
    },

    branchName: {
      type: String,
      trim: true,
      default: '',
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        'cash-on-delivery',
        'easypaisa',
        'jazzcash',
        'card',
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        'unpaid',
        'verification-required',
        'paid',
        'failed',
        'refunded',
      ],
      default: 'unpaid',
    },

    paymentProof: {
      transactionId: {
        type: String,
        trim: true,
        default: '',
      },

      senderNumber: {
        type: String,
        trim: true,
        default: '',
      },

      screenshotUrl: {
        type: String,
        trim: true,
        default: '',
      },
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'ready',
        'out-for-delivery',
        'completed',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },

    customerNotes: {
      type: String,
      trim: true,
      default: '',
    },

    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export type OrderDocument =
  InferSchemaType<typeof orderSchema>;

export const Order =
  model('Order', orderSchema);