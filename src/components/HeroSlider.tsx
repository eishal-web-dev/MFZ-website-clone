import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  GripHorizontal,
  Plus,
} from 'lucide-react';

import { products } from '@/data/products';
import { formatPKR } from '@/data/menu';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { CorndogSVG } from '@/components/CorndogSVG';
import { ParticleCanvas } from '@/components/ParticleCanvas';

/* =========================================================
   TITLE ANIMATION
========================================================= */

function MaskedTitle({
  text,
}: {
  text: string;
}) {
  const words = text.split(' ');

  return (
    <span className="inline-block">
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="mr-[0.22em] inline-block align-top"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              delay: 0.12 + wordIndex * 0.07,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const contentContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const contentItem = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.2,
    },
  },
};


const mobileSparkPositions = [
  { left: '9%', top: '18%', size: 5, delay: 0.1, duration: 3.8 },
  { left: '20%', top: '8%', size: 3, delay: 0.8, duration: 4.4 },
  { left: '80%', top: '10%', size: 4, delay: 0.3, duration: 3.6 },
  { left: '93%', top: '24%', size: 3, delay: 1.2, duration: 4.1 },
  { left: '4%', top: '45%', size: 4, delay: 0.5, duration: 4.6 },
  { left: '96%', top: '50%', size: 5, delay: 0.9, duration: 3.9 },
  { left: '12%', top: '73%', size: 3, delay: 1.4, duration: 4.2 },
  { left: '86%', top: '78%', size: 4, delay: 0.2, duration: 4.8 },
  { left: '28%', top: '91%', size: 4, delay: 1.0, duration: 4.0 },
  { left: '70%', top: '94%', size: 3, delay: 0.6, duration: 3.7 },
];

