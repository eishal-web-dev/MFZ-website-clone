import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gem,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Watch,
  X,
} from 'lucide-react';

const LIVE = 'https://loveluxury.com/uk/';

type LuxurySlide = {
  id: string;
  shortName: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  bgGradient: string;
  dominantColor: string;
  accentColor: string;
  textColor: string;
  onAccent: string;
  backgroundWord: string;
  details: string[];
  cta: string;
  link: string;
  rotation: number;
  scale: number;
};

const slides: LuxurySlide[] = [
  {
    id: '01',
    shortName: 'BIRKIN 25',
    name: 'HERMÈS BIRKIN 25',
    category: 'HANDBAGS',
    tagline: 'The icon, curated.',
    description:
      'A collector-first way to discover exceptional Hermès pieces — authenticated, beautifully presented and ready for a private appointment.',
    image:
      'https://loveluxury.com/wp-content/uploads/2025/10/Hermes-Birkin-25-Orange-Minimum-Togo-Palladium-Hardware-2023-1-1024x683.jpg',
    bgGradient:
      'radial-gradient(circle at 68% 42%, #743719 0%, #3b180e 28%, #190b08 62%, #0d0806 100%)',
    dominantColor: '#d46d32',
    accentColor: '#ffc47f',
    textColor: '#fff5e8',
    onAccent: '#1a0c06',
    backgroundWord: 'HERMÈS',
    details: ['TOGO LEATHER', 'PALLADIUM', '2023'],
    cta: 'SHOP HERMÈS',
    link: `${LIVE}shop/hermes/`,
    rotation: -5,
    scale: 1.12,
  },
  {
    id: '02',
    shortName: 'NAUTILUS',
    name: 'PATEK NAUTILUS',
    category: 'WATCHES',
    tagline: 'Rare time. No compromise.',
    description:
      'Exceptional watches from the most important maisons, selected for collectors who care about provenance, condition and rarity.',
    image:
      'https://loveluxury.com/uk/wp-content/uploads/sites/2/sites/2/2025/08/Patek-Philippe-Nautilus-Olive-Green-32-Baguette-Diamonds-Bezel-5711-1300A-1-1024x683.jpg',
    bgGradient:
      'radial-gradient(circle at 68% 42%, #53624d 0%, #283329 28%, #111813 62%, #080b09 100%)',
    dominantColor: '#6d8066',
    accentColor: '#d8e5ba',
    textColor: '#f6f9ee',
    onAccent: '#0e150f',
    backgroundWord: 'PATEK',
    details: ['5711 / 1300A', 'OLIVE', 'BAGUETTE'],
    cta: 'SHOP WATCHES',
    link: `${LIVE}shop/watches/`,
    rotation: 4,
    scale: 1.02,
  },
  {
    id: '03',
    shortName: 'ALHAMBRA',
    name: 'VAN CLEEF ALHAMBRA',
    category: 'JEWELLERY',
    tagline: 'Made to keep forever.',
    description:
      'Signature jewellery from Van Cleef & Arpels, Cartier and the world’s most celebrated houses, presented like objects of art.',
    image:
      'https://loveluxury.com/wp-content/uploads/2026/05/Van-Cleef-Arpels-Vintage-Alhambra-Carnelian-18K-Yellow-Gold-5-Motifs-Bracelet-2024-6438-1-1024x683.jpeg',
    bgGradient:
      'radial-gradient(circle at 68% 42%, #7b2427 0%, #451114 30%, #1d090b 64%, #0d0607 100%)',
    dominantColor: '#9d2d32',
    accentColor: '#f1bd78',
    textColor: '#fff3e8',
    onAccent: '#1c090a',
    backgroundWord: 'VAN CLEEF',
    details: ['CARNELIAN', '18K GOLD', '5 MOTIFS'],
    cta: 'SHOP JEWELLERY',
    link: `${LIVE}shop/jewellery/`,
    rotation: -2,
    scale: 1.04,
  },
];

const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};

const titleItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, y: -14, transition: { duration: 0.2 } },
};

