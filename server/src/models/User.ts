import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from 'mongoose';

export type UserRole =
  | 'customer'
  | 'admin';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    crunchPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  },
);

export type UserDocument =
  InferSchemaType<typeof userSchema>;

export const User =
  mongoose.models.User ||
  model('User', userSchema);