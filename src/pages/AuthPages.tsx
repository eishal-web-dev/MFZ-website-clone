import {
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { products } from '@/data/products';
import potatoImage from '@/assets/products/potatoeCD.png';

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://mfz-website-clone-production.up.railway.app/api';

const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
};

/* =========================================================
   TYPES
========================================================= */

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

interface FieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}

interface AuthMessageProps {
  type: 'success' | 'error';
  message: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider?: 'local';
  isVerified?: boolean;
  crunchPoints?: number;
}

interface AuthResponse {
  message?: string;
  token?: string;
  user?: AuthUser;
}

interface SignInForm {
  email: string;
  password: string;
}

interface SignUpForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/* =========================================================
   API HELPERS
========================================================= */

async function postJson<T>(
  url: string,
  payload: unknown,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Cannot connect to the MFZ server. Please try again shortly.',
    );
  }

  const data: unknown =
    await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as {
      message?: string;
    } | null;

    throw new Error(
      errorData?.message ??
        'Something went wrong. Please try again.',
    );
  }

  return data as T;
}

function saveAuthSession(
  response: AuthResponse,
): void {
  if (response.token) {
    localStorage.setItem(
      'mfz_auth_token',
      response.token,
    );
  }

  if (response.user) {
    localStorage.setItem(
      'mfz_user',
      JSON.stringify(response.user),
    );
  }

  window.dispatchEvent(
    new Event('mfz-auth-changed'),
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

function isStrongPassword(
  password: string,
): boolean {
  return password.length >= 8;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/* =========================================================
   AUTH SHELL
========================================================= */

function AuthShell({
  children,
  title,
  subtitle,
}: AuthShellProps) {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background: active.bgGradient,
      }}
    >
      <div className="grid min-h-screen md:grid-cols-2">
        {/* Left visual panel */}
        <section className="relative hidden overflow-hidden md:flex md:items-center md:justify-center">
          {/* Large MFZ background word */}
          <div
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[18vw] font-black leading-none opacity-[0.055]"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '-0.06em',
            }}
          >
            MFZ
          </div>

          {/* Background glow */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.22, 0.42, 0.22],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute h-[420px] w-[420px] rounded-full blur-[130px]"
            style={{
              background: active.accentColor,
            }}
          />

          {/* Floating particles */}
          {products.slice(0, 6).map(
            (product, index) => (
              <motion.div
                key={product.id}
                className="absolute h-3 w-3 rounded-full"
                style={{
                  background:
                    product.particleColor,
                  top: `${12 + index * 14}%`,
                  left:
                    index % 2 === 0
                      ? `${8 + index * 2}%`
                      : `${82 - index * 2}%`,
                  boxShadow: `0 0 20px ${product.particleColor}`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x:
                    index % 2 === 0
                      ? [0, 10, 0]
                      : [0, -10, 0],
                  opacity: [0.25, 0.85, 0.25],
                  scale: [0.85, 1.2, 0.85],
                }}
                transition={{
                  duration:
                    3.4 + index * 0.4,
                  repeat: Infinity,
                  delay: index * 0.28,
                  ease: 'easeInOut',
                }}
              />
            ),
          )}

          {/* Real potato corndog */}
          <motion.div
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -18, 0],
            }}
            transition={{
              rotate: {
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              y: {
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="relative z-10 flex h-[600px] w-[300px] items-center justify-center xl:h-[680px] xl:w-[340px]"
          >
            <img
              src={potatoImage}
              alt="MFZ Potato Corn Dog"
              className="h-full w-full select-none object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.58)]"
              draggable={false}
            />
          </motion.div>

          {/* Brand statement */}
          <div className="absolute bottom-12 left-10 z-20 max-w-sm xl:bottom-16 xl:left-16">
            <h2
              className="text-5xl font-black uppercase leading-[0.9] xl:text-6xl"
              style={{
                color: active.textColor,
                fontFamily:
                  'Anton, sans-serif',
              }}
            >
              Crunch
              <br />
              Different.
            </h2>

            <p
              className="mt-5 text-sm leading-relaxed xl:text-base"
              style={{
                color: active.textColor,
                opacity: 0.68,
              }}
            >
              Join MFZ, order your favourite
              Korean-style corndogs, save your
              details and unlock member rewards.
            </p>
          </div>
        </section>

        {/* Right form panel */}
        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 md:px-10 lg:px-14">
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-md"
          >
            <div>
              <h1
                className="text-4xl font-black leading-tight sm:text-5xl"
                style={{
                  color: active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                {title}
              </h1>

              <p
                className="mt-3 text-sm leading-relaxed sm:text-base"
                style={{
                  color: active.textColor,
                  opacity: 0.62,
                }}
              >
                {subtitle}
              </p>
            </div>

            <div className="mt-8">
              {children}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function Field({
  id,
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  required = true,
  error,
}: FieldProps) {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  const [showPassword, setShowPassword] =
    useState(false);

  const isPassword = type === 'password';

  const actualType =
    isPassword && showPassword
      ? 'text'
      : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-widest"
        style={{
          color: active.textColor,
          opacity: 0.65,
        }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          type={actualType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-xl px-4 py-3.5 outline-none transition-all placeholder:opacity-35"
          style={{
            paddingRight: isPassword
              ? '3rem'
              : undefined,
            background:
              'rgba(255,255,255,0.08)',
            color: active.textColor,
            border: `1px solid ${
              error
                ? '#ff5a67'
                : `${active.accentColor}33`
            }`,
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current,
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
            style={{
              color: active.textColor,
              opacity: 0.58,
            }}
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          className="mt-2 text-xs"
          style={{
            color: '#ff7b86',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   STATUS MESSAGE
========================================================= */

function AuthMessage({
  type,
  message,
}: AuthMessageProps) {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  const isSuccess = type === 'success';

  return (
    <div
      className="flex items-start gap-3 rounded-2xl p-4 text-sm leading-relaxed"
      style={{
        background: isSuccess
          ? 'rgba(37,211,102,0.1)'
          : 'rgba(225,29,42,0.12)',
        color: active.textColor,
        border: isSuccess
          ? '1px solid rgba(37,211,102,0.32)'
          : '1px solid rgba(225,29,42,0.38)',
      }}
    >
      {isSuccess ? (
        <CheckCircle2
          size={19}
          className="mt-0.5 shrink-0"
          style={{
            color: '#25D366',
          }}
        />
      ) : (
        <ShieldAlert
          size={19}
          className="mt-0.5 shrink-0"
          style={{
            color: '#ff6875',
          }}
        />
      )}

      <span>{message}</span>
    </div>
  );
}

/* =========================================================
   SIGN IN PAGE
========================================================= */

export function SignInPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const [form, setForm] =
    useState<SignInForm>({
      email: '',
      password: '',
    });

  const [errors, setErrors] =
    useState<Partial<SignInForm>>({});

  const [message, setMessage] =
    useState('');

  const [messageType, setMessageType] =
    useState<'success' | 'error'>(
      'error',
    );

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setMessage('');
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextErrors: Partial<SignInForm> =
      {};

    const email = normalizeEmail(
      form.email,
    );

    if (!isValidEmail(email)) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password =
        'Enter your password.';
    }

    if (
      Object.keys(nextErrors).length > 0
    ) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response =
        await postJson<AuthResponse>(
          AUTH_ENDPOINTS.login,
          {
            email,
            password: form.password,
          },
        );

      if (!response.token) {
        throw new Error(
          'The server did not return an authentication token.',
        );
      }

      saveAuthSession(response);

      setMessageType('success');
      setMessage(
        response.message ??
          'Signed in successfully.',
      );

      window.setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (error) {
      setMessageType('error');

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to sign in.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to your Crunch Club account."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <Field
          id="signin-email"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />

        <Field
          id="signin-password"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot"
            className="text-xs font-bold"
            style={{
              color: active.accentColor,
            }}
          >
            Forgot password?
          </Link>
        </div>

        {message && (
          <AuthMessage
            type={messageType}
            message={message}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
          style={{
            background: active.accentColor,
            color: active.onAccent,
          }}
        >
          {loading && (
            <Loader2
              size={18}
              className="animate-spin"
            />
          )}

          {loading
            ? 'Signing In...'
            : 'Sign In'}
        </button>
      </form>

      <p
        className="mt-6 text-center text-sm"
        style={{
          color: active.textColor,
          opacity: 0.62,
        }}
      >
        New here?{' '}
        <Link
          to="/signup"
          className="font-bold"
          style={{
            color: active.accentColor,
          }}
        >
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}

/* =========================================================
   SIGN UP PAGE
========================================================= */

export function SignUpPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const [form, setForm] =
    useState<SignUpForm>({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });

  const [errors, setErrors] =
    useState<Partial<SignUpForm>>({});

  const [message, setMessage] =
    useState('');

  const [messageType, setMessageType] =
    useState<'success' | 'error'>(
      'error',
    );

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setMessage('');
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextErrors: Partial<SignUpForm> =
      {};

    const name = form.name.trim();
    const email = normalizeEmail(
      form.email,
    );
    const phone = form.phone.trim();

    if (name.length < 2) {
      nextErrors.name =
        'Enter your full name.';
    }

    if (!isValidEmail(email)) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (phone.length < 10) {
      nextErrors.phone =
        'Enter a valid phone number.';
    }

    if (
      !isStrongPassword(form.password)
    ) {
      nextErrors.password =
        'Password must contain at least 8 characters.';
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (
      Object.keys(nextErrors).length > 0
    ) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response =
        await postJson<AuthResponse>(
          AUTH_ENDPOINTS.register,
          {
            name,
            email,
            phone,
            password: form.password,
          },
        );

      if (!response.token) {
        throw new Error(
          'The account was created, but the server did not return a login token.',
        );
      }

      saveAuthSession(response);

      setMessageType('success');
      setMessage(
        response.message ??
          'Account created successfully.',
      );

      window.setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (error) {
      setMessageType('error');

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create account.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Join the Crunch Club"
      subtitle="Create your account and start earning Crunch Points."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <Field
          id="signup-name"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name}
        />

        <Field
          id="signup-email"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />

        <Field
          id="signup-phone"
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+92 3XX XXXXXXX"
          autoComplete="tel"
          error={errors.phone}
        />

        <Field
          id="signup-password"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          error={errors.password}
        />

        <Field
          id="signup-confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={
            errors.confirmPassword
          }
        />

        {message && (
          <AuthMessage
            type={messageType}
            message={message}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
          style={{
            background: active.accentColor,
            color: active.onAccent,
          }}
        >
          {loading && (
            <Loader2
              size={18}
              className="animate-spin"
            />
          )}

          {loading
            ? 'Creating Account...'
            : 'Create Account'}
        </button>
      </form>

      <p
        className="mt-6 text-center text-sm"
        style={{
          color: active.textColor,
          opacity: 0.62,
        }}
      >
        Already a member?{' '}
        <Link
          to="/signin"
          className="font-bold"
          style={{
            color: active.accentColor,
          }}
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

/* =========================================================
   FORGOT PASSWORD PLACEHOLDER
========================================================= */

export function ForgotPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Password recovery will be available after an email service is connected."
    >
      <div
        className="rounded-3xl p-6"
        style={{
          background:
            'rgba(255,255,255,0.06)',
          border: `1px solid ${active.accentColor}33`,
        }}
      >
        <AuthMessage
          type="error"
          message="Password-reset emails are not enabled yet. Please contact MFZ support or create a new account during testing."
        />

        <Link
          to="/signin"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase"
          style={{
            background: active.accentColor,
            color: active.onAccent,
          }}
        >
          <ArrowLeft size={17} />
          Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}

/* =========================================================
   RESET PASSWORD PLACEHOLDER
========================================================= */

export function ResetPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  return (
    <AuthShell
      title="New Password"
      subtitle="Password reset is not enabled yet."
    >
      <div
        className="rounded-3xl p-6"
        style={{
          background:
            'rgba(255,255,255,0.06)',
          border: `1px solid ${active.accentColor}33`,
        }}
      >
        <AuthMessage
          type="error"
          message="This page will work after a password-reset email provider is connected."
        />

        <Link
          to="/signin"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase"
          style={{
            background: active.accentColor,
            color: active.onAccent,
          }}
        >
          <ArrowLeft size={17} />
          Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}

/* =========================================================
   VERIFY PAGE PLACEHOLDER
========================================================= */

export function VerifyPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  return (
    <AuthShell
      title="Account Ready"
      subtitle="Email verification is not required in the current MongoDB authentication flow."
    >
      <div
        className="rounded-3xl p-6"
        style={{
          background:
            'rgba(255,255,255,0.06)',
          border: `1px solid ${active.accentColor}33`,
        }}
      >
        <AuthMessage
          type="success"
          message="Accounts are activated immediately after signup."
        />

        <Link
          to="/signin"
          className="mt-6 flex w-full items-center justify-center rounded-full py-4 font-black uppercase"
          style={{
            background: active.accentColor,
            color: active.onAccent,
          }}
        >
          Continue to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}

export default {
  SignInPage,
  SignUpPage,
  ForgotPage,
  ResetPage,
  VerifyPage,
};