import { Router } from 'express';

import {
  requireAdmin,
  requireAuth,
  type AuthenticatedRequest,
} from '../middleware/auth';

const adminRouter = Router();

adminRouter.get(
  '/dashboard',
  requireAuth,
  requireAdmin,
  async (
    request: AuthenticatedRequest,
    response,
  ) => {
    return response.json({
      success: true,

      admin: request.user,

      dashboard: {
        ordersToday: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,

        paidOrders: 0,
        unpaidOrders: 0,
        verificationRequired: 0,

        revenueToday: 0,
        revenueThisMonth: 0,
        revenueThisYear: 0,

        repeatCustomers: 0,
      },
    });
  },
);

export default adminRouter;