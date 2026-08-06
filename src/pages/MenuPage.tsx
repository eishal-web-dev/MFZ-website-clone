import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Flame, Heart, X, Minus, MessageCircle } from 'lucide-react';
import { menuItems, menuCategories, formatPKR, type MenuItem } from '@/data/menu';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
export default function MenuPage() {
  const { activeProduct } = useTheme();
  const { add } = useCart();
  const a = activeProduct;
const navigate = useNavigate();
 const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [spiceFilter, setSpiceFilter] = useState<number | null>(null);
  const [cheeseFilter, setCheeseFilter] = useState(false);
  const [sausageFilter, setSausageFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  const filtered = useMemo(() => {
  const normalizedQuery = query.trim().toLowerCase();

  return menuItems.filter((item) => {
    const matchesCategory =
      category === 'All'
        ? true
        : category === 'Popular'
          ? Boolean(item.popular)
          : item.category === category;

    const matchesSearch =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery);

    const matchesSpice =
      spiceFilter === null ||
      item.spiceLevel === spiceFilter;

    const matchesCheese =
      !cheeseFilter ||
      item.hasCheese;

    const matchesSausage =
      !sausageFilter ||
      item.hasSausage;

    const matchesPrice =
      item.price <= maxPrice;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesSpice &&
      matchesCheese &&
      matchesSausage &&
      matchesPrice
    );
  });
}, [
  category,
  query,
  spiceFilter,
  cheeseFilter,
  sausageFilter,
  maxPrice,
]);

  const toggleFav = (id: number) =>
    setFavourites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  return (
    <div className="min-h-screen" style={{ background: a.bgColor, paddingTop: 'var(--nav-h)', paddingBottom: '80px' }}>
      <div className="mfz-container">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>The Full Menu</span>
          <h1 className="text-6xl md:text-8xl font-black mt-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Menu</h1>
          <p className="text-sm mt-2" style={{ color: a.textColor, opacity: 0.5 }}>Prices and availability may vary by branch.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: a.textColor, opacity: 0.4 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search corndogs, burgers, fries..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full text-base outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }}
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all"
              style={{
                background: category === cat ? a.accentColor : 'rgba(255,255,255,0.08)',
                color: category === cat ? a.onAccent : a.textColor,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-xs uppercase font-bold" style={{ color: a.textColor, opacity: 0.5 }}>Filters:</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setSpiceFilter(spiceFilter === s ? null : s)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ background: spiceFilter === s ? a.accentColor : 'rgba(255,255,255,0.08)', color: spiceFilter === s ? a.onAccent : a.textColor }}
              >
                <Flame size={12} fill={spiceFilter === s ? a.onAccent : 'none'} /> {s}
              </button>
            ))}
          </div>
          <button onClick={() => setCheeseFilter(!cheeseFilter)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background: cheeseFilter ? a.accentColor : 'rgba(255,255,255,0.08)', color: cheeseFilter ? a.onAccent : a.textColor }}>Cheese</button>
          <button onClick={() => setSausageFilter(!sausageFilter)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background: sausageFilter ? a.accentColor : 'rgba(255,255,255,0.08)', color: sausageFilter ? a.onAccent : a.textColor }}>Sausage</button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: a.textColor, opacity: 0.6 }}>Max</span>
            <input type="range" min={100} max={3500} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="accent-current" style={{ accentColor: a.accentColor }} />
            <span className="text-xs font-bold" style={{ color: a.accentColor }}>{formatPKR(maxPrice)}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-3xl p-6 cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}
              onClick={() => setDetail(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-1">
                  {Array.from({ length: item.spiceLevel }).map((_, s) => (
                    <Flame key={s} size={14} fill={a.accentColor} color={a.accentColor} />
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFav(item.id); }}
                  aria-label="Favourite"
                  className="transition-transform hover:scale-110"
                >
                  <Heart size={18} fill={favourites.includes(item.id) ? a.accentColor : 'none'} color={favourites.includes(item.id) ? a.accentColor : a.textColor} style={{ opacity: favourites.includes(item.id) ? 1 : 0.5 }} />
                </button>
              </div>
              <div
 className="relative mb-5 flex h-[250px] items-center justify-center overflow-hidden rounded-2xl"
  style={{
    background:
      'radial-gradient(circle at center, rgba(255,255,255,0.14), rgba(255,255,255,0.03))',
  }}
>
  {item.image ? (
    <img
      src={item.image}
      alt={item.name}
     className="h-[230px] w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
      draggable={false}
      loading="lazy"
    />
  ) : (
    <div
      className="flex h-full w-full items-center justify-center text-sm"
      style={{
        color: a.textColor,
        opacity: 0.5,
      }}
    >
      Image coming soon
    </div>
  )}

  {item.popular && (
    <span
      className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide"
      style={{
        background: a.accentColor,
        color: a.onAccent,
      }}
    >
      Popular
    </span>
  )}
</div>
              <h3 className="text-xl font-black mb-1" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>{item.name}</h3>
              <p className="text-sm mb-4" style={{ color: a.textColor, opacity: 0.6 }}>{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black" style={{ color: a.accentColor }}>{formatPKR(item.price)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); add({ id: item.id, name: item.name, price: item.price }); }}
                  className="p-2.5 rounded-full transition-transform hover:scale-110 group-hover:rotate-90"
                  style={{ background: a.accentColor, color: a.onAccent }}
                  aria-label={`Add ${item.name}`}
                >
                  <Plus size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: a.textColor, opacity: 0.5 }}>No items match your filters.</p>
          </div>
        )}
      </div>

      {/* Detail overlay */}
{/* Full-screen product details */}
<AnimatePresence>
  {detail && (
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
        z-[100]
        overflow-y-auto
      "
      style={{
        background: a.bgColor,
      }}
    >
      <motion.div
        initial={{
          x: '100%',
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: '100%',
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 260,
        }}
        className="min-h-screen"
      >
        {/* Product header */}
        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            border-b
            px-4
            py-4
            backdrop-blur-xl
            md:px-8
          "
          style={{
            background: `${a.bgColor}E6`,
            borderColor:
              'rgba(255,255,255,0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setDetail(null);
              setDetailQty(1);
            }}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              transition-transform
              hover:scale-105
            "
            style={{
              background:
                'rgba(255,255,255,0.08)',
              color: a.textColor,
            }}
            aria-label="Close product details"
          >
            <X size={21} />
          </button>

          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
            "
            style={{
              color: a.accentColor,
            }}
          >
            Product Details
          </p>

          <button
            type="button"
            onClick={() =>
              toggleFav(detail.id)
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              transition-transform
              hover:scale-105
            "
            style={{
              background:
                'rgba(255,255,255,0.08)',
              color: favourites.includes(
                detail.id,
              )
                ? a.accentColor
                : a.textColor,
            }}
            aria-label="Favourite product"
          >
            <Heart
              size={20}
              fill={
                favourites.includes(
                  detail.id,
                )
                  ? a.accentColor
                  : 'none'
              }
            />
          </button>
        </div>

        <div
          className="
            mx-auto
            grid
            min-h-[calc(100vh-76px)]
            max-w-7xl
            gap-8
            px-4
            py-6
            md:px-8
            md:py-10
            lg:grid-cols-2
            lg:items-center
          "
        >
          {/* Product image */}
          <section
            className="
              relative
              flex
              min-h-[360px]
              items-center
              justify-center
              overflow-hidden
              rounded-[2rem]
              border
              md:min-h-[520px]
            "
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.16), rgba(255,255,255,0.025))',
              borderColor: `${a.accentColor}25`,
            }}
          >
            {detail.image ? (
              <motion.img
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  rotate: -4,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: 0.15,
                  duration: 0.55,
                }}
                src={detail.image}
                alt={detail.name}
                className="
                  h-[330px]
                  w-full
                  object-contain
                  p-5
                  md:h-[500px]
                  md:p-8
                "
                draggable={false}
              />
            ) : (
              <p
                style={{
                  color: a.textColor,
                  opacity: 0.5,
                }}
              >
                Image coming soon
              </p>
            )}

            {detail.popular && (
              <span
                className="
                  absolute
                  left-5
                  top-5
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-wide
                "
                style={{
                  background:
                    a.accentColor,
                  color: a.onAccent,
                }}
              >
                Popular
              </span>
            )}
          </section>

          {/* Product information */}
          <section className="pb-28 lg:pb-0">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
              "
              style={{
                color: a.accentColor,
              }}
            >
              {detail.category}
            </p>

            <h1
              className="
                mt-3
                text-5xl
                font-black
                leading-none
                md:text-7xl
              "
              style={{
                color: a.textColor,
                fontFamily:
                  'Anton, sans-serif',
              }}
            >
              {detail.name}
            </h1>

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-relaxed
                md:text-lg
              "
              style={{
                color: a.textColor,
                opacity: 0.68,
              }}
            >
              {detail.description}
            </p>

            {/* Product badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {detail.hasCheese && (
                <span
                  className="
                    rounded-full
                    px-4
                    py-2
                    text-xs
                    font-bold
                  "
                  style={{
                    background:
                      'rgba(255,255,255,0.08)',
                    color: a.textColor,
                  }}
                >
                  Cheese
                </span>
              )}

              {detail.hasSausage && (
                <span
                  className="
                    rounded-full
                    px-4
                    py-2
                    text-xs
                    font-bold
                  "
                  style={{
                    background:
                      'rgba(255,255,255,0.08)',
                    color: a.textColor,
                  }}
                >
                  Sausage
                </span>
              )}

              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  font-bold
                "
                style={{
                  background:
                    'rgba(255,255,255,0.08)',
                  color: a.textColor,
                }}
              >
                <Flame
                  size={13}
                  color={a.accentColor}
                  fill={a.accentColor}
                />
                Spice {detail.spiceLevel}
              </span>
            </div>

            {/* Price */}
            <div
              className="
                mt-8
                rounded-3xl
                border
                p-5
              "
              style={{
                background:
                  'rgba(255,255,255,0.045)',
                borderColor: `${a.accentColor}25`,
              }}
            >
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-wider
                "
                style={{
                  color: a.textColor,
                  opacity: 0.5,
                }}
              >
                Total Price
              </p>

              <p
                className="
                  mt-2
                  text-4xl
                  font-black
                "
                style={{
                  color: a.accentColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                {formatPKR(
                  detail.price *
                    detailQty,
                )}
              </p>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-wider
                "
                style={{
                  color: a.textColor,
                  opacity: 0.55,
                }}
              >
                Quantity
              </p>

              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setDetailQty(
                      (quantity) =>
                        Math.max(
                          1,
                          quantity - 1,
                        ),
                    )
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition-transform
                    hover:scale-105
                  "
                  style={{
                    background:
                      'rgba(255,255,255,0.06)',
                    borderColor: `${a.accentColor}30`,
                    color: a.textColor,
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>

                <span
                  className="
                    min-w-12
                    text-center
                    text-3xl
                    font-black
                  "
                  style={{
                    color: a.textColor,
                  }}
                >
                  {detailQty}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setDetailQty(
                      (quantity) =>
                        quantity + 1,
                    )
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition-transform
                    hover:scale-105
                  "
                  style={{
                    background:
                      'rgba(255,255,255,0.06)',
                    borderColor: `${a.accentColor}30`,
                    color: a.textColor,
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="mt-10 hidden gap-3 sm:flex">
              <button
                type="button"
                onClick={() => {
                  add(
                    {
                      id: detail.id,
                      name: detail.name,
                      price:
                        detail.price,
                    },
                    detailQty,
                  );

                  setDetail(null);
                  setDetailQty(1);
                }}
                className="
                  flex-1
                  rounded-full
                  py-4
                  text-base
                  font-black
                  uppercase
                  transition-transform
                  hover:scale-[1.02]
                "
                style={{
                  background:
                    a.accentColor,
                  color: a.onAccent,
                }}
              >
                Add to Cart
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `I'd like to order ${detailQty} × ${detail.name}. Total: ${formatPKR(
                    detail.price *
                      detailQty,
                  )}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  transition-transform
                  hover:scale-105
                "
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                }}
                aria-label="Order via WhatsApp"
              >
                <MessageCircle size={21} />
              </a>
            </div>
          </section>
        </div>

        {/* Mobile fixed add button */}
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-30
            border-t
            p-4
            backdrop-blur-xl
            sm:hidden
          "
          style={{
            background: `${a.bgColor}F2`,
            borderColor:
              'rgba(255,255,255,0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              add(
                {
                  id: detail.id,
                  name: detail.name,
                  price: detail.price,
                },
                detailQty,
              );

              setDetail(null);
              setDetailQty(1);
            }}
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-full
              px-6
              py-4
              font-black
              uppercase
            "
            style={{
              background: a.accentColor,
              color: a.onAccent,
            }}
          >
            <span>Add to Cart</span>

            <span>
              {formatPKR(
                detail.price *
                  detailQty,
              )}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <Footer />
    </div>
  );
}
