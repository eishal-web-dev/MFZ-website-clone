import type {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';

type UserRole = 'customer' | 'admin';

interface RegisterBody {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

interface PublicUserSource {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  provider?: string;
  isVerified?: boolean;
  crunchPoints?: number;
  role?: UserRole;
}

/* =========================================================
   CREATE JWT
========================================================= */

function createToken(
  userId: string,
): string {
  const jwtSecret =
    process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      'JWT_SECRET is missing from server/.env',
    );
  }

  const expiresIn =
    process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      sub: userId,
    },
    jwtSecret,
    {
      expiresIn:
        expiresIn as jwt.SignOptions['expiresIn'],
    },
  );
}

/* =========================================================
   SAFE USER RESPONSE
========================================================= */

function toPublicUser(
  user: PublicUserSource,
) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    provider: user.provider ?? 'local',
    isVerified:
      user.isVerified ?? true,
    crunchPoints:
      user.crunchPoints ?? 0,
    role:
      user.role ?? 'customer',
  };
}

/* =========================================================
   REGISTER
========================================================= */

export async function register(
  request: Request<
    Record<string, never>,
    unknown,
    RegisterBody
  >,
  response: Response,
): Promise<void> {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = request.body;

    const cleanName =
      name?.trim();

    const cleanEmail =
      email?.trim().toLowerCase();

    const cleanPhone =
      phone?.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPhone ||
      !password
    ) {
      response.status(400).json({
        success: false,
        message:
          'Name, email, phone and password are required.',
      });

      return;
    }

    if (cleanName.length < 2) {
      response.status(400).json({
        success: false,
        message:
          'Please enter a valid name.',
      });

      return;
    }

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      );

    if (!validEmail) {
      response.status(400).json({
        success: false,
        message:
          'Please enter a valid email address.',
      });

      return;
    }

    const cleanPassword =
      password.trim();

    if (cleanPassword.length < 8) {
      response.status(400).json({
        success: false,
        message:
          'Password must contain at least 8 characters.',
      });

      return;
    }

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      response.status(409).json({
        success: false,
        message:
          'An account already exists with this email.',
      });

      return;
    }

    const passwordHash =
      await bcrypt.hash(
        cleanPassword,
        12,
      );

    /*
     * Security:
     * Public registration always creates a customer.
     * Promote the official admin account manually
     * in MongoDB Atlas.
     */
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      provider: 'local',
      isVerified: true,
      crunchPoints: 0,
      role:
        cleanEmail === process.env.ADMIN_EMAIL?.trim().toLowerCase()
          ? 'admin'
          : 'customer',
    });

    const token = createToken(
      String(user._id),
    );

    response.status(201).json({
      success: true,
      message:
        'Account created successfully.',
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error(
      'Registration error:',
      error,
    );

    response.status(500).json({
      success: false,
      message:
        'Unable to create account. Please try again.',
    });
  }
}

/* =========================================================
   LOGIN
========================================================= */

export async function login(
  request: Request<
    Record<string, never>,
    unknown,
    LoginBody
  >,
  response: Response,
): Promise<void> {
  try {
    const {
      email,
      password,
    } = request.body;

    const cleanEmail =
      email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      response.status(400).json({
        success: false,
        message:
          'Email and password are required.',
      });

      return;
    }

    const user =
      await User.findOne({
        email: cleanEmail,
      }).select('+passwordHash');

    if (
      !user ||
      !user.passwordHash
    ) {
      response.status(401).json({
        success: false,
        message:
          'Incorrect email or password.',
      });

      return;
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!passwordMatches) {
      response.status(401).json({
        success: false,
        message:
          'Incorrect email or password.',
      });

      return;
    }

    const configuredAdminEmail =
      process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      configuredAdminEmail &&
      cleanEmail === configuredAdminEmail &&
      user.role !== 'admin'
    ) {
      user.role = 'admin';
      await user.save();
    }

    const token = createToken(
      String(user._id),
    );

    response.status(200).json({
      success: true,
      message:
        'Signed in successfully.',
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error(
      'Login error:',
      error,
    );

    response.status(500).json({
      success: false,
      message:
        'Unable to sign in. Please try again.',
    });
  }
}