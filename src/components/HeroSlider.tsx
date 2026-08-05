import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, GripHorizontal, Flame } from 'lucide-react';
import { products } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import { CorndogSVG } from '@/components/CorndogSVG';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { formatPKR } from '@/data/menu';
import { useCart } from '@/context/CartContext';

/* Staggered text reveal for product name */
function MaskedTitle({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ');
  return (
    <span className="inline-block">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-top mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: active ? 0 : '110%' }}
            transition={{ delay: 0.15 + wi * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export function HeroSlider() {
  const { index, setIndex, direction, activeProduct } = useTheme();
  const { add } = useCart();
  const [filling, setFilling] = useState(activeProduct.fillingOptions[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const dragStart = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const wheelLock = useRef(false);
  const a = activeProduct;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    setFilling(activeProduct.fillingOptions[0]);
  }, [index, activeProduct.fillingOptions]);

  // Transition lock
  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => setTransitioning(false), 1300);
    return () => clearTimeout(t);
  }, [index]);

  const goNext = useCallback(() => {
    if (transitioning) return;
    setIndex((index + 1) % products.length);
  }, [index, setIndex, transitioning]);

  const goPrev = useCallback(() => {
    if (transitioning) return;
    setIndex((index - 1 + products.length) % products.length);
  }, [index, setIndex, transitioning]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const onWheel = (e: React.WheelEvent) => {
    if (wheelLock.current || transitioning) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 20) return;
    wheelLock.current = true;
    if (delta > 0) goNext();
    else goPrev();
    setTimeout(() => { wheelLock.current = false; }, 800);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    // Parallax via rAF
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: py * 8, y: px * 12 });
      }
    });
    if (!isDragging) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 80) {
      if (delta < 0) goNext();
      else goPrev();
      setIsDragging(false);
    }
  };
  const onPointerUp = () => setIsDragging(false);

  // Product slide variants — circular/arc movement
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      y: 30,
      scale: 0.65,
      opacity: 0,
      rotateZ: dir > 0 ? 15 : -15,
      filter: 'blur(8px)',
    }),
    center: {
      x: 0, y: 0, scale: 1, opacity: 1, rotateZ: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      y: -30,
      scale: 0.65,
      opacity: 0,
      rotateZ: dir > 0 ? -15 : 15,
      filter: 'blur(8px)',
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    }),
  };

  // Adjacent product previews on the circular track
  const prevProduct = products[(index - 1 + products.length) % products.length];
  const nextProduct = products[(index + 1) % products.length];

  return (
    <section
      ref={sectionRef}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        background: a.bgGradient,
        transition: 'background 0.9s ease',
        minHeight: '100svh',
        paddingTop: 'var(--nav-h)',
      }}
    >
      {/* Grain */}
      <div className="grain" />

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div
          className="absolute top-1/4 right-[15%] w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: a.dominantColor, opacity: 0.35 }}
        />
      </motion.div>

      <ParticleCanvas product={a} reduced={reduced} />

      {/* Background decorative word — masked */}
      <div className="bg-word">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${index}`}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.08, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="bg-word-text"
            style={{ color: a.textColor }}
          >
            {a.shortName.toUpperCase()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main grid content */}
      <div className="relative z-10 mfz-container min-h-[calc(100svh-var(--nav-h))] flex items-center py-8 md:py-10">
        <div className="hero-grid w-full">
          {/* LEFT: content */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${index}`}
                variants={stagger}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {/* Number + category */}
                <motion.div variants={item} className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold tracking-[0.3em] px-3 py-1.5 rounded-full"
                    style={{ background: a.accentColor, color: a.onAccent }}
                  >
                    {String(index + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase tracking-widest" style={{ color: a.textColor, opacity: 0.5 }}>
                    {a.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h2
                  variants={item}
                  className="text-hero-title font-black leading-[0.9] space-title"
                  style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}
                >
                  <MaskedTitle text={a.name} active={true} />
                </motion.h2>

                {/* Tagline */}
                <motion.p variants={item} className="text-hero-tagline font-bold space-tagline" style={{ color: a.textColor, opacity: 0.9 }}>
                  {a.tagline}
                </motion.p>

                {/* Description */}
                <motion.p variants={item} className="text-hero-desc max-w-md space-desc" style={{ color: a.textColor, opacity: 0.85 }}>
                  {a.description}
                </motion.p>

                {/* Spice */}
                <motion.div variants={item} className="flex items-center gap-2 space-options">
                  <span className="text-xs uppercase tracking-widest" style={{ color: a.textColor, opacity: 0.5 }}>Spice</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Flame
                        key={i}
                        size={16}
                        fill={i < a.spiceLevel ? a.accentColor : 'none'}
                        color={i < a.spiceLevel ? a.accentColor : a.textColor}
                        style={{ opacity: i < a.spiceLevel ? 1 : 0.3 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Filling selector */}
                <motion.div variants={item} className="space-options">
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: a.textColor, opacity: 0.5 }}>Filling</div>
                  <div className="flex flex-wrap gap-2">
                    {a.fillingOptions.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilling(f)}
                        className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                        style={{
                          background: filling === f ? a.accentColor : 'rgba(255,255,255,0.1)',
                          color: filling === f ? a.onAccent : a.textColor,
                          border: `1px solid ${filling === f ? a.accentColor : 'rgba(255,255,255,0.2)'}`,
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Price */}
                <motion.div variants={item} className="text-3xl md:text-4xl font-black space-price" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
                  {formatPKR(a.price)}
                </motion.div>

                {/* CTAs */}
                <motion.div variants={item} className="flex flex-wrap gap-3 space-actions">
                  <button
                    onClick={() => add({ id: a.id, name: a.name, price: a.price, filling })}
                    className="px-7 py-3.5 rounded-full font-black text-base uppercase tracking-wide btn-primary"
                    style={{ background: a.accentColor, color: a.onAccent }}
                  >
                    {a.cta}
                  </button>
                  <Link
                    to="/menu"
                    className="px-7 py-3.5 rounded-full font-bold text-base uppercase tracking-wide border-2 transition-all hover:scale-105 inline-block"
                    style={{ borderColor: a.textColor, color: a.textColor }}
                  >
                    View Menu
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: product stage */}
          <div className="order-1 lg:order-2 relative">
            <div className="product-stage" style={{
  transform: "translateY(-100px)"
}}>
              {/* Circular track */}
              <div className="circular-track" />

              {/* Prev/next blurred previews on the arc */}
              <motion.div
                className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden opacity-30"
                style={{ top: '8%', left: '12%' }}
                animate={{ scale: [0.9, 1, 0.9] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="w-full h-full" style={{ background: prevProduct.bgGradient }} />
              </motion.div>
              <motion.div
                className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden opacity-30"
                style={{ bottom: '8%', right: '12%' }}
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="w-full h-full" style={{ background: nextProduct.bgGradient }} />
              </motion.div>

              {/* Main product */}
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={`dog-${index}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative z-10"
                  style={{
                    width: 'clamp(280px, 40vw, 560px)',
                    height: 'clamp(350px, 55vh, 700px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    animate={{
                      rotateY: tilt.y,
                      rotateX: tilt.x,
                      y: [0, -12, 0],
                    }}
                    transition={{
                      rotateX: { type: 'spring', stiffness: 40, damping: 12 },
                      rotateY: { type: 'spring', stiffness: 40, damping: 12 },
                      y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    className="w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Use real image if available, fallback to SVG */}
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="w-full h-full object-contain"
                        style={{
                          filter: `drop-shadow(0 25px 35px ${a.dominantColor}44) drop-shadow(0 0 20px ${a.accentColor}33)`,
                          transform: `rotate(${a.visual.rotation}deg) scale(${a.visual.scale})`,
                        }}
                        draggable={false}
                      />
                    ) : (
                      <CorndogSVG product={a} className="w-full h-full" />
                    )}
                  </motion.div>

                  {/* Ingredient labels — desktop only, constrained */}
                  {!reduced && (
                    <>
                      {a.ingredients.slice(0, 3).map((ing, i) => {
                        const positions = [
                          { top: '15%', left: '5%' },
                          { top: '45%', right: '5%' },
                          { bottom: '18%', left: '8%' },
                        ];
                        return (
                          <motion.div
                            key={ing}
                            className="hidden md:block absolute px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md z-20"
                            style={{
                              background: 'rgba(255,255,255,0.12)',
                              border: `1px solid ${a.accentColor}66`,
                              color: a.textColor,
                              ...positions[i],
                            }}
                            animate={{ y: [0, -12, 0], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
                          >
                            {ing}
                          </motion.div>
                        );
                      })}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
     <div
  className="absolute left-0 right-0 z-30 pb-5 md:pb-6"
  style={{ bottom: "-70px" }}
>
        <div className="mfz-container">
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: a.accentColor }}
              animate={{ width: `${((index + 1) / products.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={goPrev}
                disabled={transitioning}
                className="p-2.5 md:p-3 rounded-full border-2 transition-all hover:scale-110 disabled:opacity-40"
                style={{ borderColor: a.textColor, color: a.textColor }}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                disabled={transitioning}
                className="p-2.5 md:p-3 rounded-full border-2 transition-all hover:scale-110 disabled:opacity-40"
                style={{ borderColor: a.textColor, color: a.textColor }}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
              <div className="hidden md:flex items-center gap-2 ml-2 text-sm" style={{ color: a.textColor, opacity: 0.5 }}>
                <GripHorizontal size={16} /> Swipe the flavour
              </div>
            </div>

            <div className="flex gap-1.5 items-center">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => !transitioning && setIndex(i)}
                  disabled={transitioning}
                  className="transition-all disabled:cursor-not-allowed"
                  style={{
                    width: i === index ? 36 : 16,
                    height: 4,
                    background: i === index ? p.accentColor : 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                  }}
                  aria-label={`Go to ${p.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
