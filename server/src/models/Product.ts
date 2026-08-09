import mongoose, { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    productId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2 },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    spiceLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    hasCheese: { type: Boolean, default: false },
    hasSausage: { type: Boolean, default: false },
    image: { type: String, default: '', trim: true },
    popular: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product || model('Product', productSchema);
