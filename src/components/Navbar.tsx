import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { menuItems } from '@/data/menu';

/* =========================================================
   TYPES
========================================================= */

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  crunchPoints?: number;
  role?: 'customer' | 'admin';
}
/* =========================================================
   NAVIGATION LINKS
========================================================= */

const navLinks = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Menu',
    path: '/menu',
  },
  {
    label: 'Build Yours',
    path: '/build',
  },
  {
    label: 'Locations',
    path: '/locations',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

/* =========================================================
   NAVBAR
========================================================= */

export function Navbar() {
  const { activeProduct } = useTheme();
  const { count, open } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const active = activeProduct;

  const [scrolled, setScrolled] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [user, setUser] =
    useState<StoredUser | null>(null);

  /* =======================================================
     SCROLL EFFECT
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
    };
  }, []);

  /* =======================================================
     LOAD AUTH USER
  ======================================================= */

  useEffect(() => {
    const loadUser = () => {
      const savedUser =
        localStorage.getItem('mfz_user');

      if (!savedUser) {
        setUser(null);
        return;
      }

      try {
        const parsedUser = JSON.parse(
          savedUser,
        ) as StoredUser;

        setUser(parsedUser);
      } catch {
        localStorage.removeItem(
          'mfz_user',
        );

        localStorage.removeItem(
          'mfz_auth_token',
        );

        setUser(null);
      }
    };

    loadUser();

    window.addEventListener(
      'mfz-auth-changed',
      loadUser,
    );

    window.addEventListener(
      'storage',
      loadUser,
    );

    return () => {
      window.removeEventListener(
        'mfz-auth-changed',
        loadUser,
      );

      window.removeEventListener(
        'storage',
        loadUser,
      );
    };
  }, []);

  /* =======================================================
     CLOSE PANELS ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setAccountOpen(false);
  }, [location.pathname]);

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {
    const shouldLockScroll =
      searchOpen || mobileOpen;

    if (shouldLockScroll) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, mobileOpen]);

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
        setAccountOpen(false);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();

        setMobileOpen(false);
        setAccountOpen(false);
        setSearchOpen(true);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, []);

  /* =======================================================
     SEARCH RESULTS
  ======================================================= */

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
        const searchableText = [
          item.name,
          item.description,
          item.category,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(
          normalizedQuery,
        );
      })
      .slice(0, 8);
  }, [searchQuery]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const openSearch = () => {
    setMobileOpen(false);
    setAccountOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const goToSearchResults = () => {
    const trimmedQuery =
      searchQuery.trim();

    if (!trimmedQuery) {
      navigate('/menu');
      closeSearch();
      return;
    }

    navigate(
      `/menu?search=${encodeURIComponent(
        trimmedQuery,
      )}`,
    );

    closeSearch();
  };

  const goToMenuItem = (
    itemName: string,
  ) => {
    navigate(
      `/menu?search=${encodeURIComponent(
        itemName,
      )}`,
    );

    closeSearch();
  };

  const handleSignOut = () => {
    localStorage.removeItem(
      'mfz_auth_token',
    );

    localStorage.removeItem('mfz_user');

    setUser(null);
    setAccountOpen(false);
    setMobileOpen(false);

    window.dispatchEvent(
      new Event('mfz-auth-changed'),
    );

    navigate('/');
  };

  const userInitial =
    user?.name?.trim().charAt(0).toUpperCase() ||
    'U';
  const isAdmin = user?.role === 'admin';
  return (
    <>
      {/* ===================================================
          MAIN NAVBAR
      =================================================== */}

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
            ? 'rgba(10,10,10,0.76)'
            : 'transparent',
          backdropFilter: scrolled
            ? 'blur(16px)'
            : 'none',
          WebkitBackdropFilter: scrolled
            ? 'blur(16px)'
            : 'none',
          borderBottom: scrolled
            ? `1px solid ${active.accentColor}33`
            : '1px solid transparent',
        }}
      >
        <nav
          className="
            mfz-container
            relative
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
              shrink-0
              items-center
              gap-2
            "
            aria-label="MFZ home"
          >
            <span
              className="
                text-2xl
                font-black
                tracking-tighter
                md:text-3xl
              "
              style={{
                color: active.textColor,
                fontFamily:
                  'Anton, sans-serif',
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
                color:
                  active.accentColor,
              }}
            >
              Corndog
            </span>
          </Link>

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
  style={{
    marginLeft: '-50px',
  }}
