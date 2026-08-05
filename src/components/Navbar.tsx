import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Build Yours', path: '/build' },
  { label: 'Locations', path: '/locations' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const { activeProduct } = useTheme();
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const a = activeProduct;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          height: 'var(--nav-h)',
          background: scrolled ? 'rgba(10,10,10,0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${a.accentColor}33` : '1px solid transparent',
        }}
      >
        <nav className="mfz-container h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl md:text-3xl font-black tracking-tighter" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
              MFZ
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:block" style={{ color: a.accentColor }}>
              Corndog
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-bold uppercase tracking-wide transition-colors"
                style={{
                  color: location.pathname === link.path ? a.accentColor : a.textColor,
                  opacity: location.pathname === link.path ? 1 : 0.7,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <button aria-label="Search" className="transition-transform hover:scale-110 p-1.5" style={{ color: a.textColor }}>
              <Search size={20} />
            </button>
            <button onClick={open} aria-label="Cart" className="relative transition-transform hover:scale-110 p-1.5" style={{ color: a.textColor }}>
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center" style={{ background: a.accentColor, color: a.onAccent }}>
                  {count}
                </span>
              )}
            </button>
            <Link
              to="/menu"
              className="hidden md:block px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wide btn-primary"
              style={{ background: a.accentColor, color: a.onAccent }}
            >
              Order Now
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5"
              aria-label="Open menu"
              style={{ color: a.textColor }}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden flex flex-col"
            style={{ background: a.bgGradient }}
          >
            <div className="flex items-center justify-between p-5" style={{ height: 'var(--nav-h)' }}>
              <span className="text-2xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>MFZ</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ color: a.textColor }}>
                <X size={28} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    className="text-4xl font-black uppercase tracking-tight"
                    style={{
                      color: location.pathname === link.path ? a.accentColor : a.textColor,
                      fontFamily: 'Anton, sans-serif',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
                className="mt-6"
              >
                <Link
                  to="/menu"
                  className="px-10 py-4 rounded-full text-lg font-black uppercase"
                  style={{ background: a.accentColor, color: a.onAccent }}
                >
                  Order Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
