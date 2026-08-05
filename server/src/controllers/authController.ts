import type {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';

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

  return jwt.sign(
    {
      sub: userId,
    },
    jwtSecret,
    {
      expiresIn: '7d',
    },
  );
}

function toPublicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  provider?: string;
  isVerified?: boolean;
  crunchPoints?: number;
}) {
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
  };
}

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

    const cleanName = name?.trim();
    const cleanEmail =
      email?.trim().toLowerCase();
    const cleanPhone = phone?.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPhone ||
      !password
    ) {
      response.status(400).json({
        message:
          'Name, email, phone and password are required.',
      });
      return;
    }

    if (cleanName.length < 2) {
      response.status(400).json({
        message:
          'Please enter a valid name.',
      });
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      )
    ) {
      response.status(400).json({
        message:
          'Please enter a valid email address.',
      });
      return;
    }

    if (password.length < 8) {
      response.status(400).json({
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
        message:
          'An account already exists with this email.',
      });
      return;
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      provider: 'local',
      isVerified: true,
      crunchPoints: 0,
    });

    const token = createToken(
      String(user._id),
    );

    response.status(201).json({
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
      message:
        'Unable to create account. Please try again.',
    });
  }
}

export async function login(
  request: Request<
    Record<string, never>,
    unknown,
    LoginBody
  >,
  response: Response,
): Promise<void> {
  try {
    const { email, password } =
      request.body;

    const cleanEmail =
      email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      response.status(400).json({
        message:
          'Email and password are required.',
      });
      return;
    }

    const user = await User.findOne({
      email: cleanEmail,
    }).select('+passwordHash');

    if (!user || !user.passwordHash) {
      response.status(401).json({
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
        message:
          'Incorrect email or password.',
      });
      return;
    }

    const token = createToken(
      String(user._id),
    );

    response.status(200).json({
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
      message:
        'Unable to sign in. Please try again.',
    });
  }
}