>
            {navLinks.map((link) => {
              const isActive =
                location.pathname ===
                link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-wide
                    transition-all
                    hover:opacity-100
                  "
                  style={{
                    color: isActive
                      ? active.accentColor
                      : active.textColor,
                    opacity: isActive
                      ? 1
                      : 0.7,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-3
              md:gap-2
            "
          >
            {/* Search */}
            <button
              type="button"
              aria-label="Search menu"
              onClick={openSearch}
              className="
                rounded-full
                p-1.5
                transition-transform
                hover:scale-110
              "
              style={{
                color: active.textColor,
              }}
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={open}
              aria-label="Open cart"
              className="
                relative
                rounded-full
                p-1.5
                transition-transform
                hover:scale-110
              "
              style={{
                color: active.textColor,
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
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    px-1
                    text-[10px]
                    font-black
                  "
                  style={{
                    background:
                      active.accentColor,
                    color:
                      active.onAccent,
                  }}
                >
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            {/* Account */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setAccountOpen(
                        (current) =>
                          !current,
                      )
                    }
                    aria-label="Open account menu"
                    aria-expanded={
                      accountOpen
                    }
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
                      background:
                        active.accentColor,
                      color:
                        active.onAccent,
                    }}
                  >
                    {userInitial}
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <>
                        <button
                          type="button"
                          aria-label="Close account menu"
                          onClick={() =>
                            setAccountOpen(
                              false,
                            )
                          }
                          className="fixed inset-0 z-[70] cursor-default"
                        />

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
                          transition={{
                            duration: 0.18,
                          }}
                          className="
                            absolute
                            right-0
                            top-[calc(100%+14px)]
                            z-[80]
                            w-72
                            overflow-hidden
                            rounded-2xl
                            border
                            p-3
                            shadow-2xl
                            backdrop-blur-xl
                          "
                          style={{
                            background:
                              'rgba(15,15,15,0.96)',
                            borderColor: `${active.accentColor}44`,
                          }}
                        >
                          <div
                            className="rounded-xl p-4"
                            style={{
                              background:
                                'rgba(255,255,255,0.05)',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex
                                  h-11
                                  w-11
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  font-black
                                "
                                style={{
                                  background:
                                    active.accentColor,
                                  color:
                                    active.onAccent,
                                }}
                              >
                                {userInitial}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="truncate font-black"
                                  style={{
                                    color:
                                      active.textColor,
                                  }}
                                >
                                  {user.name}
                                </p>

                                <p
                                  className="mt-0.5 truncate text-xs"
                                  style={{
                                    color:
                                      active.textColor,
                                    opacity: 0.55,
                                  }}
                                >
                                  {user.email}
                                </p>
                              </div>
                            </div>

                            <p
                              className="
                                mt-4
                                text-xs
                                font-bold
                                uppercase
                                tracking-widest
                              "
                              style={{
                                color:
                                  active.accentColor,
                              }}
                            >
                              {user.crunchPoints ??
                                0}{' '}
                              Crunch Points
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={
                              handleSignOut
                            }
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
                              color:
                                active.textColor,
                            }}
                          >
                            <LogOut size={17} />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
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
                    color:
                      active.textColor,
                    borderColor: `${active.textColor}33`,
                    background:
                      'rgba(255,255,255,0.05)',
                  }}
                >
                  <User size={19} />
                </Link>
              )}
            </div>
              {/* Admin portal */}
{isAdmin && (
  <Link
    to="/admin"
    className="
      hidden
      items-center
      gap-2
      rounded-full
      border
      px-4
      py-2.5
      text-sm
      font-black
      uppercase
      tracking-wide
      transition-all
      hover:scale-[1.03]
      xl:flex
    "
    style={{
      background: `${active.accentColor}18`,
      borderColor: `${active.accentColor}66`,
      color: active.accentColor,
    }}
  >
    <LayoutDashboard size={17} />
   
  </Link>
)}
            {/* Order button */}
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
                background:
                  active.accentColor,
                color: active.onAccent,
              }}
            >
              Order Now
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setAccountOpen(false);
                setMobileOpen(true);
              }}
              className="
                rounded-full
                p-1.5
                lg:hidden
              "
              aria-label="Open menu"
              style={{
                color: active.textColor,
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* ===================================================
          SEARCH OVERLAY
      =================================================== */}

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[90]
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
                background:
                  active.bgGradient,
                borderColor: `${active.accentColor}55`,
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
                  borderColor: `${active.textColor}18`,
                }}
              >
                <Search
                  size={22}
                  className="shrink-0"
                  style={{
                    color:
                      active.accentColor,
                  }}
                />

                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value,
                    )
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
                    color:
                      active.textColor,
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
                    color:
                      active.textColor,
                    background:
                      'rgba(255,255,255,0.08)',
                  }}
                >
                  <X size={20} />
                </button>
              </form>

              {/* Search results */}
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
                      color:
                        active.textColor,
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
                      color:
                        active.textColor,
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
                            delay:
                              index * 0.035,
                          }}
                          onClick={() =>
                            goToMenuItem(
                              item.name,
                            )
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
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-1.5
                                "
                                draggable={
                                  false
                                }
                              />
                            ) : (
                              <Search
                                size={20}
                                style={{
                                  color:
                                    active.accentColor,
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
                                color:
                                  active.textColor,
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
                                color:
                                  active.textColor,
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
                              color:
                                active.accentColor,
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
                        color:
                          active.textColor,
                        fontFamily:
                          'Anton, sans-serif',
                      }}
                    >
                      No Items Found
                    </h3>

                    <p
                      className="mt-2 text-sm"
                      style={{
                        color:
                          active.textColor,
                        opacity: 0.55,
                      }}
                    >
                      Try searching for
                      Potato, Flaming, Ramen,
                      Combo, Pepsi or Water.
                    </p>
                  </div>
                )}
              </div>

              {/* Search footer */}
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
                  borderColor: `${active.textColor}18`,
                }}
              >
                <span
                  className="hidden text-xs sm:block"
                  style={{
                    color:
                      active.textColor,
                    opacity: 0.45,
                  }}
                >
                  Press Enter to view all
                  matching menu items
                </span>

                <button
                  type="button"
                  onClick={
                    goToSearchResults
                  }
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
                    background:
                      active.accentColor,
                    color:
                      active.onAccent,
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

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[80]
              flex
              flex-col
              lg:hidden
            "
            style={{
              background:
                active.bgGradient,
            }}
          >
            {/* Mobile menu header */}
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
              <Link
                to="/"
                className="text-2xl font-black"
                style={{
                  color:
                    active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                MFZ
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                aria-label="Close menu"
                style={{
                  color:
                    active.textColor,
                }}
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile menu content */}
            <div
              className="
                flex
                flex-1
                flex-col
                items-center
                justify-center
                gap-3
                overflow-y-auto
                px-6
                py-8
              "
            >
              {/* Mobile account */}
              {user ? (
                <div
                  className="
                    mb-5
                    flex
                    w-full
                    max-w-sm
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    p-4
                  "
                  style={{
                    background:
                      'rgba(255,255,255,0.06)',
                    borderColor: `${active.accentColor}33`,
                  }}
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      font-black
                    "
                    style={{
                      background:
                        active.accentColor,
                      color:
                        active.onAccent,
                    }}
                  >
                    {userInitial}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate font-black"
                      style={{
                        color:
                          active.textColor,
                      }}
                    >
                      {user.name}
                    </p>

                    <p
                      className="truncate text-xs"
                      style={{
                        color:
                          active.textColor,
                        opacity: 0.55,
                      }}
                    >
                      {user.email}
                    </p>
                  </div>
                      {isAdmin && (
  <Link
    to="/admin"
    onClick={() => setAccountOpen(false)}
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
      font-black
      transition-colors
      hover:bg-white/5
    "
    style={{
      color: active.accentColor,
    }}
  >
    <LayoutDashboard size={17} />
    Admin Dashboard
  </Link>
)}
                  <button
                    type="button"
                    onClick={
                      handleSignOut
                    }
                    aria-label="Sign out"
                    style={{
                      color:
                        active.accentColor,
                    }}
                  >
                    <LogOut size={19} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/signin"
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
                    color:
                      active.textColor,
                    borderColor: `${active.textColor}33`,
                  }}
                >
                  <User size={19} />
                  Sign In
                </Link>
              )}

              {/* Search button */}
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
                  mb-3
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
                  color:
                    active.textColor,
                  borderColor: `${active.textColor}33`,
                }}
              >
                <Search size={19} />
                Search Menu
              </motion.button>

              {/* Navigation links */}
              {navLinks.map(
                (link, index) => (
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
                      delay:
                        index * 0.06,
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
                          location.pathname ===
                          link.path
                            ? active.accentColor
                            : active.textColor,
                        fontFamily:
                          'Anton, sans-serif',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ),
              )}
              {/* Mobile admin portal */}
{isAdmin && (
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
      delay: navLinks.length * 0.06,
    }}
  >
    <Link
      to="/admin"
      className="
        flex
        items-center
        gap-3
        text-4xl
        font-black
        uppercase
        tracking-tight
      "
      style={{
        color: active.accentColor,
        fontFamily: 'Anton, sans-serif',
      }}
    >
      <LayoutDashboard size={29} />
      Admin
    </Link>
  </motion.div>
)}
              {/* Mobile order button */}
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
                    navLinks.length *
                    0.06,
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
                    background:
                      active.accentColor,
                    color:
                      active.onAccent,
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