function MobileProductAtmosphere({
  accentColor,
  dominantColor,
  reducedMotion,
}: {
  accentColor: string;
  dominantColor: string;
  reducedMotion: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[410px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[46px]"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}45 0%, ${dominantColor}25 42%, transparent 76%)`,
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                scale: [0.96, 1.06, 0.96],
                opacity: [0.58, 0.86, 0.58],
              }
        }
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div
        className="absolute left-1/2 top-[48%] h-[430px] w-[220px] -translate-x-1/2 -translate-y-1/2 blur-2xl"
        style={{
          background: `linear-gradient(180deg, ${accentColor}20 0%, ${dominantColor}12 48%, transparent 100%)`,
          clipPath: 'polygon(34% 0, 66% 0, 100% 100%, 0 100%)',
        }}
      />

      {mobileSparkPositions.map((spark, sparkIndex) => (
        <motion.span
          key={sparkIndex}
          className="absolute rounded-full"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.size,
            height: spark.size,
            background: sparkIndex % 3 === 0 ? '#fff2a8' : accentColor,
            boxShadow: `0 0 ${spark.size * 3}px ${accentColor}`,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: [8, -14, 8],
                  x: [0, sparkIndex % 2 === 0 ? 7 : -7, 0],
                  opacity: [0.18, 0.95, 0.18],
                  scale: [0.65, 1.25, 0.65],
                }
          }
          transition={{
            duration: spark.duration,
            repeat: Infinity,
            delay: spark.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {[0, 1, 2].map((smokeIndex) => (
        <motion.div
          key={smokeIndex}
          className="absolute left-1/2 top-[7%] h-28 w-16 rounded-full blur-2xl"
          style={{
            marginLeft: (smokeIndex - 1) * 28,
            background: 'rgba(255,255,255,0.13)',
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: [18, -58],
                  x: [0, smokeIndex === 1 ? 8 : -8],
                  opacity: [0, 0.16, 0],
                  scale: [0.7, 1.35],
                }
          }
          transition={{
            duration: 4.8 + smokeIndex * 0.7,
            repeat: Infinity,
            delay: smokeIndex * 1.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   HERO SLIDER
========================================================= */

export function HeroSlider() {
  const {
    index,
    setIndex,
    direction,
    activeProduct,
  } = useTheme();

const { add } = useCart();

  const product = activeProduct;

  const sectionRef =
    useRef<HTMLElement>(null);

  const dragStartX = useRef(0);
  
  const animationFrameRef = useRef(0);

  const [filling, setFilling] = useState(
    product.fillingOptions[0],
  );

  const [isDragging, setIsDragging] =
    useState(false);

  const [transitioning, setTransitioning] =
    useState(false);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const [finePointer, setFinePointer] =
    useState(false);

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });

  /* =======================================================
     MEDIA SETTINGS
  ======================================================= */

  useEffect(() => {
    const reducedQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );

    const pointerQuery =
      window.matchMedia(
        '(hover: hover) and (pointer: fine)',
      );

    const update = () => {
      setReducedMotion(reducedQuery.matches);
      setFinePointer(pointerQuery.matches);
    };

    update();

    reducedQuery.addEventListener(
      'change',
      update,
    );

    pointerQuery.addEventListener(
      'change',
      update,
    );

    return () => {
      reducedQuery.removeEventListener(
        'change',
        update,
      );

      pointerQuery.removeEventListener(
        'change',
        update,
      );
    };
  }, []);

  useEffect(() => {
    setFilling(
      product.fillingOptions[0],
    );
  }, [
    index,
    product.fillingOptions,
  ]);

  useEffect(() => {
    setTransitioning(true);

    const timer = window.setTimeout(() => {
      setTransitioning(false);
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [index]);

  /* =======================================================
     PRODUCT NAVIGATION
  ======================================================= */

  const goNext = useCallback(() => {
    if (transitioning) {
      return;
    }

    setIndex(
      (index + 1) % products.length,
    );
  }, [index, setIndex, transitioning]);

  const goPrevious = useCallback(() => {
    if (transitioning) {
      return;
    }

    setIndex(
      (index - 1 + products.length) %
        products.length,
    );
  }, [index, setIndex, transitioning]);

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'ArrowRight') {
        goNext();
      }

      if (event.key === 'ArrowLeft') {
        goPrevious();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyboard,
      );
    };
  }, [goNext, goPrevious]);



  /* =======================================================
     SWIPE + DESKTOP TILT
  ======================================================= */

  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    dragStartX.current = event.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (
      finePointer &&
      sectionRef.current
    ) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current,
        );
      }

      animationFrameRef.current =
        requestAnimationFrame(() => {
          const rectangle =
            sectionRef.current?.getBoundingClientRect();

          if (!rectangle) {
            return;
          }

          const pointerX =
            (event.clientX -
              rectangle.left) /
              rectangle.width -
            0.5;

          const pointerY =
            (event.clientY -
              rectangle.top) /
              rectangle.height -
            0.5;

          setTilt({
            x: pointerY * 8,
            y: pointerX * 12,
          });
        });
    }

    if (!isDragging || transitioning) {
      return;
    }

    const distance =
      event.clientX - dragStartX.current;

    if (Math.abs(distance) < 60) {
      return;
    }

    if (distance < 0) {
      goNext();
    } else {
      goPrevious();
    }

    setIsDragging(false);
  };

  const handlePointerEnd = () => {
    setIsDragging(false);

    if (finePointer) {
      setTilt({
        x: 0,
        y: 0,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current,
        );
      }
    };
  }, []);

  /* =======================================================
     ANIMATION VARIANTS
  ======================================================= */

  const desktopSlideVariants = {
    enter: (slideDirection: number) => ({
      x:
        slideDirection > 0
          ? 120
          : -120,
      y: 30,
      scale: 0.65,
      opacity: 0,
      rotateZ:
        slideDirection > 0
          ? 15
          : -15,
      filter: 'blur(8px)',
    }),

    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateZ: 0,
      filter: 'blur(0px)',
      transition: {
        duration: reducedMotion
          ? 0.01
          : 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },

    exit: (slideDirection: number) => ({
      x:
        slideDirection > 0
          ? -120
          : 120,
      y: -30,
      scale: 0.65,
      opacity: 0,
      rotateZ:
        slideDirection > 0
          ? -15
          : 15,
      filter: 'blur(8px)',
      transition: {
        duration: reducedMotion
          ? 0.01
          : 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    }),
  };

  const mobileSlideVariants = {
    enter: (slideDirection: number) => ({
      x:
        slideDirection > 0
          ? 70
          : -70,
      opacity: 0,
      scale: 0.88,
      rotate:
        slideDirection > 0
          ? 8
          : -8,
    }),

    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: reducedMotion
          ? 0.01
          : 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },

    exit: (slideDirection: number) => ({
      x:
        slideDirection > 0
          ? -70
          : 70,
      opacity: 0,
      scale: 0.88,
      rotate:
        slideDirection > 0
          ? -8
          : 8,
      transition: {
        duration: reducedMotion
          ? 0.01
          : 0.35,
      },
    }),
  };

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      filling,
    });
  };

  return (
    <section
      ref={sectionRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      className="relative w-full select-none overflow-hidden"
      style={{
        background: product.bgGradient,
        transition: 'background 0.9s ease',
        touchAction: 'pan-y',
      }}
    >
      <div className="grain" />

      <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block">
        <ParticleCanvas
          product={product}
          reduced={reducedMotion}
        />
      </div>
      {/* ===================================================
          MOBILE APP-STYLE HERO
      =================================================== */}

      <div
        className="relative z-10 min-h-[100dvh] lg:hidden"
        style={{
          paddingTop: 'var(--nav-h-mobile)',
        }}
      >
        {/* Decorative glow */}
        <motion.div
          className="pointer-events-none absolute right-[-130px] top-16 h-[330px] w-[330px] rounded-full blur-[105px]"
          style={{
            background:
              product.dominantColor,
            opacity: 0.38,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: [
                    1,
                    1.08,
                    1,
                  ],
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        <div className="relative px-5 pb-12 pt-5 sm:px-7">
          {/* Mobile top actions */}
          <div className="flex items-center justify-between">
            <div
              className="text-xs font-black uppercase tracking-[0.2em]"
              style={{
                color:
                  product.textColor,
              }}
            >
              MFZ Corndog
            </div>

            
          </div>

          {/* Hero presentation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-info-${index}`}
              variants={contentContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative mt-3 min-h-[520px]"
            >
              {/* Product index */}
              <motion.div
                variants={contentItem}
                className="flex items-baseline gap-2"
              >
                <span
                  className="text-2xl font-black"
                  style={{
                    color:
                      product.accentColor,
                    fontFamily:
                      'Anton, sans-serif',
                  }}
                >
                  {String(index + 1).padStart(
                    2,
                    '0',
                  )}
                </span>

                <span
                  className="text-sm font-bold"
                  style={{
                    color:
                      product.textColor,
                    opacity: 0.7,
                  }}
                >
                  /{' '}
                  {String(
                    products.length,
                  ).padStart(2, '0')}
                </span>
              </motion.div>

              {/* Product image + cinematic atmosphere */}
              <div className="absolute right-[-58px] top-[-34px] z-[8] flex h-[520px] w-[76%] items-center justify-center sm:right-[-18px] sm:w-[68%]">
                <MobileProductAtmosphere
                  accentColor={product.accentColor}
                  dominantColor={product.dominantColor}
                  reducedMotion={reducedMotion}
                />

                <AnimatePresence
                  mode="popLayout"
                  custom={direction}
                >
                  <motion.div
                    key={`mobile-product-${index}`}
                    custom={direction}
                    variants={mobileSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative z-10 h-full w-full"
                  >
                    <motion.div
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              y: [0, -10, 0],
                              rotate: [-1, 1, -1],
                            }
                      }
                      transition={{
                        duration: 5.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="relative h-full w-full"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          draggable={false}
                          decoding="async"
                          fetchPriority="high"
                          className="h-full w-full object-contain"
                          style={{
                            filter: `
                              drop-shadow(
                                0 24px 32px
                                ${product.dominantColor}58
                              )
                              drop-shadow(
                                0 0 22px
                                ${product.accentColor}42
                              )
                            `,
                            transform: `
                              rotate(${product.visual.rotation}deg)
                              scale(${product.visual.scale * 1.08})
                            `,
                          }}
                        />
                      ) : (
                        <CorndogSVG
                          product={product}
                          className="h-full w-full"
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Left text */}
              <div className="relative z-20 mt-5 w-[56%]">
                <motion.h1
                  variants={contentItem}
                  className="text-[clamp(48px,14vw,70px)] font-black uppercase leading-[0.82]"
                  style={{
                    color:
                      product.textColor,
                    fontFamily:
                      'Anton, sans-serif',
                  }}
                >
                  <MaskedTitle
                    text={product.shortName}
                  />
                </motion.h1>

                <motion.p
                  variants={contentItem}
                  className="mt-4 text-base font-bold leading-snug"
                  style={{
                    color:
                      product.textColor,
                    opacity: 0.93,
                  }}
                >
                  {product.tagline}
                </motion.p>

                <motion.p
                  variants={contentItem}
                  className="mt-3 max-w-[210px] text-sm leading-relaxed"
                  style={{
                    color:
                      product.textColor,
                    opacity: 0.68,
                  }}
                >
                  {product.description}
                </motion.p>

                <motion.div
                  variants={contentItem}
                  className="mt-5 flex items-center gap-2"
                >
                  <span
                    className="rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider"
                    style={{
                      color:
                        product.accentColor,
                      borderColor:
                        product.accentColor,
                    }}
                  >
                    Spice
                  </span>

                  <div className="flex gap-1">
                    {Array.from({
                      length: 3,
                    }).map(
                      (_, flameIndex) => (
                        <Flame
                          key={flameIndex}
                          size={20}
                          fill={
                            flameIndex <
                            product.spiceLevel
                              ? product.accentColor
                              : 'none'
                          }
                          color={
                            flameIndex <
                            product.spiceLevel
                              ? product.accentColor
                              : product.textColor
                          }
                          style={{
                            opacity:
                              flameIndex <
                              product.spiceLevel
                                ? 1
                                : 0.24,
                          }}
                        />
                      ),
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={contentItem}
                  className="mt-5 text-3xl font-black"
                  style={{
                    color:
                      product.textColor,
                    fontFamily:
                      'Anton, sans-serif',
                  }}
                >
                  {formatPKR(product.price)}
                </motion.div>
              </div>

              {/* Arrow navigation */}
              <button
                type="button"
                onClick={goPrevious}
                disabled={transitioning}
                className="absolute bottom-12 left-[40%] z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 disabled:opacity-40"
                style={{
                  borderColor: `${product.accentColor}90`,
                  color:
                    product.accentColor,
                  background:
                    'rgba(0,0,0,0.25)',
                }}
                aria-label="Previous flavour"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={transitioning}
                className="absolute bottom-12 right-0 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 disabled:opacity-40"
                style={{
                  borderColor: `${product.textColor}45`,
                  color:
                    product.accentColor,
                  background:
                    'rgba(0,0,0,0.25)',
                }}
                aria-label="Next flavour"
              >
                <ChevronRight size={22} />
              </button>

              {/* Slider indicators */}
              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {products.map(
                  (
                    sliderProduct,
                    sliderIndex,
                  ) => (
                    <button
                      key={sliderProduct.id}
                      type="button"
                      disabled={transitioning}
                      onClick={() =>
                        !transitioning &&
                        setIndex(
                          sliderIndex,
                        )
                      }
                      className="h-1 rounded-full transition-all"
                      style={{
                        width:
                          sliderIndex ===
                          index
                            ? 42
                            : 23,
                        background:
                          sliderIndex ===
                          index
                            ? product.accentColor
                            : 'rgba(255,255,255,0.22)',
                      }}
                      aria-label={`Go to ${sliderProduct.name}`}
                    />
                  ),
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Filling cards */}
          <section
            className="mt-8 rounded-[28px] border py-6"
            style={{
              background:
                'rgba(0,0,0,0.26)',
              borderColor: `${product.accentColor}20`,
            }}
          >
            <div className="flex items-center justify-between px-5">
              <h2
                className="text-xl font-black uppercase"
                style={{
                  color:
                    product.accentColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                Filling
              </h2>

              <span
                className="text-xs font-bold"
                style={{
                  color:
                    product.accentColor,
                }}
              >
                Swipe →
              </span>
            </div>

            <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto px-5 pb-2">
              {product.fillingOptions.map(
                (
                  fillingOption,
                  fillingIndex,
                ) => {
                  const selected =
                    filling ===
                    fillingOption;

                  return (
                    <button
                      key={fillingOption}
                      type="button"
                      onClick={() =>
                        setFilling(
                          fillingOption,
                        )
                      }
                      className="flex min-h-[170px] w-[135px] shrink-0 flex-col items-center justify-between rounded-3xl border p-4 text-center transition-transform active:scale-[0.97]"
                      style={{
                        background: selected
                          ? `${product.dominantColor}45`
                          : 'rgba(255,255,255,0.045)',
                        borderColor: selected
                          ? product.accentColor
                          : 'rgba(255,255,255,0.14)',
                      }}
                    >
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-2xl"
                        style={{
                          background: selected
                            ? `${product.accentColor}16`
                            : 'rgba(255,255,255,0.04)',
                        }}
                      >
                        <div
                          className="rounded-full"
                          style={{
                            width:
                              32 +
                              fillingIndex *
                                4,
                            height:
                              32 +
                              fillingIndex *
                                4,
                            background:
                              fillingIndex %
                                2 ===
                              0
                                ? product.secondaryColor
                                : product.dominantColor,
                            boxShadow: `0 10px 25px ${product.accentColor}20`,
                          }}
                        />
                      </div>

                      <span
                        className="text-sm font-bold"
                        style={{
                          color:
                            selected
                              ? product.accentColor
                              : product.textColor,
                        }}
                      >
                        {fillingOption}
                      </span>

                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                        style={{
                          borderColor: selected
                            ? product.accentColor
                            : `${product.textColor}55`,
                          background: selected
                            ? product.accentColor
                            : 'transparent',
                          color:
                            product.onAccent,
                        }}
                      >
                        {selected && (
                          <Plus
                            size={15}
                            className="rotate-45"
                          />
                        )}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </section>
        </div>


      </div>

      {/* ===================================================
          DESKTOP HERO — ORIGINAL DESIGN/SIZE
      =================================================== */}

      <div
  className="
    relative
    hidden
    min-h-[100svh]
    grid-rows-[minmax(0,1fr)_auto]
    lg:grid
  "
  style={{
    paddingTop: 'var(--nav-h)',
  }}
>
        {/* Desktop glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [
                    0.3,
                    0.45,
                    0.3,
                  ],
                }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        >
          <div
            className="absolute right-[15%] top-1/4 h-[500px] w-[500px] rounded-full blur-[140px]"
            style={{
              background:
                product.dominantColor,
              opacity: 0.35,
            }}
          />
        </motion.div>

        {/* Background word */}
        <div className="bg-word">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`desktop-bg-${index}`}
              initial={{
                opacity: 0,
                scale: 1.15,
              }}
              animate={{
                opacity: 0.08,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.7,
              }}
              className="bg-word-text"
              style={{
                color:
                  product.textColor,
              }}
            >
              {product.shortName.toUpperCase()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
  className="
    mfz-container
    relative
    z-10
    flex
    min-h-0
    items-center
    py-8
    xl:py-10
  "
>
          <div className="hero-grid w-full">
            {/* Desktop information */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desktop-info-${index}`}
                  variants={
                    contentContainer
                  }
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <motion.div
                    variants={contentItem}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="rounded-full px-3 py-1.5 text-xs font-bold tracking-[0.3em]"
                      style={{
                        background:
                          product.accentColor,
                        color:
                          product.onAccent,
                      }}
                    >
                      {String(
                        index + 1,
                      ).padStart(2, '0')}{' '}
                      /{' '}
                      {String(
                        products.length,
                      ).padStart(2, '0')}
                    </span>

                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{
                        color:
                          product.textColor,
                        opacity: 0.5,
                      }}
                    >
                      {product.category}
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={contentItem}
                    className="space-title text-hero-title font-black leading-[0.9]"
                    style={{
                      color:
                        product.textColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    <MaskedTitle
                      text={product.name}
                    />
                  </motion.h1>

                  <motion.p
                    variants={contentItem}
                    className="space-tagline text-hero-tagline font-bold"
                    style={{
                      color:
                        product.textColor,
                      opacity: 0.9,
                    }}
                  >
                    {product.tagline}
                  </motion.p>

                  <motion.p
                    variants={contentItem}
                    className="space-desc max-w-md text-hero-desc"
                    style={{
                      color:
                        product.textColor,
                      opacity: 0.85,
                    }}
                  >
                    {product.description}
                  </motion.p>

                  <motion.div
                    variants={contentItem}
                    className="space-options flex items-center gap-2"
                  >
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{
                        color:
                          product.textColor,
                        opacity: 0.5,
                      }}
                    >
                      Spice
                    </span>

                    <div className="flex gap-1">
                      {Array.from({
                        length: 3,
                      }).map(
                        (_, flameIndex) => (
                          <Flame
                            key={flameIndex}
                            size={16}
                            fill={
                              flameIndex <
                              product.spiceLevel
                                ? product.accentColor
                                : 'none'
                            }
                            color={
                              flameIndex <
                              product.spiceLevel
                                ? product.accentColor
                                : product.textColor
                            }
                            style={{
                              opacity:
                                flameIndex <
                                product.spiceLevel
                                  ? 1
                                  : 0.3,
                            }}
                          />
                        ),
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={contentItem}
                    className="space-options"
                  >
                    <div
                      className="mb-2 text-xs uppercase tracking-widest"
                      style={{
                        color:
                          product.textColor,
                        opacity: 0.5,
                      }}
                    >
                      Filling
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.fillingOptions.map(
                        (
                          fillingOption,
                        ) => (
                          <button
                            key={
                              fillingOption
                            }
                            type="button"
                            onClick={() =>
                              setFilling(
                                fillingOption,
                              )
                            }
                            className="rounded-full px-4 py-2 text-sm font-bold transition-all"
                            style={{
                              background:
                                filling ===
                                fillingOption
                                  ? product.accentColor
                                  : 'rgba(255,255,255,0.1)',
                              color:
                                filling ===
                                fillingOption
                                  ? product.onAccent
                                  : product.textColor,
                              border: `1px solid ${
                                filling ===
                                fillingOption
                                  ? product.accentColor
                                  : 'rgba(255,255,255,0.2)'
                              }`,
                            }}
                          >
                            {fillingOption}
                          </button>
                        ),
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={contentItem}
                    className="space-price text-3xl font-black md:text-4xl"
                    style={{
                      color:
                        product.textColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    {formatPKR(
                      product.price,
                    )}
                  </motion.div>

                  <motion.div
                    variants={contentItem}
                    className="space-actions flex flex-wrap gap-3"
                  >
                    <button
                      type="button"
                      onClick={
                        handleAddToCart
                      }
                      className="btn-primary rounded-full px-7 py-3.5 text-base font-black uppercase tracking-wide"
                      style={{
                        background:
                          product.accentColor,
                        color:
                          product.onAccent,
                      }}
                    >
                      {product.cta}
                    </button>

                    <Link
                      to="/menu"
                      className="inline-block rounded-full border-2 px-7 py-3.5 text-base font-bold uppercase tracking-wide transition-all hover:scale-105"
                      style={{
                        borderColor:
                          product.textColor,
                        color:
                          product.textColor,
                      }}
                    >
                      View Menu
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop product */}
            <div className="relative">
              <div
  className="
    product-stage
    -translate-y-8
    xl:-translate-y-12
  "
>
                <div className="circular-track" />

                <AnimatePresence
                  mode="popLayout"
                  custom={direction}
                >
                  <motion.div
                    key={`desktop-product-${index}`}
                    custom={direction}
                    variants={
                      desktopSlideVariants
                    }
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative z-10"
                    style={{
                      width:
                        'clamp(280px, 40vw, 560px)',
                      height:
                        'clamp(350px, 55vh, 700px)',
                      transformStyle:
                        'preserve-3d',
                    }}
                  >
                    <motion.div
                      animate={{
                        rotateY: tilt.y,
                        rotateX: tilt.x,
                        y: reducedMotion
                          ? 0
                          : [0, -12, 0],
                      }}
                      transition={{
                        rotateX: {
                          type: 'spring',
                          stiffness: 40,
                          damping: 12,
                        },
                        rotateY: {
                          type: 'spring',
                          stiffness: 40,
                          damping: 12,
                        },
                        y: {
                          duration: 4.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                      className="h-full w-full"
                      style={{
                        transformStyle:
                          'preserve-3d',
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                          style={{
                            filter: `
                              drop-shadow(
                                0 25px 35px
                                ${product.dominantColor}44
                              )
                              drop-shadow(
                                0 0 20px
                                ${product.accentColor}33
                              )
                            `,
                            transform: `
                              rotate(${product.visual.rotation}deg)
                              scale(${product.visual.scale})
                            `,
                          }}
                          draggable={false}
                        />
                      ) : (
                        <CorndogSVG
                          product={product}
                          className="h-full w-full"
                        />
                      )}
                    </motion.div>

                    {!reducedMotion &&
                      product.ingredients
                        .slice(0, 3)
                        .map(
                          (
                            ingredient,
                            ingredientIndex,
                          ) => {
                            const positions = [
                              {
                                top: '15%',
                                left: '5%',
                              },
                              {
                                top: '45%',
                                right: '5%',
                              },
                              {
                                bottom: '18%',
                                left: '8%',
                              },
                            ];

                            return (
                              <motion.div
                                key={
                                  ingredient
                                }
                                className="absolute z-20 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md"
                                style={{
                                  background:
                                    'rgba(255,255,255,0.12)',
                                  border: `1px solid ${product.accentColor}66`,
                                  color:
                                    product.textColor,
                                  ...positions[
                                    ingredientIndex
                                  ],
                                }}
                                animate={{
                                  y: [
                                    0,
                                    -12,
                                    0,
                                  ],
                                  opacity: [
                                    0.7,
                                    1,
                                    0.7,
                                  ],
                                }}
                                transition={{
                                  duration:
                                    3 +
                                    ingredientIndex,
                                  repeat:
                                    Infinity,
                                  delay:
                                    ingredientIndex *
                                    0.4,
                                }}
                              >
                                {ingredient}
                              </motion.div>
                            );
                          },
                        )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop controls */}
        <div
  className="
    relative
    z-30
    w-full
    pb-6
    pt-4
  "
>
  <div className="mfz-container">
            <div
              className="mb-4 h-1 w-full overflow-hidden rounded-full"
              style={{
                background:
                  'rgba(255,255,255,0.12)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    product.accentColor,
                }}
                animate={{
                  width: `${
                    ((index + 1) /
                      products.length) *
                    100
                  }%`,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              />
            </div>

            <div
  className="
    flex
    min-h-14
    items-center
    justify-between
    gap-6
  "
>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={transitioning}
                  className="rounded-full border-2 p-3 transition-all hover:scale-110 disabled:opacity-40"
                  style={{
                    borderColor:
                      product.textColor,
                    color:
                      product.textColor,
                  }}
                  aria-label="Previous flavour"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={transitioning}
                  className="rounded-full border-2 p-3 transition-all hover:scale-110 disabled:opacity-40"
                  style={{
                    borderColor:
                      product.textColor,
                    color:
                      product.textColor,
                  }}
                  aria-label="Next flavour"
                >
                  <ChevronRight size={18} />
                </button>

                <div
                  className="ml-2 flex items-center gap-2 text-sm"
                  style={{
                    color:
                      product.textColor,
                    opacity: 0.5,
                  }}
                >
                  <GripHorizontal size={16} />
                  Swipe the flavour
                </div>
              </div>

             <div className="flex min-w-0 items-center justify-end gap-1.5">
                {products.map(
                  (
                    sliderProduct,
                    sliderIndex,
                  ) => (
                    <button
                      key={
                        sliderProduct.id
                      }
                      type="button"
                      onClick={() =>
                        !transitioning &&
                        setIndex(
                          sliderIndex,
                        )
                      }
                      disabled={
                        transitioning
                      }
                      className="transition-all disabled:cursor-not-allowed"
                      style={{
                        width:
                          sliderIndex ===
                          index
                            ? 36
                            : 16,
                        height: 4,
                        background:
                          sliderIndex ===
                          index
                            ? sliderProduct.accentColor
                            : 'rgba(255,255,255,0.2)',
                        borderRadius: 2,
                      }}
                      aria-label={`Go to ${sliderProduct.name}`}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}