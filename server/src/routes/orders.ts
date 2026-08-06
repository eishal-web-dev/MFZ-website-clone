import { Router } from 'express';

import { Order } from '../models/Order.js';
import {
  requireAdmin,
  requireAuth,
} from '../middleware/auth.js';

const router = Router();

const allowedOrderStatuses = [
  'pending',
  'confirmed',
  'processing',
  'ready',
  'out-for-delivery',
  'completed',
  'cancelled',
] as const;

const allowedPaymentStatuses = [
  'unpaid',
  'verification-required',
  'paid',
  'failed',
  'refunded',
] as const;

/* =========================================================
   CREATE ORDER
========================================================= */

router.post('/', async (request, response) => {
  try {
    const orderNumber = `MFZ-${Date.now()
      .toString()
      .slice(-8)}`;

    const order = await Order.create({
      ...request.body,
      orderNumber,
    });

    response.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);

    response.status(500).json({
      success: false,
      message: 'Unable to create order.',
    });
  }
});

/* =========================================================
   GET ALL ORDERS — ADMIN ONLY
========================================================= */

router.get(
  '/',
  requireAuth,
  requireAdmin,
  async (_request, response) => {
    try {
      const orders = await Order.find().sort({
        createdAt: -1,
      });

      response.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error('Get orders error:', error);

      response.status(500).json({
        success: false,
        message: 'Unable to load orders.',
      });
    }
  },
);

/* =========================================================
   GET ONE ORDER — ADMIN ONLY
========================================================= */

router.get(
  '/:orderId',
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const order = await Order.findById(
        request.params.orderId,
      );

      if (!order) {
        response.status(404).json({
          success: false,
          message: 'Order not found.',
        });

        return;
      }

      response.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error('Get order error:', error);

      response.status(500).json({
        success: false,
        message: 'Unable to load the order.',
      });
    }
  },
);

/* =========================================================
   UPDATE ORDER STATUS — ADMIN ONLY
========================================================= */

router.patch(
  '/:orderId/status',
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const { status } = request.body as {
        status?: string;
      };

      if (
        !status ||
        !allowedOrderStatuses.includes(
          status as (typeof allowedOrderStatuses)[number],
        )
      ) {
        response.status(400).json({
          success: false,
          message: 'Invalid order status.',
        });

        return;
      }

      const order = await Order.findByIdAndUpdate(
        request.params.orderId,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!order) {
        response.status(404).json({
          success: false,
          message: 'Order not found.',
        });

        return;
      }

      response.status(200).json({
        success: true,
        message: `Order changed to ${status}.`,
        order,
      });
    } catch (error) {
      console.error(
        'Update order status error:',
        error,
      );

      response.status(500).json({
        success: false,
        message: 'Unable to update order status.',
      });
    }
  },
);

/* =========================================================
   UPDATE PAYMENT STATUS — ADMIN ONLY
========================================================= */

router.patch(
  '/:orderId/payment',
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const { paymentStatus } = request.body as {
        paymentStatus?: string;
      };

      if (
        !paymentStatus ||
        !allowedPaymentStatuses.includes(
          paymentStatus as (typeof allowedPaymentStatuses)[number],
        )
      ) {
        response.status(400).json({
          success: false,
          message: 'Invalid payment status.',
        });

        return;
      }

      const order = await Order.findByIdAndUpdate(
        request.params.orderId,
        {
          paymentStatus,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!order) {
        response.status(404).json({
          success: false,
          message: 'Order not found.',
        });

        return;
      }

      response.status(200).json({
        success: true,
        message: 'Payment status updated.',
        order,
      });
    } catch (error) {
      console.error(
        'Update payment status error:',
        error,
      );

      response.status(500).json({
        success: false,
        message:
          'Unable to update payment status.',
      });
    }
  },
);

export default router;