import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { menuItems } from '@/data/menu';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Build Yours', path: '/build' },
  { label: 'Locations', path: '/locations' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];
interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  crunchPoints?: number;
}

export function Navbar() {
  const { activeProduct } = useTheme();
  const { count, open } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const a = activeProduct;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
useEffect(() => {
  const loadUser = () => {
    const savedUser = localStorage.getItem('mfz_user');

    if (!savedUser) {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(savedUser) as StoredUser);
    } catch {
      localStorage.removeItem('mfz_user');
      localStorage.removeItem('mfz_auth_token');
      setUser(null);
    }
  };

  loadUser();

  window.addEventListener('mfz-auth-changed', loadUser);
  window.addEventListener('storage', loadUser);

  return () => {
    window.removeEventListener('mfz-auth-changed', loadUser);
    window.removeEventListener('storage', loadUser);
  };
}, []);
useEffect(() => {
  setMobileOpen(false);
  setSearchOpen(false);
  setSearchQuery('');
  setAccountOpen(false);
}, [location.pathname]);

  useEffect(() => {
    if (!searchOpen && !mobileOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
const handleSignOut = () => {
  localStorage.removeItem('mfz_auth_token');
  localStorage.removeItem('mfz_user');

  setUser(null);
  setAccountOpen(false);

  window.dispatchEvent(
    new Event('mfz-auth-changed'),
  );

  navigate('/');
};
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return menuItems
        .filter((item) => item.popular)
        .slice(0, 6);
    }

    return menuItems
      .filter((item) => {
        return (
          item.name
            .toLowerCase()
            .includes(normalizedQuery) ||
          item.description
            .toLowerCase()
            .includes(normalizedQuery) ||
          item.category
            .toLowerCase()
            .includes(normalizedQuery)
        );
      })
      .slice(0, 8);
  }, [searchQuery]);

  const openSearch = () => {
    setMobileOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const goToSearchResults = () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      navigate('/menu');
      closeSearch();
      return;
    }

    navigate(
      `/menu?search=${encodeURIComponent(trimmedQuery)}`,
    );

    closeSearch();
  };

  const goToMenuItem = (itemName: string) => {
    navigate(
      `/menu?search=${encodeURIComponent(itemName)}`,
    );

    closeSearch();
  };

  return (
    <>
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          transition-all
          duration-500
        "
        style={{
          height: 'var(--nav-h)',
          background: scrolled
            ? 'rgba(10,10,10,0.7)'
            : 'transparent',
          backdropFilter: scrolled
            ? 'blur(16px)'
            : 'none',
          borderBottom: scrolled
            ? `1px solid ${a.accentColor}33`
            : '1px solid transparent',
        }}
      >
        <nav
          className="
            mfz-container
            flex
            h-full
            items-center
            justify-between
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="
              flex
              flex-shrink-0
              items-center
              gap-2
            "
          >
            <span
              className="
                text-2xl
                font-black
                tracking-tighter
                md:text-3xl
              "
              style={{
                color: a.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              MFZ
            </span>

            <span
              className="
                hidden
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                sm:block
              "
              style={{
                color: a.accentColor,
              }}
            >
              Corndog
            </span>
          </Link>

          {/* Desktop navigation */}
          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-7
              lg:flex
            "
          >
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-wide
                    transition-colors
                  "
                  style={{
                    color: isActive
                      ? a.accentColor
                      : a.textColor,
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div
            className="
              flex
              flex-shrink-0
              items-center
              gap-3
              md:gap-4
            "
          >
            <button
              type="button"
              aria-label="Search menu"
              onClick={openSearch}
              className="
                p-1.5
                transition-transform
                hover:scale-110
              "
              style={{
                color: a.textColor,
              }}
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              onClick={open}
              aria-label="Cart"
              className="
                relative
                p-1.5
                transition-transform
                hover:scale-110
              "
              style={{
                color: a.textColor,
              }}
            >
              <ShoppingBag size={20} />

              {count > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    text-[10px]
                    font-black
                  "
                  style={{
                    background: a.accentColor,
                    color: a.onAccent,
                  }}
                >
                  {count}
                </span>
              )}
            </button>

            <Link
              to="/menu"
              className="
                btn-primary
                hidden
                rounded-full
                px-5
                py-2.5
                text-sm
                font-black
                uppercase
                tracking-wide
                md:block
              "
              style={{
                background: a.accentColor,
                color: a.onAccent,
              }}
            >
              Order Now
            </Link>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMobileOpen(true);
              }}
              className="p-1.5 lg:hidden"
              aria-label="Open menu"
              style={{
                color: a.textColor,
              }}
            >
              <div className="relative">
  {user ? (
    <>
      <button
        type="button"
        onClick={() =>
          setAccountOpen((current) => !current)
        }
        aria-label="Open account menu"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          font-black
          uppercase
          transition-transform
          hover:scale-110
        "
        style={{
          background: a.accentColor,
          color: a.onAccent,
        }}
      >
        {user.name?.charAt(0) || 'U'}
      </button>

      <AnimatePresence>
        {accountOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.96,
            }}
            className="
              absolute
              right-0
              top-[calc(100%+14px)]
              z-[90]
              w-72
              overflow-hidden
              rounded-2xl
              border
              p-3
              shadow-2xl
              backdrop-blur-xl
            "
            style={{
              background: 'rgba(15,15,15,0.95)',
              borderColor: `${a.accentColor}44`,
            }}
          >
            <div
              className="rounded-xl p-4"
              style={{
                background:
                  'rgba(255,255,255,0.05)',
              }}
            >
              <p
                className="truncate font-black"
                style={{
                  color: a.textColor,
                }}
              >
                {user.name}
              </p>

              <p
                className="mt-1 truncate text-xs"
                style={{
                  color: a.textColor,
                  opacity: 0.55,
                }}
              >
                {user.email}
              </p>

              <p
                className="mt-3 text-xs font-bold uppercase tracking-widest"
                style={{
                  color: a.accentColor,
                }}
              >
                {user.crunchPoints ?? 0} Crunch Points
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="
                mt-2
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-bold
                transition-colors
                hover:bg-white/5
              "
              style={{
                color: a.textColor,
              }}
            >
              <LogOut size={17} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  ) : (
    <Link
      to="/signin"
      aria-label="Sign in"
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border
        transition-transform
        hover:scale-110
      "
      style={{
        color: a.textColor,
        borderColor: `${a.textColor}33`,
        background: 'rgba(255,255,255,0.05)',
      }}
    >
      <User size={19} />
    </Link>
  )}
</div>
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
  fixed
  inset-0
  z-[80]
  flex
  items-start
  justify-center
  bg-black/75
  px-4
  pt-4
  backdrop-blur-xl
  sm:px-6
  sm:pt-5
"
            onClick={closeSearch}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: -24,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -18,
                scale: 0.97,
              }}
              transition={{
                duration: 0.28,
              }}
              className="
                w-full
                max-w-3xl
                overflow-hidden
                rounded-3xl
                border
                shadow-2xl
              "
              style={{
                background: a.bgGradient,
                borderColor: `${a.accentColor}55`,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* Search input */}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  goToSearchResults();
                }}
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  p-4
                  sm:p-5
                "
                style={{
                  borderColor: `${a.textColor}18`,
                }}
              >
                <Search
                  size={22}
                  className="shrink-0"
                  style={{
                    color: a.accentColor,
                  }}
                />

                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search corndogs, combos, drinks..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-base
                    outline-none
                    placeholder:opacity-40
                    sm:text-lg
                  "
                  style={{
                    color: a.textColor,
                  }}
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-transform
                    hover:scale-110
                  "
                  style={{
                    color: a.textColor,
                    background:
                      'rgba(255,255,255,0.08)',
                  }}
                >
                  <X size={20} />
                </button>
              </form>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-4
                    px-2
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.2em]
                    "
                    style={{
                      color: a.textColor,
                      opacity: 0.55,
                    }}
                  >
                    {searchQuery.trim()
                      ? `${searchResults.length} results`
                      : 'Popular items'}
                  </span>

                  <span
                    className="hidden text-xs sm:block"
                    style={{
                      color: a.textColor,
                      opacity: 0.4,
                    }}
                  >
                    Ctrl / Cmd + K
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map(
                      (item, index) => (
                        <motion.button
                          key={item.id}
                          type="button"
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: index * 0.035,
                          }}
                          onClick={() =>
                            goToMenuItem(item.name)
                          }
                          className="
                            group
                            grid
                            w-full
                            grid-cols-[68px_1fr_auto]
                            items-center
                            gap-3
                            rounded-2xl
                            p-3
                            text-left
                            transition-all
                            hover:translate-x-1
                          "
                          style={{
                            background:
                              'rgba(255,255,255,0.06)',
                          }}
                        >
                          <div
                            className="
                              flex
                              h-[68px]
                              w-[68px]
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-xl
                            "
                            style={{
                              background:
                                'rgba(255,255,255,0.06)',
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-1.5
                                "
                                draggable={false}
                              />
                            ) : (
                              <Search
                                size={20}
                                style={{
                                  color:
                                    a.accentColor,
                                }}
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3
                              className="
                                truncate
                                text-base
                                font-black
                                sm:text-lg
                              "
                              style={{
                                color: a.textColor,
                                fontFamily:
                                  'Anton, sans-serif',
                              }}
                            >
                              {item.name}
                            </h3>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-xs
                                sm:text-sm
                              "
                              style={{
                                color: a.textColor,
                                opacity: 0.55,
                              }}
                            >
                              {item.category}
                            </p>
                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              font-black
                            "
                            style={{
                              color: a.accentColor,
                            }}
                          >
                            <span className="hidden sm:inline">
                              Rs.{' '}
                              {item.price.toLocaleString(
                                'en-PK',
                              )}
                            </span>

                            <ArrowRight
                              size={17}
                              className="
                                transition-transform
                                group-hover:translate-x-1
                              "
                            />
                          </div>
                        </motion.button>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-14 text-center">
                    <h3
                      className="text-2xl font-black"
                      style={{
                        color: a.textColor,
                        fontFamily:
                          'Anton, sans-serif',
                      }}
                    >
                      No Items Found
                    </h3>

                    <p
                      className="mt-2 text-sm"
                      style={{
                        color: a.textColor,
                        opacity: 0.55,
                      }}
                    >
                      Try searching for Potato,
                      Flaming, Ramen, Combo, Pepsi or
                      Water.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer action */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-t
                  p-4
                  sm:p-5
                "
                style={{
                  borderColor: `${a.textColor}18`,
                }}
              >
                <span
                  className="hidden text-xs sm:block"
                  style={{
                    color: a.textColor,
                    opacity: 0.45,
                  }}
                >
                  Press Enter to view all matching
                  menu items
                </span>

                <button
                  type="button"
                  onClick={goToSearchResults}
                  className="
                    ml-auto
                    flex
                    items-center
                    gap-2
                    rounded-full
                    px-6
                    py-3
                    text-sm
                    font-black
                    uppercase
                  "
                  style={{
                    background: a.accentColor,
                    color: a.onAccent,
                  }}
                >
                  Search Menu
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[60]
              flex
              flex-col
              lg:hidden
            "
            style={{
              background: a.bgGradient,
            }}
          >
            <div
              className="
                flex
                items-center
                justify-between
                p-5
              "
              style={{
                height: 'var(--nav-h)',
              }}
            >
              <span
                className="text-2xl font-black"
                style={{
                  color: a.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                MFZ
              </span>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                aria-label="Close menu"
                style={{
                  color: a.textColor,
                }}
              >
                <X size={28} />
              </button>
            </div>

            <div
              className="
                flex
                flex-1
                flex-col
                items-center
                justify-center
                gap-3
                px-6
              "
            >
              <motion.button
                type="button"
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                onClick={openSearch}
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  px-6
                  py-3
                  text-base
                  font-black
                  uppercase
                "
                style={{
                  color: a.textColor,
                  borderColor: `${a.textColor}33`,
                }}
              >
                <Search size={19} />
                Search Menu
              </motion.button>

              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                  }}
                >
                  <Link
                    to={link.path}
                    className="
                      text-4xl
                      font-black
                      uppercase
                      tracking-tight
                    "
                    style={{
                      color:
                        location.pathname === link.path
                          ? a.accentColor
                          : a.textColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    navLinks.length * 0.06,
                }}
                className="mt-6"
              >
                <Link
                  to="/menu"
                  className="
                    rounded-full
                    px-10
                    py-4
                    text-lg
                    font-black
                    uppercase
                  "
                  style={{
                    background: a.accentColor,
                    color: a.onAccent,
                  }}
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