import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  GoogleLogin,
  type CredentialResponse,
} from '@react-oauth/google';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { products } from '@/data/products';
import potatoImage from '@/assets/products/potatoeCD.png';

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:5000/api';

const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  google: `${API_BASE_URL}/auth/google`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
  verifyEmail: `${API_BASE_URL}/auth/verify-email`,
  resendVerification: `${API_BASE_URL}/auth/resend-verification`,
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
  avatar?: string;
  provider?: 'local' | 'google';
  isVerified?: boolean;
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

interface ForgotForm {
  email: string;
}

interface ResetForm {
  password: string;
  confirmPassword: string;
}

/* =========================================================
   HELPERS
========================================================= */

async function postJson<T>(
  url: string,
  payload: unknown,
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData: unknown =
    await response.json().catch(() => null);

  if (!response.ok) {
    const possibleError = responseData as {
      message?: string;
    } | null;

    throw new Error(
      possibleError?.message ??
        'Something went wrong. Please try again.',
    );
  }

  return responseData as T;
}

function saveAuthSession(response: AuthResponse): void {
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
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
  return password.length >= 8;
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
        {/* Left product visual */}
        <section className="relative hidden overflow-hidden md:flex md:items-center md:justify-center">
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

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.24, 0.42, 0.24],
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

          {products.slice(0, 6).map(
            (product, index) => (
              <motion.div
                key={product.id}
                className="absolute h-3 w-3 rounded-full"
                style={{
                  background: product.particleColor,
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
                  duration: 3.4 + index * 0.4,
                  repeat: Infinity,
                  delay: index * 0.28,
                  ease: 'easeInOut',
                }}
              />
            ),
          )}

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

          <div className="absolute bottom-12 left-10 z-20 max-w-sm xl:bottom-16 xl:left-16">
            <h2
              className="text-5xl font-black uppercase leading-[0.9] xl:text-6xl"
              style={{
                color: active.textColor,
                fontFamily: 'Anton, sans-serif',
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
              Join MFZ, order your favourite Korean-style
              corndogs, save favourites and unlock member
              rewards.
            </p>
          </div>
        </section>

        {/* Right form */}
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
            {/* No MFZ logo above the heading */}
            <div>
              <h1
                className="text-4xl font-black leading-tight sm:text-5xl"
                style={{
                  color: active.textColor,
                  fontFamily: 'Anton, sans-serif',
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
          type={
            isPassword && showPassword
              ? 'text'
              : type
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-xl px-4 py-3.5 outline-none transition-all placeholder:opacity-35"
          style={{
            paddingRight: isPassword
              ? '3rem'
              : undefined,
            background: 'rgba(255,255,255,0.08)',
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
              setShowPassword((current) => !current)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
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
          style={{ color: '#ff7b86' }}
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
          style={{ color: '#25D366' }}
        />
      ) : (
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0"
          style={{ color: '#ff6875' }}
        />
      )}

      <span>{message}</span>
    </div>
  );
}

/* =========================================================
   GOOGLE BUTTON
========================================================= */

function GoogleAuthButton({
  onSuccess,
  onError,
}: {
  onSuccess: (
    credentialResponse: CredentialResponse,
  ) => void;
  onError: () => void;
}) {
  return (
    <div className="flex w-full justify-center overflow-hidden rounded-full">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={false}
        theme="filled_black"
        shape="pill"
        size="large"
        text="continue_with"
        width="400"
      />
    </div>
  );
}

/* =========================================================
   SHARED GOOGLE AUTH LOGIC
========================================================= */

async function authenticateWithGoogle(
  credentialResponse: CredentialResponse,
): Promise<AuthResponse> {
  if (!credentialResponse.credential) {
    throw new Error(
      'Google did not return a valid credential.',
    );
  }

  return postJson<AuthResponse>(
    AUTH_ENDPOINTS.google,
    {
      credential:
        credentialResponse.credential,
    },
  );
}

/* =========================================================
   SIGN IN
========================================================= */

export function SignInPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const [form, setForm] = useState<SignInForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] =
    useState<Partial<SignInForm>>({});

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);

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

    const nextErrors: Partial<SignInForm> = {};

    if (!isValidEmail(form.email.trim())) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password =
        'Enter your password.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await postJson<AuthResponse>(
        AUTH_ENDPOINTS.login,
        {
          email: form.email.trim(),
          password: form.password,
        },
      );

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

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setLoading(true);
    setMessage('');

    try {
      const response =
        await authenticateWithGoogle(
          credentialResponse,
        );

      saveAuthSession(response);

      setMessageType('success');
      setMessage(
        response.message ??
          'Signed in with Google.',
      );

      window.setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Google sign-in failed.',
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

          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span
          className="text-xs font-bold uppercase"
          style={{
            color: active.textColor,
            opacity: 0.4,
          }}
        >
          Or
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleAuthButton
        onSuccess={handleGoogleSuccess}
        onError={() => {
          setMessageType('error');
          setMessage(
            'Google sign-in was cancelled or failed.',
          );
        }}
      />

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
   SIGN UP
========================================================= */

export function SignUpPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] =
    useState<Partial<SignUpForm>>({});

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);

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

    const nextErrors: Partial<SignUpForm> = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Enter your name.';
    }

    if (!isValidEmail(form.email.trim())) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (!form.phone.trim()) {
      nextErrors.phone =
        'Enter your phone number.';
    }

    if (!isStrongPassword(form.password)) {
      nextErrors.password =
        'Password must be at least 8 characters.';
    }

    if (
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await postJson<AuthResponse>(
        AUTH_ENDPOINTS.register,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        },
      );

      setMessageType('success');
      setMessage(
        response.message ??
          'Account created. Check your email for verification.',
      );

      window.setTimeout(() => {
        navigate(
          `/verify?email=${encodeURIComponent(
            form.email.trim(),
          )}`,
        );
      }, 800);
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

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setLoading(true);
    setMessage('');

    try {
      const response =
        await authenticateWithGoogle(
          credentialResponse,
        );

      saveAuthSession(response);

      setMessageType('success');
      setMessage(
        response.message ??
          'Google account connected successfully.',
      );

      window.setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Google signup failed.',
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
          error={errors.confirmPassword}
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

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span
          className="text-xs font-bold uppercase"
          style={{
            color: active.textColor,
            opacity: 0.4,
          }}
        >
          Or
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleAuthButton
        onSuccess={handleGoogleSuccess}
        onError={() => {
          setMessageType('error');
          setMessage(
            'Google signup was cancelled or failed.',
          );
        }}
      />

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
   FORGOT PASSWORD
========================================================= */

export function ForgotPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  const [form, setForm] =
    useState<ForgotForm>({ email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!isValidEmail(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);
    setMessage('');

    try {
      const response = await postJson<AuthResponse>(
        AUTH_ENDPOINTS.forgotPassword,
        {
          email: form.email.trim(),
        },
      );

      setMessageType('success');
      setMessage(
        response.message ??
          'Reset instructions have been sent.',
      );
    } catch (errorValue) {
      setMessageType('error');
      setMessage(
        errorValue instanceof Error
          ? errorValue.message
          : 'Unable to send reset instructions.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your email and we will send a reset link."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <Field
          id="forgot-email"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(event) => {
            setForm({
              email: event.target.value,
            });
            setError('');
            setMessage('');
          }}
          placeholder="you@example.com"
          autoComplete="email"
          error={error}
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
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase"
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
            ? 'Sending...'
            : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 text-sm font-bold"
          style={{
            color: active.accentColor,
          }}
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

export function ResetPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const [form, setForm] = useState<ResetForm>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] =
    useState<Partial<ResetForm>>({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextErrors: Partial<ResetForm> = {};

    if (!isStrongPassword(form.password)) {
      nextErrors.password =
        'Password must be at least 8 characters.';
    }

    if (
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token =
        new URLSearchParams(
          window.location.search,
        ).get('token') ?? '';

      const response = await postJson<AuthResponse>(
        AUTH_ENDPOINTS.resetPassword,
        {
          token,
          password: form.password,
        },
      );

      setMessageType('success');
      setMessage(
        response.message ??
          'Password reset successfully.',
      );

      window.setTimeout(() => {
        navigate('/signin');
      }, 900);
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to reset password.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="New Password"
      subtitle="Choose a secure new password for your account."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <Field
          id="reset-password"
          label="New Password"
          name="password"
          type="password"
          value={form.password}
          onChange={(event) => {
            setForm((current) => ({
              ...current,
              password: event.target.value,
            }));
            setErrors((current) => ({
              ...current,
              password: '',
            }));
          }}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          error={errors.password}
        />

        <Field
          id="reset-confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => {
            setForm((current) => ({
              ...current,
              confirmPassword:
                event.target.value,
            }));
            setErrors((current) => ({
              ...current,
              confirmPassword: '',
            }));
          }}
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
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
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase"
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
            ? 'Resetting...'
            : 'Reset Password'}
        </button>
      </form>
    </AuthShell>
  );
}

/* =========================================================
   VERIFY EMAIL
========================================================= */

export function VerifyPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const [code, setCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);

  const email = useMemo(
    () =>
      new URLSearchParams(
        window.location.search,
      ).get('email') ?? '',
    [],
  );

  const handleVerify = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      setMessageType('error');
      setMessage(
        'Enter the complete 6-digit code.',
      );
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await postJson<AuthResponse>(
        AUTH_ENDPOINTS.verifyEmail,
        {
          email,
          code: verificationCode,
        },
      );

      setMessageType('success');
      setMessage(
        response.message ??
          'Email verified successfully.',
      );

      window.setTimeout(() => {
        navigate('/signin');
      }, 900);
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to verify email.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessageType('error');
      setMessage(
        'No email address was provided.',
      );
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await postJson<AuthResponse>(
        AUTH_ENDPOINTS.resendVerification,
        { email },
      );

      setMessageType('success');
      setMessage(
        response.message ??
          'A new code has been sent.',
      );
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to resend the code.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Verify Email"
      subtitle={
        email
          ? `Enter the 6-digit code sent to ${email}.`
          : 'Enter the 6-digit code sent to your email.'
      }
    >
      <div className="flex justify-between gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={digit}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, '')
                .slice(-1);

              const nextCode = [...code];
              nextCode[index] = value;
              setCode(nextCode);
              setMessage('');

              if (
                value &&
                index < code.length - 1
              ) {
                inputRefs.current[
                  index + 1
                ]?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (
                event.key === 'Backspace' &&
                !code[index] &&
                index > 0
              ) {
                inputRefs.current[
                  index - 1
                ]?.focus();
              }
            }}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Verification digit ${
              index + 1
            }`}
            className="h-14 w-11 rounded-xl text-center text-xl font-black outline-none sm:h-16 sm:w-12"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: active.textColor,
              border: `1px solid ${active.accentColor}33`,
            }}
          />
        ))}
      </div>

      {message && (
        <div className="mt-5">
          <AuthMessage
            type={messageType}
            message={message}
          />
        </div>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={handleVerify}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 font-black uppercase"
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

        {loading ? 'Verifying...' : 'Verify'}
      </button>

      <p
        className="mt-6 text-center text-sm"
        style={{
          color: active.textColor,
          opacity: 0.62,
        }}
      >
        Didn&apos;t receive it?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="font-bold"
          style={{
            color: active.accentColor,
          }}
        >
          Resend code
        </button>
      </p>
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