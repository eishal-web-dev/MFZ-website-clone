import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Gem,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  Watch,
  X,
} from 'lucide-react';

const LIVE = 'https://loveluxury.com/uk/';

const slides = [
  {
    id: '01',
    category: 'HAND BAGS',
    kicker: 'THE HOUSE OF HERMÈS',
    title: ['OBJECTS', 'OF DESIRE.'],
    copy: 'Exceptional Hermès pieces, selected for collectors who know exactly what they are looking at.',
    image: 'https://loveluxury.com/wp-content/uploads/2025/10/Hermes-Birkin-25-Orange-Minimum-Togo-Palladium-Hardware-2023-1-1024x683.jpg',
    bg: '#f1e9dd',
    ink: '#17140f',
    accent: '#c36f32',
    link: 'https://loveluxury.com/uk/shop/hermes/',
    imageScale: 1.08,
  },
  {
    id: '02',
    category: 'WATCHES',
    kicker: 'RARE TIMEPIECES',
    title: ['TIME,', 'CURATED.'],
    copy: 'Rolex, Patek Philippe, Audemars Piguet and Richard Mille — chosen with the eye of a private collector.',
    image: 'https://loveluxury.com/uk/wp-content/uploads/sites/2/sites/2/2025/08/Patek-Philippe-Nautilus-Olive-Green-32-Baguette-Diamonds-Bezel-5711-1300A-1-1024x683.jpg',
    bg: '#dfe1d4',
    ink: '#111610',
    accent: '#66705a',
    link: 'https://loveluxury.com/uk/shop/watches/',
    imageScale: 0.92,
  },
  {
    id: '03',
    category: 'JEWELLERY',
    kicker: 'PRECIOUS DETAILS',
    title: ['KEEP', 'FOREVER.'],
    copy: 'Cartier and Van Cleef & Arpels, presented with the quiet confidence that real luxury deserves.',
    image: 'https://loveluxury.com/wp-content/uploads/2026/05/Van-Cleef-Arpels-Vintage-Alhambra-Carnelian-18K-Yellow-Gold-5-Motifs-Bracelet-2024-6438-1-1024x683.jpeg',
    bg: '#efe6df',
    ink: '#21100f',
    accent: '#8f171c',
    link: 'https://loveluxury.com/uk/shop/jewellery/',
    imageScale: 0.94,
  },
] as const;

const categories = [
  {
    number: '01',
    label: 'Handbags',
    sub: 'Hermès · Chanel',
    image: 'https://loveluxury.com/wp-content/uploads/2025/10/Hermes-Birkin-25-Orange-Minimum-Togo-Palladium-Hardware-2023-1-1024x683.jpg',
    href: 'https://loveluxury.com/uk/shop/handbags/',
  },
  {
    number: '02',
    label: 'Watches',
    sub: 'Rolex · Patek Philippe · AP',
    image: 'https://loveluxury.com/uk/wp-content/uploads/sites/2/sites/2/2025/08/Patek-Philippe-Nautilus-Olive-Green-32-Baguette-Diamonds-Bezel-5711-1300A-1-1024x683.jpg',
    href: 'https://loveluxury.com/uk/shop/watches/',
  },
  {
    number: '03',
    label: 'Jewellery',
    sub: 'Cartier · Van Cleef & Arpels',
    image: 'https://loveluxury.com/wp-content/uploads/2026/05/Van-Cleef-Arpels-Vintage-Alhambra-Carnelian-18K-Yellow-Gold-5-Motifs-Bracelet-2024-6438-1-1024x683.jpeg',
    href: 'https://loveluxury.com/uk/shop/jewellery/',
  },
];

