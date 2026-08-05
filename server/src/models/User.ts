import mongoose, {
  Schema,
  type InferSchemaType,
} from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
      default: '',
    },

    passwordHash: {
      type: String,
      select: false,
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
      default: '',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCodeHash: {
      type: String,
      select: false,
    },

    verificationCodeExpiresAt: {
      type: Date,
      select: false,
    },

    resetTokenHash: {
      type: String,
      select: false,
    },

    resetTokenExpiresAt: {
      type: Date,
      select: false,
    },

    crunchPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export type UserDocument =
  InferSchemaType<typeof userSchema>;

export const User =
  mongoose.models.User ??
  mongoose.model('User', userSchema);