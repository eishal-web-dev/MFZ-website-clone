import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, MapPin, Star } from 'lucide-react';
import { products } from '@/data/products';
import { menuItems, formatPKR } from '@/data/menu';
import { branches } from '@/data/branches';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { CorndogSVG } from '@/components/CorndogSVG';

/* ============ SECTION 1: THE CRUNCH LINEUP ============ */
export function CrunchLineup() {
  const { activeProduct, setIndex } = useTheme();
  const { add } = useCart();
  const a = activeProduct;

  return (
    <section className="relative mfz-section overflow-hidden" style={{ background: a.bgColor }}>
      <div className="mfz-container">
        <div className="mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>The Lineup</span>
          <h2 className="text-section-title font-black mt-3" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
            The Crunch Lineup
          </h2>
          <p className="text-lg mt-3 max-w-xl" style={{ color: a.textColor, opacity: 0.7 }}>
            Eight corndogs. Eight personalities. Each one a collectible character in the MFZ universe.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 60 }}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setIndex(i)}
              className="relative rounded-3xl p-5 md:p-6 cursor-pointer group overflow-hidden"
              style={{ background: p.bgGradient, border: `1px solid ${p.accentColor}33` }}
            >
              <div className="absolute top-3 right-3 text-xs font-black opacity-40" style={{ color: p.textColor, fontFamily: 'Anton, sans-serif' }}>
                {String(p.id).padStart(2, '0')}
              </div>
              <div className="h-44 md:h-52 mb-4 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                  className="w-20 h-40 md:w-24 md:h-48"
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" draggable={false} />
                  ) : (
                    <CorndogSVG product={p} className="w-full h-full" showStick={false} tilt={0} />
                  )}
                </motion.div>
              </div>
              <h3 className="text-product-card-title font-black mb-1" style={{ color: p.textColor, fontFamily: 'Anton, sans-serif' }}>{p.shortName}</h3>
              <p className="text-xs mb-3" style={{ color: p.textColor, opacity: 0.7 }}>{p.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="font-black text-lg" style={{ color: p.accentColor }}>{formatPKR(p.price)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); add({ id: p.id, name: p.name, price: p.price }); }}
                  className="p-2 rounded-full transition-transform hover:scale-110"
                  style={{ background: p.accentColor, color: p.onAccent }}
                  aria-label={`Add ${p.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION 2: INSIDE THE CRUNCH (exploded diagram) ============ */
function ExplodedLayer({ layer, index, separation, rotation }: {
  layer: { label: string; sub: string; color: string; y: number; z: number };
  index: number;
  separation: MotionValue<number>;
  rotation: MotionValue<number>;
}) {
  const y = useTransform(separation, [0, 1], [0, layer.y]);

  return (
    <div className="absolute flex items-center gap-4 md:gap-6" style={{ zIndex: layer.z }}>
      {index % 2 === 0 && (
        <motion.div
          className="hidden md:block text-right w-32 lg:w-40"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <p className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--theme-text)' }}>{layer.label}</p>
          <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{layer.sub}</p>
        </motion.div>
      )}

      <motion.div style={{ y, rotate: rotation }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 'clamp(100px, 16vw, 160px)',
            height: 'clamp(40px, 7vw, 70px)',
            background: layer.color,
            boxShadow: `0 8px 30px ${layer.color}44, inset 0 -8px 20px rgba(0,0,0,0.25), inset 0 8px 15px rgba(255,255,255,0.15)`,
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {index % 2 !== 0 && (
        <motion.div
          className="hidden md:block w-32 lg:w-40"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <p className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--theme-text)' }}>{layer.label}</p>
          <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{layer.sub}</p>
        </motion.div>
      )}
    </div>
  );
}

export function InsideTheCrunch() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const separation = useTransform(scrollYProgress, [0.15, 0.45, 0.6, 0.85], [0, 1, 1, 0]);
  const rotation = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const layers = useMemo(() => [
    { label: 'Saucy Finish', sub: 'Drizzled to perfection', color: a.accentColor, y: -200, z: 6 },
    { label: 'Crispy Coating', sub: 'Golden crunch layer', color: a.dominantColor, y: -120, z: 5 },
    { label: 'Golden Batter', sub: 'Signature cornmeal shell', color: a.secondaryColor, y: -40, z: 4 },
    { label: 'Melted Centre', sub: 'Stretchy mozzarella', color: '#ffdd55', y: 40, z: 3 },
    { label: 'Signature Filling', sub: 'Premium sausage', color: '#c25a3a', y: 120, z: 2 },
    { label: 'The Stick', sub: 'Built to hold the crunch', color: '#8b6f47', y: 200, z: 1 },
  ], [a]);

  return (
    <section ref={ref} className="relative mfz-section overflow-hidden" style={{ background: a.bgGradient }}>
      <div className="grain" />
      <div className="mfz-container relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Anatomy</span>
          <h2 className="text-section-title font-black mt-3" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
            Inside the Crunch
          </h2>
          <p className="text-lg mt-3" style={{ color: a.textColor, opacity: 0.7 }}>Every layer hits different.</p>
        </div>

        <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[600px]">
          {layers.map((layer, i) => (
            <ExplodedLayer key={layer.label} layer={layer} index={i} separation={separation} rotation={rotation} />
          ))}
        </div>

        <div className="md:hidden mt-8 space-y-3">
          {layers.map((layer) => (
            <div key={layer.label} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: layer.color }} />
              <div>
                <p className="text-sm font-black uppercase" style={{ color: a.textColor }}>{layer.label}</p>
                <p className="text-xs" style={{ color: a.textColor, opacity: 0.5 }}>{layer.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION 3: BUILD YOUR MFZ (preview) ============ */
export function BuildPreview() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <section className="relative mfz-section overflow-hidden" style={{ background: a.bgGradient }}>
      <div className="mfz-container grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Make It Yours</span>
          <h2 className="text-section-title font-black mt-3 mb-4" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
            Build Your MFZ
          </h2>
          <p className="text-lg mb-6 max-w-md" style={{ color: a.textColor, opacity: 0.8 }}>
            Pick your coating, filling, sauces and extras. Watch your creation come to life in real time.
          </p>
          <Link
            to="/build"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase tracking-wide btn-primary"
            style={{ background: a.accentColor, color: a.onAccent }}
          >
            Start Building <ArrowRight size={18} />
          </Link>
        </div>
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-40 h-80 md:w-48 md:h-96"
          >
            {a.image ? (
              <img src={a.image} alt={a.name} className="w-full h-full object-contain" draggable={false} />
            ) : (
              <CorndogSVG product={a} className="w-full h-full" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION 4: BESTSELLERS ============ */
export function Bestsellers() {
  const { activeProduct } = useTheme();
  const { add } = useCart();
  const a = activeProduct;
  const bestsellers = menuItems.filter((m) => m.popular).slice(0, 4);

  return (
    <section className="relative mfz-section" style={{ background: a.bgColor }}>
      <div className="mfz-container">
        <div className="flex items-end justify-between mb-10 md:mb-12 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Fan Favourites</span>
            <h2 className="text-section-title font-black mt-3" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>MFZ Favourites</h2>
          </div>
          <Link to="/menu" className="flex items-center gap-2 font-bold uppercase text-sm transition-transform hover:translate-x-1" style={{ color: a.accentColor }}>
            Full Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-5 md:p-6 group"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} fill={a.accentColor} color={a.accentColor} />
                <span className="text-xs font-bold uppercase" style={{ color: a.accentColor }}>Bestseller</span>
              </div>
              <h3 className="text-product-card-title font-black mb-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>{item.name}</h3>
              <p className="text-sm mb-4" style={{ color: a.textColor, opacity: 0.6 }}>{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black" style={{ color: a.accentColor }}>{formatPKR(item.price)}</span>
                <button
                  onClick={() => add({ id: item.id, name: item.name, price: item.price })}
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
      </div>
    </section>
  );
}

/* ============ SECTION 5: LOCATIONS PREVIEW ============ */
export function LocationsPreview() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <section className="relative mfz-section" style={{ background: a.bgGradient }}>
      <div className="mfz-container">
        <div className="mb-10 md:mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Find Us</span>
          <h2 className="text-section-title font-black mt-3" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Our Locations</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-5 md:p-6"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}33` }}
            >
              <MapPin size={24} style={{ color: a.accentColor }} />
              <h3 className="text-product-card-title font-black mt-3 mb-1" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>{b.name}</h3>
              <p className="text-sm mb-3" style={{ color: a.textColor, opacity: 0.6 }}>{b.area}</p>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: b.delivery ? a.accentColor : 'rgba(255,255,255,0.1)', color: b.delivery ? a.onAccent : a.textColor, opacity: b.delivery ? 1 : 0.5 }}>
                {b.delivery ? 'Delivery Available' : 'Pickup Only'}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/locations" className="inline-flex items-center gap-2 font-bold uppercase text-sm transition-transform hover:translate-x-1" style={{ color: a.accentColor }}>
            View Map <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION 6: SOCIAL GALLERY ============ */