function SplitTitle({ lines }: { lines: readonly string[] }) {
  return (
    <span className="split-title">
      {lines.map((line, lineIndex) => (
        <span className="split-title__line" key={line}>
          {line.split(' ').map((word, wordIndex) => (
            <span className="split-title__mask" key={`${word}-${wordIndex}`}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.82,
                  delay: 0.08 + lineIndex * 0.07 + wordIndex * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function MagneticLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`magnetic-link ${light ? 'magnetic-link--light' : ''}`}
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <span>{children}</span>
      <ArrowUpRight size={15} strokeWidth={1.6} />
    </motion.a>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const slide = slides[index];

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const go = (next: number) => {
    setDirection(next > index || (index === slides.length - 1 && next === 0) ? 1 : -1);
    setIndex(next);
  };

  const previous = () => go((index - 1 + slides.length) % slides.length);
  const next = () => go((index + 1) % slides.length);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -7, y: x * 10 });
  };

  return (
    <section
      ref={sectionRef}
      className="hero"
      style={{ background: slide.bg, color: slide.ink }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="hero__grain" />
      <div className="hero__hairline" />

      <motion.div
        className="hero__glow"
        animate={{ backgroundColor: `${slide.accent}33`, scale: reduced ? 1 : [1, 1.08, 1] }}
        transition={{ backgroundColor: { duration: 0.8 }, scale: { duration: 6, repeat: Infinity } }}
      />

      <div className="hero__sparks" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.i
            key={i}
            style={{
              left: `${8 + ((i * 17) % 87)}%`,
              top: `${14 + ((i * 29) % 73)}%`,
              background: slide.accent,
            }}
            animate={reduced ? undefined : { y: [0, -18, 0], opacity: [0.08, 0.5, 0.08] }}
            transition={{ duration: 4.5 + (i % 5), repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </div>

      <div className="hero__content page-shell">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            className="hero__copy"
            key={`copy-${slide.id}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -22 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero__meta">
              <span>{slide.id} / 03</span>
              <span>{slide.category}</span>
            </div>
            <p className="eyebrow">{slide.kicker}</p>
            <h1><SplitTitle lines={slide.title} /></h1>
            <p className="hero__description">{slide.copy}</p>
            <div className="hero__actions">
              <MagneticLink href={slide.link}>Explore collection</MagneticLink>
              <a className="text-link" href="https://loveluxury.com/uk/sell/" target="_blank" rel="noreferrer">
                Sell with Love Luxury
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="hero__stage">
          <span className="hero__vertical">KNIGHTSBRIDGE · LONDON</span>
          <div className="hero__orbit hero__orbit--one" />
          <div className="hero__orbit hero__orbit--two" />
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={slide.id}
              className="hero__product-wrap"
              custom={direction}
              initial={{ opacity: 0, x: direction * 110, y: 30, scale: 0.72, rotate: direction * 9, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction * -100, y: -22, scale: 0.78, rotate: direction * -8, filter: 'blur(8px)' }}
              transition={{ duration: reduced ? 0.01 : 0.72, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1200 }}
            >
              <motion.div
                className="hero__product-inner"
                animate={reduced ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ rotateX: tilt.x, rotateY: tilt.y }}
              >
                <img
                  src={slide.image}
                  alt={`${slide.category} at Love Luxury`}
                  fetchPriority="high"
                  draggable={false}
                  style={{ transform: `scale(${slide.imageScale})` }}
                />
                <span className="hero__shadow" style={{ background: `${slide.accent}55` }} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="hero__bottom page-shell">
        <div className="hero__controls">
          <button onClick={previous} aria-label="Previous collection"><ArrowLeft size={17} /></button>
          <div className="hero__progress">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                onClick={() => go(itemIndex)}
                className={itemIndex === index ? 'is-active' : ''}
                aria-label={`Go to ${item.category}`}
              >
                <span />
              </button>
            ))}
          </div>
          <button onClick={next} aria-label="Next collection"><ArrowRight size={17} /></button>
        </div>
        <a href="#collections" className="hero__scroll"><ArrowDown size={15} /> Scroll to discover</a>
        <div className="hero__trust"><Star size={13} fill="currentColor" /> 4.9 / 5 · 927 reviews</div>
      </div>
    </section>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = useMemo(() => [
    ['Shop', `${LIVE}shop/`],
    ['Handbags', `${LIVE}shop/handbags/`],
    ['Watches', `${LIVE}shop/watches/`],
    ['Jewellery', `${LIVE}shop/jewellery/`],
    ['Sell', `${LIVE}sell/`],
  ], []);

  return (
    <>
      <nav className="nav">
        <div className="page-shell nav__inner">
          <button className="nav__menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
          <a className="nav__wordmark" href="#top" aria-label="Love Luxury home">LOVE <span>LUXURY</span></a>
          <div className="nav__links">
            {links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}
          </div>
          <a className="nav__cta" href={`${LIVE}sell/`} target="_blank" rel="noreferrer">Free valuation <ArrowUpRight size={14} /></a>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="menu-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="menu-panel__inner" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.58, ease: [0.76, 0, 0.24, 1] }}>
              <div className="menu-panel__top">
                <span>LOVE LUXURY</span>
                <button onClick={() => setOpen(false)}><X size={22} /></button>
              </div>
              <div className="menu-panel__links">
                {links.map(([label, href], i) => (
                  <a href={href} key={label} target="_blank" rel="noreferrer"><small>0{i + 1}</small>{label}<ArrowUpRight /></a>
                ))}
              </div>
              <p>48 Beauchamp Place · Knightsbridge · London</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Collections() {
  return (
    <section className="collections section" id="collections">
      <div className="page-shell">
        <div className="section-heading">
          <p className="eyebrow">THE PRIVATE GALLERY</p>
          <h2>Three worlds.<br /><em>One standard.</em></h2>
          <p>Luxury should never feel crowded. Explore the collection the way you would experience a private appointment: one exceptional object at a time.</p>
        </div>

        <div className="collection-grid">
          {categories.map((item, i) => (
            <motion.a
              className="collection-card"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              <div className="collection-card__image"><img src={item.image} alt={item.label} loading="lazy" /></div>
              <div className="collection-card__top"><span>{item.number}</span><ArrowUpRight size={18} /></div>
              <div className="collection-card__copy"><small>{item.sub}</small><h3>{item.label}</h3></div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="statement">
      <div className="statement__track">
        <span>AUTHENTICITY</span><i>✦</i><span>PROVENANCE</span><i>✦</i><span>RARITY</span><i>✦</i><span>EXPERTISE</span><i>✦</i><span>AUTHENTICITY</span>
      </div>
      <div className="page-shell statement__inner">
        <p className="eyebrow">TRUSTED EXPERTS IN LUXURY RESALE SINCE 2012</p>
        <h2>Some things are purchased.<br /><em>Others are collected.</em></h2>
      </div>
    </section>
  );
}

function FeaturePiece() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [90, -90]), { stiffness: 90, damping: 24 });
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section className="feature-piece" ref={section}>
      <div className="feature-piece__halo" />
      <div className="page-shell feature-piece__inner">
        <div className="feature-piece__copy">
          <p className="eyebrow">NEW ARRIVAL · 2026</p>
          <h2>Mini Kelly.<br /><em>Maximum presence.</em></h2>
          <p>Hermès Mini Kelly HSS Noir — black Epsom with a Bordeaux verso and palladium hardware. Box fresh.</p>
          <div className="feature-piece__price">£28,000 <span>Box Fresh</span></div>
          <MagneticLink href="https://loveluxury.com/uk/shop/hermes-mini-kelly-hss-noir-black-verso-bordeaux-epsom-palladium-hardware/" light>
            View the piece
          </MagneticLink>
        </div>
        <motion.div className="feature-piece__visual" style={{ y, rotate }}>
          <span className="feature-piece__ring" />
          <img src="https://loveluxury.com/wp-content/uploads/2026/08/Hermes-Mini-Kelly-HSS-Noir-Black-Verso-Bordeaux-Epsom-Palladium-Hardware-2026-1.jpg" alt="Hermès Mini Kelly HSS Noir" loading="lazy" />
          <div className="feature-piece__label"><span>HERMÈS</span><small>20 × 12 × 6 CM</small></div>
        </motion.div>
      </div>
    </section>
  );
}

function SellSection() {
  const steps = [
    ['01', 'Complete the form', 'Share details and images for an accurate first valuation.'],
    ['02', 'Book an appointment', 'Same-day appointments are available in Knightsbridge.'],
    ['03', 'Expert inspection', 'A specialist examines the piece and confirms your quote.'],
    ['04', 'Receive payment', 'Secure payment is made by bank transfer.'],
  ];

  return (
    <section className="sell section">
      <div className="page-shell">
        <div className="sell__heading">
          <div><p className="eyebrow">SELL WITH LOVE LUXURY</p><h2>Your collection<br /><em>deserves certainty.</em></h2></div>
          <p>A calmer, more considered way to sell high-value pieces — with specialists, clear steps and no marketplace noise.</p>
        </div>
        <div className="sell__steps">
          {steps.map(([num, title, copy]) => (
            <div className="sell-step" key={num}>
              <span>{num}</span><h3>{title}</h3><p>{copy}</p>
            </div>
          ))}
        </div>
        <a className="sell__cta" href={`${LIVE}sell/`} target="_blank" rel="noreferrer"><span>VALUE MY PIECE</span><ArrowUpRight /></a>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="trust section">
      <div className="page-shell trust__inner">
        <div className="trust__visual">
          <div className="trust__macro"><img src="https://loveluxury.com/uk/wp-content/uploads/sites/2/sites/2/2025/08/Patek-Philippe-Nautilus-Olive-Green-32-Baguette-Diamonds-Bezel-5711-1300A-1-1024x683.jpg" alt="Patek Philippe watch detail" loading="lazy" /></div>
          <span className="trust__stamp"><ShieldCheck /><b>CERTIFIED</b><small>LOVE LUXURY</small></span>
        </div>
        <div className="trust__copy">
          <p className="eyebrow">LIFETIME GUARANTEE OF AUTHENTICITY</p>
          <h2>Details<br /><em>don’t lie.</em></h2>
          <p>Every piece is examined by specialists before it earns a place in the collection. Because with rare objects, confidence is part of the purchase.</p>
          <div className="trust__points">
            <span><ShieldCheck /> Expert authentication</span>
            <span><Watch /> Specialist watch knowledge</span>
            <span><Gem /> Luxury jewellery expertise</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit">
      <div className="page-shell visit__inner">
        <div><p className="eyebrow">THE LONDON SHOWROOM</p><h2>Knightsbridge.<br /><em>By appointment.</em></h2></div>
        <div className="visit__details">
          <p>48 Beauchamp Place<br />Knightsbridge, London<br />SW3 1NX</p>
          <p>Mon–Sat · 11:00–18:00<br />Sun · 12:00–17:00</p>
          <MagneticLink href="https://loveluxury.com/uk/contact-us/" light>Arrange a visit</MagneticLink>
        </div>
      </div>
      <div className="visit__word">LOVE LUXURY</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="page-shell footer__top">
        <div className="footer__brand"><Sparkles size={18} /><span>LOVE LUXURY</span></div>
        <div className="footer__links">
          <a href={`${LIVE}shop/`} target="_blank" rel="noreferrer">Shop</a>
          <a href={`${LIVE}sell/`} target="_blank" rel="noreferrer">Sell</a>
          <a href={`${LIVE}authentication/`} target="_blank" rel="noreferrer">Authentication</a>
          <a href={`${LIVE}about-us/`} target="_blank" rel="noreferrer">About</a>
          <a href={`${LIVE}contact-us/`} target="_blank" rel="noreferrer">Contact</a>
        </div>
      </div>
      <div className="page-shell footer__bottom"><span>Concept redesign · 2026</span><span>London · Dubai · Worldwide</span></div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="site">
      <Navbar />
      <Hero />
      <Collections />
      <Statement />
      <FeaturePiece />
      <SellSection />
      <Trust />
      <Visit />
      <Footer />
    </div>
  );
}
