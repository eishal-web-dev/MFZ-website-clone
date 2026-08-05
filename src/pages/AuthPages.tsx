import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CorndogSVG } from '@/components/CorndogSVG';
import { products } from '@/data/products';

function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  return (
    <div className="min-h-screen flex" style={{ background: a.bgGradient }}>
      {/* Left visual */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[20vw] font-black flex items-center justify-center" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>MFZ</div>
        <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="w-64 h-[600px] relative z-10">
          <CorndogSVG product={a} className="w-full h-full" />
        </motion.div>
        {/* Floating particles */}
        {products.slice(0, 5).map((p, i) => (
          <motion.div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ background: p.particleColor, top: `${15 + i * 18}%`, left: `${10 + (i % 2) * 80}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="text-4xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>MFZ</Link>
          <h1 className="text-4xl font-black mt-6 mb-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>{title}</h1>
          <p className="text-sm mb-8" style={{ color: a.textColor, opacity: 0.6 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder?: string }) {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  return (
    <div>
      <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-4 py-3.5 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
    </div>
  );
}

export function SignInPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your Crunch Club account.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@example.com" />
        <Field label="Password" type="password" placeholder="••••••••" />
        <div className="flex justify-end">
          <Link to="/forgot" className="text-xs font-bold" style={{ color: a.accentColor }}>Forgot password?</Link>
        </div>
        <button className="w-full py-4 rounded-full font-black uppercase" style={{ background: a.accentColor, color: a.onAccent }}>Sign In</button>
      </form>
      <p className="text-sm mt-6 text-center" style={{ color: a.textColor, opacity: 0.6 }}>
        New here? <Link to="/signup" className="font-bold" style={{ color: a.accentColor }}>Create account</Link>
      </p>
    </AuthShell>
  );
}

export function SignUpPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  return (
    <AuthShell title="Join the Crunch Club" subtitle="Create your account and start earning Crunch Points.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Name" placeholder="Your name" />
        <Field label="Email" type="email" placeholder="you@example.com" />
        <Field label="Phone" type="tel" placeholder="+92 ..." />
        <Field label="Password" type="password" placeholder="••••••••" />
        <button className="w-full py-4 rounded-full font-black uppercase" style={{ background: a.accentColor, color: a.onAccent }}>Create Account</button>
      </form>
      <p className="text-sm mt-6 text-center" style={{ color: a.textColor, opacity: 0.6 }}>
        Already a member? <Link to="/signin" className="font-bold" style={{ color: a.accentColor }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}

export function ForgotPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  return (
    <AuthShell title="Reset Password" subtitle="Enter your email and we'll send a reset link.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@example.com" />
        <button className="w-full py-4 rounded-full font-black uppercase" style={{ background: a.accentColor, color: a.onAccent }}>Send Reset Link</button>
      </form>
      <p className="text-sm mt-6 text-center" style={{ color: a.textColor, opacity: 0.6 }}>
        <Link to="/signin" className="font-bold" style={{ color: a.accentColor }}>Back to sign in</Link>
      </p>
    </AuthShell>
  );
}

export function ResetPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  return (
    <AuthShell title="New Password" subtitle="Enter your new password below.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="New Password" type="password" placeholder="••••••••" />
        <Field label="Confirm Password" type="password" placeholder="••••••••" />
        <button className="w-full py-4 rounded-full font-black uppercase" style={{ background: a.accentColor, color: a.onAccent }}>Reset Password</button>
      </form>
    </AuthShell>
  );
}

export function VerifyPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  return (
    <AuthShell title="Verify Email" subtitle="Enter the 6-digit code we sent to your email.">
      <div className="flex gap-2 mb-6">
        {code.map((c, i) => (
          <input
            key={i}
            value={c}
            onChange={(e) => {
              const next = [...code];
              next[i] = e.target.value.slice(-1);
              setCode(next);
            }}
            maxLength={1}
            className="w-12 h-14 text-center text-xl font-black rounded-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }}
          />
        ))}
      </div>
      <button className="w-full py-4 rounded-full font-black uppercase" style={{ background: a.accentColor, color: a.onAccent }}>Verify</button>
      <p className="text-sm mt-6 text-center" style={{ color: a.textColor, opacity: 0.6 }}>
        Didn't get it? <button className="font-bold" style={{ color: a.accentColor }}>Resend code</button>
      </p>
    </AuthShell>
  );
}

export default { SignInPage, SignUpPage, ForgotPage, ResetPage, VerifyPage };
