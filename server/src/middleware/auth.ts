import type {
  NextFunction,
  Request,
  Response,
} from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';

interface JwtPayload {
  sub: string;
}

export interface AuthenticatedRequest
  extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
  };
}

/* =========================================================
   REQUIRE LOGIN
========================================================= */

export async function requireAuth(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization =
      request.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      });

      return;
    }

    const token = authorization
      .slice(7)
      .trim();

    if (!token) {
      response.status(401).json({
        success: false,
        message: 'Authentication token is missing.',
      });

      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not configured.',
      );
    }

    const decoded = jwt.verify(
      token,
      secret,
    ) as JwtPayload;

    if (!decoded.sub) {
      response.status(401).json({
        success: false,
        message:
          'Authentication token does not contain a user ID.',
      });

      return;
    }

    const user = await User.findById(
      decoded.sub,
    ).select('name email role');

    if (!user) {
      response.status(401).json({
        success: false,
        message: 'User account was not found.',
      });

      return;
    }

    request.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role:
        user.role === 'admin'
          ? 'admin'
          : 'customer',
    };

    next();
  } catch (error) {
    console.error(
      'Authentication error:',
      error,
    );

    response.status(401).json({
      success: false,
      message:
        'Your session is invalid or has expired.',
    });
  }
}

/* =========================================================
   REQUIRE ADMIN
========================================================= */

export function requireAdmin(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void {
  const configuredAdminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  const signedInEmail =
    request.user?.email
      ?.trim()
      .toLowerCase();

  const signedInRole =
    request.user?.role;

  console.log('Admin authorization check:', {
    configuredAdminEmail,
    signedInEmail,
    signedInRole,
    emailMatches:
      signedInEmail === configuredAdminEmail,
    roleMatches:
      signedInRole === 'admin',
  });

  if (!configuredAdminEmail) {
    response.status(500).json({
      success: false,
      message:
        'ADMIN_EMAIL is missing from the server configuration.',
    });

    return;
  }

  const authorized =
    signedInRole === 'admin' &&
    signedInEmail === configuredAdminEmail;

  if (!authorized) {
    response.status(403).json({
      success: false,
      message:
        'You do not have permission to access the admin portal.',
    });

    return;
  }

  next();
}