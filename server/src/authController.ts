import type {
  Request,
  Response,
} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

import { User } from '../models/User.js';
import {
  sendResetEmail,
  sendVerificationEmail,
} from '../services/emailService.js';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
);

function createToken(userId: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is missing.');
  }

  return jwt.sign(
    {
      sub: userId,
    },
    secret,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ?? '7d',
    },
  );
}

function generateVerificationCode(): string {
  return Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
}

function hashValue(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex');
}

function publicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider?: string;
  isVerified?: boolean;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    provider: user.provider,
    isVerified: user.isVerified,
  };
}

export async function register(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = request.body as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !password
    ) {
      response.status(400).json({
        message: 'All fields are required.',
      });
      return;
    }

    if (password.length < 8) {
      response.status(400).json({
        message:
          'Password must be at least 8 characters.',
      });
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
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

    const verificationCode =
      generateVerificationCode();

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      provider: 'local',
      isVerified: false,
      verificationCodeHash:
        hashValue(verificationCode),
      verificationCodeExpiresAt:
        new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendVerificationEmail(
      user.email,
      user.name,
      verificationCode,
    );

    response.status(201).json({
      message:
        'Account created. Check your email for the verification code.',
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: 'Unable to create account.',
    });
  }
}

export async function login(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const {
      email,
      password,
    } = request.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      response.status(400).json({
        message:
          'Email and password are required.',
      });
      return;
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
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

    if (!user.isVerified) {
      response.status(403).json({
        message:
          'Verify your email before signing in.',
      });
      return;
    }

    const token = createToken(
      String(user._id),
    );

    response.json({
      message: 'Signed in successfully.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: 'Unable to sign in.',
    });
  }
}

export async function googleAuth(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { credential } = request.body as {
      credential?: string;
    };

    if (!credential) {
      response.status(400).json({
        message:
          'Google credential is required.',
      });
      return;
    }

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    if (
      !payload?.sub ||
      !payload.email ||
      !payload.name
    ) {
      response.status(401).json({
        message:
          'Google account information is incomplete.',
      });
      return;
    }

    if (!payload.email_verified) {
      response.status(401).json({
        message:
          'The Google email is not verified.',
      });
      return;
    }

    let user = await User.findOne({
      email: payload.email.toLowerCase(),
    });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        phone: '',
        provider: 'google',
        googleId: payload.sub,
        avatar: payload.picture ?? '',
        isVerified: true,
      });
    } else {
      user.googleId =
        user.googleId ?? payload.sub;
      user.avatar =
        user.avatar || payload.picture || '';
      user.isVerified = true;

      await user.save();
    }

    const token = createToken(
      String(user._id),
    );

    response.json({
      message:
        'Google authentication successful.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);

    response.status(401).json({
      message:
        'Google authentication failed.',
    });
  }
}

export async function verifyEmail(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const {
      email,
      code,
    } = request.body as {
      email?: string;
      code?: string;
    };

    if (!email || !code) {
      response.status(400).json({
        message:
          'Email and verification code are required.',
      });
      return;
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select(
      '+verificationCodeHash +verificationCodeExpiresAt',
    );

    if (
      !user ||
      !user.verificationCodeHash ||
      !user.verificationCodeExpiresAt
    ) {
      response.status(400).json({
        message:
          'No active verification request was found.',
      });
      return;
    }

    if (
      user.verificationCodeExpiresAt.getTime() <
      Date.now()
    ) {
      response.status(400).json({
        message:
          'The verification code has expired.',
      });
      return;
    }

    if (
      hashValue(code) !==
      user.verificationCodeHash
    ) {
      response.status(400).json({
        message:
          'The verification code is incorrect.',
      });
      return;
    }

    user.isVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpiresAt =
      undefined;

    await user.save();

    response.json({
      message:
        'Email verified successfully.',
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message:
        'Unable to verify email.',
    });
  }
}

export async function resendVerification(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { email } = request.body as {
      email?: string;
    };

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (!user) {
      response.json({
        message:
          'If the account exists, a code has been sent.',
      });
      return;
    }

    if (user.isVerified) {
      response.status(400).json({
        message:
          'This email is already verified.',
      });
      return;
    }

    const code = generateVerificationCode();

    user.verificationCodeHash =
      hashValue(code);
    user.verificationCodeExpiresAt =
      new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    await sendVerificationEmail(
      user.email,
      user.name,
      code,
    );

    response.json({
      message:
        'A new verification code has been sent.',
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message:
        'Unable to resend the verification code.',
    });
  }
}

export async function forgotPassword(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { email } = request.body as {
      email?: string;
    };

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (user) {
      const resetToken =
        crypto.randomBytes(32).toString('hex');

      user.resetTokenHash =
        hashValue(resetToken);
      user.resetTokenExpiresAt =
        new Date(Date.now() + 60 * 60 * 1000);

      await user.save();

      const clientUrl =
        process.env.CLIENT_URL ??
        'http://localhost:5173';

      const resetUrl =
        `${clientUrl}/reset?token=` +
        encodeURIComponent(resetToken);

      await sendResetEmail(
        user.email,
        user.name,
        resetUrl,
      );
    }

    response.json({
      message:
        'If the account exists, reset instructions have been sent.',
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message:
        'Unable to send reset instructions.',
    });
  }
}

export async function resetPassword(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const {
      token,
      password,
    } = request.body as {
      token?: string;
      password?: string;
    };

    if (!token || !password) {
      response.status(400).json({
        message:
          'Token and new password are required.',
      });
      return;
    }

    if (password.length < 8) {
      response.status(400).json({
        message:
          'Password must be at least 8 characters.',
      });
      return;
    }

    const user = await User.findOne({
      resetTokenHash: hashValue(token),
      resetTokenExpiresAt: {
        $gt: new Date(),
      },
    }).select(
      '+resetTokenHash +resetTokenExpiresAt',
    );

    if (!user) {
      response.status(400).json({
        message:
          'The reset link is invalid or expired.',
      });
      return;
    }

    user.passwordHash =
      await bcrypt.hash(password, 12);
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;

    await user.save();

    response.json({
      message:
        'Password reset successfully.',
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message:
        'Unable to reset password.',
    });
  }
}