export function SocialGallery() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <section className="relative mfz-section" style={{ background: a.bgColor }}>
      <div className="mfz-container">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>The Crunch Community</span>
          <h2 className="text-section-title font-black mt-3" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Social Gallery</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => {
            const p = products[i % products.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: p.bgGradient }}
              >
                <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }} className="w-16 h-32 md:w-20 md:h-40">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" draggable={false} />
                  ) : (
                    <CorndogSVG product={p} className="w-full h-full" showStick={false} tilt={0} />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-sm mt-6" style={{ color: a.textColor, opacity: 0.5 }}>
          Tag @mfz.pk on Instagram to be featured. Content shown as placeholder pending approval.
        </p>
      </div>
    </section>
  );
}

/* ============ SECTION 7: CRUNCH CLUB ============ */
export function CrunchClub() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  const perks = ['Earn Crunch Points', 'Save Favourites', 'Previous Orders', 'Unlock Offers', 'Birthday Rewards'];

  return (
    <section className="relative mfz-section overflow-hidden" style={{ background: a.bgGradient }}>
      <div className="mfz-container text-center max-w-3xl">
        <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Proposed Feature</span>
        <h2 className="text-section-title font-black mt-3 mb-4" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
          CRUNCH CLUB
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: a.textColor, opacity: 0.8 }}>
          Join the club. Earn points on every crunch. Unlock rewards, save your favourites and get a birthday treat.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {perks.map((perk) => (
            <span key={perk} className="px-5 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: a.textColor, border: `1px solid ${a.accentColor}44` }}>
              {perk}
            </span>
          ))}
        </div>
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black uppercase text-lg btn-primary"
          style={{ background: a.accentColor, color: a.onAccent }}
        >
          Join the Club
        </Link>
        <p className="text-xs mt-4" style={{ color: a.textColor, opacity: 0.4 }}>
          Proposed loyalty feature — benefits pending MFZ approval.
        </p>
      </div>
    </section>
  );
}

/* ============ SECTION 8: FINAL CTA ============ */
export function FinalCTA() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <section className="relative mfz-section overflow-hidden flex flex-col items-center justify-center text-center" style={{ background: a.bgGradient }}>
      <div className="grain" />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="w-32 h-64 md:w-40 md:h-80 mb-8 relative z-10"
      >
        {a.image ? (
          <img src={a.image} alt={a.name} className="w-full h-full object-contain" draggable={false} />
        ) : (
          <CorndogSVG product={a} className="w-full h-full" />
        )}
      </motion.div>
      <h2 className="text-section-title font-black mb-6 relative z-10" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
        Ready to Crunch?
      </h2>
      <p className="text-xl mb-8 max-w-xl relative z-10" style={{ color: a.textColor, opacity: 0.7 }}>
        Your next favourite corndog is one click away.
      </p>
      <Link
        to="/menu"
        className="px-12 py-5 rounded-full font-black uppercase text-xl btn-primary relative z-10"
        style={{ background: a.accentColor, color: a.onAccent }}
      >
        Order Now
      </Link>
    </section>
  );
}