function MaskedTitle({ text }: { text: string }) {
  return (
    <span className="masked-title">
      {text.split(' ').map((word, index) => (
        <span className="masked-title__mask" key={`${word}-${index}`}>
          <motion.span
            initial={{ y: '112%' }}
            animate={{ y: 0 }}
            transition={{
              delay: 0.1 + index * 0.075,
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="mfz-nav">
        <div className="mfz-shell mfz-nav__inner">
          <a className="mfz-nav__logo" href="#top">
            LOVE <span>LUXURY</span>
          </a>

          <div className="mfz-nav__links">
            <a href={`${LIVE}shop/`} target="_blank" rel="noreferrer">SHOP</a>
            <a href={`${LIVE}shop/handbags/`} target="_blank" rel="noreferrer">HANDBAGS</a>
            <a href={`${LIVE}shop/watches/`} target="_blank" rel="noreferrer">WATCHES</a>
            <a href={`${LIVE}shop/jewellery/`} target="_blank" rel="noreferrer">JEWELLERY</a>
          </div>

          <a className="mfz-nav__cta" href={`${LIVE}sell/`} target="_blank" rel="noreferrer">
            SELL WITH US <ArrowRight size={15} />
          </a>

          <button className="mfz-nav__menu" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="mobile-menu__panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="mobile-menu__top">
                <strong>LOVE LUXURY</strong>
                <button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
              </div>
              <a href={`${LIVE}shop/`} target="_blank" rel="noreferrer">SHOP</a>
              <a href={`${LIVE}shop/handbags/`} target="_blank" rel="noreferrer">HANDBAGS</a>
              <a href={`${LIVE}shop/watches/`} target="_blank" rel="noreferrer">WATCHES</a>
              <a href={`${LIVE}shop/jewellery/`} target="_blank" rel="noreferrer">JEWELLERY</a>
              <a href={`${LIVE}sell/`} target="_blank" rel="noreferrer">SELL WITH US</a>
              <small>48 Beauchamp Place · Knightsbridge · London</small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const dragStart = useRef(0);
  const frameRef = useRef(0);
  const product = slides[index];

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      setReducedMotion(reduced.matches);
      setFinePointer(pointer.matches);
    };
    sync();
    reduced.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      pointer.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    setTransitioning(true);
    const timer = window.setTimeout(() => setTransitioning(false), 760);
    return () => window.clearTimeout(timer);
  }, [index]);

  const selectSlide = useCallback((next: number) => {
    if (transitioning || next === index) return;
    const isForward = next > index || (index === slides.length - 1 && next === 0);
    setDirection(isForward ? 1 : -1);
    setIndex(next);
  }, [index, transitioning]);

  const goNext = useCallback(() => {
    if (transitioning) return;
    setDirection(1);
    setIndex((value) => (value + 1) % slides.length);
  }, [transitioning]);

  const goPrevious = useCallback(() => {
    if (transitioning) return;
    setDirection(-1);
    setIndex((value) => (value - 1 + slides.length) % slides.length);
  }, [transitioning]);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrevious();
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [goNext, goPrevious]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (finePointer && sectionRef.current) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 8, y: x * 12 });
      });
    }

    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 70 && !transitioning) {
      distance < 0 ? goNext() : goPrevious();
      dragStart.current = event.clientX;
    }
  };

  const desktopVariants = {
    enter: (slideDirection: number) => ({
      x: slideDirection > 0 ? 120 : -120,
      y: 30,
      scale: 0.65,
      opacity: 0,
      rotateZ: slideDirection > 0 ? 15 : -15,
      filter: 'blur(8px)',
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateZ: 0,
      filter: 'blur(0px)',
      transition: { duration: reducedMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (slideDirection: number) => ({
      x: slideDirection > 0 ? -120 : 120,
      y: -30,
      scale: 0.65,
      opacity: 0,
      rotateZ: slideDirection > 0 ? -15 : 15,
      filter: 'blur(8px)',
      transition: { duration: reducedMotion ? 0.01 : 0.5 },
    }),
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="mfz-hero"
      style={{ background: product.bgGradient }}
      onPointerDown={(event) => { dragStart.current = event.clientX; }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="grain" />

      <div className="lux-particles" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, particleIndex) => (
          <motion.i
            key={particleIndex}
            style={{
              left: `${6 + ((particleIndex * 17) % 90)}%`,
              top: `${8 + ((particleIndex * 31) % 84)}%`,
              background: particleIndex % 4 === 0 ? '#ffffff' : product.accentColor,
              boxShadow: `0 0 13px ${product.accentColor}`,
            }}
            animate={reducedMotion ? undefined : {
              y: [8, -18, 8],
              x: [0, particleIndex % 2 === 0 ? 7 : -7, 0],
              opacity: [0.08, 0.72, 0.08],
              scale: [0.7, 1.35, 0.7],
            }}
            transition={{ duration: 4 + (particleIndex % 5), repeat: Infinity, delay: particleIndex * 0.11 }}
          />
        ))}
      </div>

      <motion.div
        className="mfz-hero__glow"
        style={{ background: product.dominantColor }}
        animate={reducedMotion ? undefined : { opacity: [0.26, 0.46, 0.26], scale: [0.96, 1.06, 0.96] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="bg-word">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={product.backgroundWord}
            className="bg-word-text"
            style={{ color: product.textColor }}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.075, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
          >
            {product.backgroundWord}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mfz-shell mfz-hero__content">
        <div className="hero-grid">
          <div className="mfz-hero__info">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${product.id}`}
                variants={titleContainer}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.div variants={titleItem} className="mfz-hero__eyebrow">
                  <span style={{ background: product.accentColor, color: product.onAccent }}>
                    {product.id} / 0{slides.length}
                  </span>
                  <small style={{ color: product.textColor }}>{product.category}</small>
                </motion.div>

                <motion.h1 variants={titleItem} style={{ color: product.textColor }}>
                  <MaskedTitle text={product.name} />
                </motion.h1>

                <motion.p variants={titleItem} className="mfz-hero__tagline" style={{ color: product.textColor }}>
                  {product.tagline}
                </motion.p>

                <motion.p variants={titleItem} className="mfz-hero__description" style={{ color: product.textColor }}>
                  {product.description}
                </motion.p>

                <motion.div variants={titleItem} className="mfz-hero__label" style={{ color: product.textColor }}>
                  DETAILS
                </motion.div>

                <motion.div variants={titleItem} className="mfz-hero__chips">
                  {product.details.map((detail, detailIndex) => (
                    <span
                      key={detail}
                      style={{
                        borderColor: detailIndex === 0 ? product.accentColor : `${product.textColor}33`,
                        background: detailIndex === 0 ? product.accentColor : 'rgba(255,255,255,.08)',
                        color: detailIndex === 0 ? product.onAccent : product.textColor,
                      }}
                    >
                      {detail}
                    </span>
                  ))}
                </motion.div>

                <motion.div variants={titleItem} className="mfz-hero__availability" style={{ color: product.textColor }}>
                  <Sparkles size={16} color={product.accentColor} />
                  AUTHENTICATED · AVAILABLE IN KNIGHTSBRIDGE
                </motion.div>

                <motion.div variants={titleItem} className="mfz-hero__actions">
                  <a
                    className="mfz-btn mfz-btn--primary"
                    href={product.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: product.accentColor, color: product.onAccent, boxShadow: `0 14px 45px ${product.accentColor}24` }}
                  >
                    {product.cta}
                  </a>
                  <a
                    className="mfz-btn mfz-btn--outline"
                    href={`${LIVE}sell/`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ borderColor: product.textColor, color: product.textColor }}
                  >
                    SELL A PIECE
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mfz-hero__visual">
            <div className="product-stage">
              <div className="circular-track" style={{ borderColor: product.accentColor }} />
              <div className="circular-track circular-track--inner" style={{ borderColor: product.textColor }} />

              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={`product-${product.id}`}
                  custom={direction}
                  variants={desktopVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="lux-product"
                >
                  <motion.div
                    className="lux-product__inner"
                    animate={{
                      rotateY: tilt.y,
                      rotateX: tilt.x,
                      y: reducedMotion ? 0 : [0, -12, 0],
                    }}
                    transition={{
                      rotateX: { type: 'spring', stiffness: 40, damping: 12 },
                      rotateY: { type: 'spring', stiffness: 40, damping: 12 },
                      y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      draggable={false}
                      fetchPriority="high"
                      style={{
                        transform: `rotate(${product.rotation}deg) scale(${product.scale})`,
                        filter: `drop-shadow(0 28px 36px ${product.dominantColor}77) drop-shadow(0 0 24px ${product.accentColor}2f)`,
                      }}
                    />
                  </motion.div>

                  {!reducedMotion && product.details.map((detail, detailIndex) => (
                    <motion.span
                      className={`floating-detail floating-detail--${detailIndex + 1}`}
                      key={detail}
                      style={{ borderColor: `${product.accentColor}80`, color: product.textColor }}
                      animate={{ y: [0, -12, 0], opacity: [0.68, 1, 0.68] }}
                      transition={{ duration: 3 + detailIndex, repeat: Infinity, delay: detailIndex * 0.35 }}
                    >
                      {detail}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="mfz-hero__controls">
        <div className="mfz-shell">
          <div className="mfz-progress">
            <motion.span
              style={{ background: product.accentColor }}
              animate={{ width: `${((index + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div className="mfz-control-row">
            <div className="mfz-control-row__arrows">
              <button onClick={goPrevious} disabled={transitioning} style={{ borderColor: product.textColor, color: product.textColor }} aria-label="Previous collection">
                <ChevronLeft size={20} />
              </button>
              <button onClick={goNext} disabled={transitioning} style={{ borderColor: product.textColor, color: product.textColor }} aria-label="Next collection">
                <ChevronRight size={20} />
              </button>
              <span style={{ color: product.textColor }}>
                {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            <div className="mfz-control-row__tabs">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.id}
                  onClick={() => selectSlide(itemIndex)}
                  disabled={transitioning}
                  className={itemIndex === index ? 'is-active' : ''}
                  style={{ color: product.textColor }}
                >
                  {item.shortName}
                </button>
              ))}
            </div>

            <div className="mfz-control-row__trust" style={{ color: product.textColor }}>
              <Star size={15} fill={product.accentColor} color={product.accentColor} /> 4.9 / 5
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const collections = [
  {
    icon: ShoppingBag,
    title: 'HANDBAGS',
    caption: 'Hermès · Chanel',
    image: slides[0].image,
    href: `${LIVE}shop/handbags/`,
    tone: '#b95b2c',
  },
  {
    icon: Watch,
    title: 'WATCHES',
    caption: 'Rolex · Patek Philippe · AP',
    image: slides[1].image,
    href: `${LIVE}shop/watches/`,
    tone: '#52634d',
  },
  {
    icon: Gem,
    title: 'JEWELLERY',
    caption: 'Cartier · Van Cleef & Arpels',
    image: slides[2].image,
    href: `${LIVE}shop/jewellery/`,
    tone: '#7f2328',
  },
];

function Collections() {
  return (
    <section className="mfz-section collections" id="collections">
      <div className="mfz-shell">
        <div className="mfz-section-head">
          <span>THE COLLECTION</span>
          <h2>CHOOSE YOUR<br />OBSESSION.</h2>
          <p>Three worlds of exceptional pieces, each selected with the same uncompromising eye.</p>
        </div>

        <div className="collection-cards">
          {collections.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="collection-card"
                style={{ background: item.tone }}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              >
                <div className="collection-card__number">0{index + 1}</div>
                <Icon className="collection-card__icon" />
                <div className="collection-card__image"><img src={item.image} alt={item.title} /></div>
                <div className="collection-card__copy">
                  <small>{item.caption}</small>
                  <h3>{item.title}</h3>
                  <span>EXPLORE <ArrowRight size={18} /></span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="trust-strip__marquee">
        <span>AUTHENTICATED</span><i>✦</i><span>CURATED</span><i>✦</i><span>KNIGHTSBRIDGE</span><i>✦</i><span>WORLDWIDE</span><i>✦</i>
        <span>AUTHENTICATED</span><i>✦</i><span>CURATED</span><i>✦</i><span>KNIGHTSBRIDGE</span><i>✦</i><span>WORLDWIDE</span><i>✦</i>
      </div>
    </section>
  );
}

function SellSection() {
  return (
    <section className="sell-section">
      <div className="mfz-shell sell-section__grid">
        <div>
          <span className="sell-section__eyebrow">SELL WITH LOVE LUXURY</span>
          <h2>YOUR PIECE.<br />OUR EXPERTISE.</h2>
        </div>
        <div className="sell-section__copy">
          <ShieldCheck size={54} />
          <p>Upload your piece, receive an expert valuation, arrange your appointment and sell with confidence.</p>
          <a href={`${LIVE}sell/`} target="_blank" rel="noreferrer">START A VALUATION <ArrowRight /></a>
        </div>
      </div>
    </section>
  );
}

function Showroom() {
  return (
    <section className="showroom">
      <div className="showroom__word">KNIGHTSBRIDGE</div>
      <div className="mfz-shell showroom__content">
        <span>48 BEAUCHAMP PLACE · LONDON SW3 1NX</span>
        <h2>COME SEE<br />THE REAL THING.</h2>
        <a href={`${LIVE}contact/`} target="_blank" rel="noreferrer">VISIT LOVE LUXURY <ArrowRight /></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="mfz-shell">
        <div className="footer__brand">LOVE <span>LUXURY</span></div>
        <div className="footer__bottom">
          <span>LONDON · DUBAI · WORLDWIDE</span>
          <span>CONCEPT REDESIGN</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="site">
      <Navbar />
      <Hero />
      <Collections />
      <TrustStrip />
      <SellSection />
      <Showroom />
      <Footer />
    </div>
  );
}
