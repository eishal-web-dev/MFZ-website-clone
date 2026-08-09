import { Router } from 'express';

import { Product } from '../models/Product.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_request, response) => {
  try {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });
    response.json({
      success: true,
      products: products.map((product) => ({
        id: product.productId,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        spiceLevel: product.spiceLevel,
        hasCheese: product.hasCheese,
        hasSausage: product.hasSausage,
        image: product.image,
        popular: product.popular,
      })),
    });
  } catch (error) {
    console.error('Load products error:', error);
    response.status(500).json({ success: false, message: 'Unable to load menu products.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (request, response) => {
  try {
    const { name, category, price, description, spiceLevel, hasCheese, hasSausage, image, popular } = request.body;

    if (!name?.trim() || !category?.trim() || !description?.trim() || !Number.isFinite(Number(price))) {
      response.status(400).json({ success: false, message: 'Name, category, price and description are required.' });
      return;
    }

    const latest = await Product.findOne().sort({ productId: -1 }).select('productId');
    const productId = Math.max(1000, Number(latest?.productId || 999) + 1);
    const product = await Product.create({
      productId,
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      description: description.trim(),
      spiceLevel: Number(spiceLevel || 0),
      hasCheese: Boolean(hasCheese),
      hasSausage: Boolean(hasSausage),
      image: image?.trim() || '',
      popular: Boolean(popular),
    });

    response.status(201).json({ success: true, message: 'Product added to the menu.', product });
  } catch (error) {
    console.error('Create product error:', error);
    response.status(500).json({ success: false, message: 'Unable to add the product.' });
  }
});

export default router;
