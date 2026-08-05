import { useMemo, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Plus,
  Star,
} from 'lucide-react';

import { products } from '@/data/products';
import {
  formatPKR,
  menuItems,
} from '@/data/menu';
import { branches } from '@/data/branches';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { CorndogSVG } from '@/components/CorndogSVG';

/* =========================================================
   SECTION 1: THE CRUNCH LINEUP
========================================================= */

export function CrunchLineup() {
  const { activeProduct, setIndex } = useTheme();
  const { add } = useCart();

  const active = activeProduct;

  return (
    <section
      className="relative overflow-hidden mfz-section"
      style={{ background: active.bgColor }}
    >
      <div className="mfz-container">
        <div className="mb-12 md:mb-16">
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: active.accentColor }}
          >
            The Lineup
          </span>

          <h2
            className="mt-3 text-section-title font-black"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            The Crunch Lineup
          </h2>

          <p
            className="mt-3 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{
              color: active.textColor,
              opacity: 0.7,
            }}
          >
            Eight corndogs. Eight personalities. Each one a collectible
            character in the MFZ universe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: '-50px',
              }}
              transition={{
                delay: index * 0.06,
                type: 'spring',
                stiffness: 60,
                damping: 15,
              }}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setIndex(index)}
              className="
                group
                relative
                flex
                min-h-[410px]
                cursor-pointer
                flex-col
                overflow-hidden
                rounded-3xl
                p-5
                sm:min-h-[430px]
                md:p-6
              "
              style={{
                background: product.bgGradient,
                border: `1px solid ${product.accentColor}33`,
              }}
            >
              <div
                className="
                  absolute
                  right-4
                  top-4
                  text-xs
                  font-black
                  opacity-40
                "
                style={{
                  color: product.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                {String(product.id).padStart(2, '0')}
              </div>

              <div
                className="
                  mb-5
                  flex
                  h-[240px]
                  flex-shrink-0
                  items-center
                  justify-center
                  sm:h-[250px]
                  md:h-[260px]
                "
              >
                <motion.div
                  animate={{
                    rotate: [-3, 3, -3],
                    y: [0, -8, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    },
                    y: {
                      duration: 3.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.15,
                    },
                  }}
                  className="
                    h-[210px]
                    w-[110px]
                    sm:h-[220px]
                    sm:w-[120px]
                    md:h-[230px]
                    md:w-[125px]
                  "
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                      draggable={false}
                      loading="lazy"
                    />
                  ) : (
                    <CorndogSVG
                      product={product}
                      className="h-full w-full"
                      showStick={false}
                      tilt={0}
                    />
                  )}
                </motion.div>
              </div>

              <div className="mt-auto">
                <h3
                  className="mb-1 text-product-card-title font-black"
                  style={{
                    color: product.textColor,
                    fontFamily: 'Anton, sans-serif',
                  }}
                >
                  {product.shortName}
                </h3>

                <p
                  className="mb-4 min-h-[32px] text-xs leading-relaxed"
                  style={{
                    color: product.textColor,
                    opacity: 0.7,
                  }}
                >
                  {product.tagline}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <span
                    className="text-lg font-black"
                    style={{ color: product.accentColor }}
                  >
                    {formatPKR(product.price)}
                  </span>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      add({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                      });
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      transition-transform
                      duration-200
                      hover:scale-110
                      focus-visible:scale-110
                    "
                    style={{
                      background: product.accentColor,
                      color: product.onAccent,
                    }}
                    aria-label={`Add ${product.name}`}
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 2: INSIDE THE CRUNCH
========================================================= */

interface ExplodedLayerData {
  label: string;
  sub: string;
  color: string;
  y: number;
  z: number;
}

interface ExplodedLayerProps {
  layer: ExplodedLayerData;
  index: number;
  separation: MotionValue<number>;
  rotation: MotionValue<number>;
}

function ExplodedLayer({
  layer,
  index,
  separation,
  rotation,
}: ExplodedLayerProps) {
  const animatedY = useTransform(
    separation,
    [0, 1],
    [0, layer.y],
  );

  const labelIsLeft = index % 2 === 0;

  return (
    <motion.div
      className="
  absolute
  left-1/2
  top-1/2
  grid
  w-[min(100%,0px)]
  -translate-x-1/2
  -translate-y-1/2
  grid-cols-[180px_auto_180px]
  items-center
  justify-center
  gap-5
"
      style={{
        y: animatedY,
        zIndex: layer.z,
      }}
    >
      {/* Left-side label */}
      <div className="hidden min-w-0 justify-end md:flex">
        {labelIsLeft ? (
          <motion.div
            initial={{
              opacity: 0,
              x: -24,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.25 + index * 0.08,
              duration: 0.45,
            }}
            className="
              relative
              max-w-[180px]
              pr-8
              text-right
              lg:max-w-[220px]
            "
          >
            <p
              className="
                text-sm
                font-black
                uppercase
                leading-tight
                tracking-wide
              "
              style={{
                color: 'var(--theme-text)',
              }}
            >
              {layer.label}
            </p>

            <p
              className="mt-1 text-xs leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.6,
              }}
            >
              {layer.sub}
            </p>

            <span
              className="
                absolute
                right-0
                top-1/2
                h-px
                w-6
                -translate-y-1/2
              "
              style={{
                background: layer.color,
                opacity: 0.75,
              }}
            />

            <span
              className="
                absolute
                right-0
                top-1/2
                h-2
                w-2
                -translate-y-1/2
                translate-x-1/2
                rounded-full
              "
              style={{
                background: layer.color,
                boxShadow: `0 0 12px ${layer.color}`,
              }}
            />
          </motion.div>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>

      {/* Exploded food layer */}
      <motion.div
        className="relative flex shrink-0 items-center justify-center"
        style={{ rotate: rotation }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 'clamp(115px, 16vw, 175px)',
            height: 'clamp(46px, 7vw, 76px)',
            background: layer.color,
            boxShadow: `
              0 12px 34px ${layer.color}44,
              inset 0 -9px 22px rgba(0, 0, 0, 0.28),
              inset 0 8px 16px rgba(255, 255, 255, 0.17)
            `,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
          }}
        >
          <div
            className="
              h-[34%]
              w-[62%]
              rounded-full
              opacity-20
              blur-[2px]
            "
            style={{
              background: 'rgba(255,255,255,0.65)',
            }}
          />
        </div>
      </motion.div>

      {/* Right-side label */}
      <div className="hidden min-w-0 md:block">
        {!labelIsLeft ? (
          <motion.div
            initial={{
              opacity: 0,
              x: 24,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.25 + index * 0.08,
              duration: 0.45,
            }}
            className="
              relative
              max-w-[180px]
              pl-8
              text-left
              lg:max-w-[220px]
            "
          >
            <span
              className="
                absolute
                left-0
                top-1/2
                h-px
                w-6
                -translate-y-1/2
              "
              style={{
                background: layer.color,
                opacity: 0.75,
              }}
            />

            <span
              className="
                absolute
                left-0
                top-1/2
                h-2
                w-2
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
              "
              style={{
                background: layer.color,
                boxShadow: `0 0 12px ${layer.color}`,
              }}
            />

            <p
              className="
                text-sm
                font-black
                uppercase
                leading-tight
                tracking-wide
              "
              style={{
                color: 'var(--theme-text)',
              }}
            >
              {layer.label}
            </p>

            <p
              className="mt-1 text-xs leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.6,
              }}
            >
              {layer.sub}
            </p>
          </motion.div>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    </motion.div>
  );
}

export function InsideTheCrunch() {
  const { activeProduct } = useTheme();

  const active = activeProduct;
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const separation = useTransform(
    scrollYProgress,
    [0.15, 0.42, 0.65, 0.88],
    [0, 1, 1, 0],
  );

  const rotation = useTransform(
    scrollYProgress,
    [0, 1],
    [-7, 7],
  );

  const layers = useMemo<ExplodedLayerData[]>(
    () => [
      {
        label: 'Saucy Finish',
        sub: 'Drizzled to perfection',
        color: active.accentColor,
        y: -250,
        z: 6,
      },
      {
        label: 'Crispy Coating',
        sub: 'Golden crunch layer',
        color: active.dominantColor,
        y: -150,
        z: 5,
      },
      {
        label: 'Golden Batter',
        sub: 'Signature cornmeal shell',
        color: active.secondaryColor,
        y: -50,
        z: 4,
      },
      {
        label: 'Melted Centre',
        sub: 'Stretchy mozzarella',
        color: '#ffdd55',
        y: 50,
        z: 3,
      },
      {
        label: 'Signature Filling',
        sub: 'Premium sausage',
        color: '#c25a3a',
        y: 150,
        z: 2,
      },
      {
        label: 'The Stick',
        sub: 'Built to hold the crunch',
        color: '#8b6f47',
        y: 250,
        z: 1,
      },
    ],
    [
      active.accentColor,
      active.dominantColor,
      active.secondaryColor,
    ],
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden mfz-section"
      style={{
        background: active.bgGradient,
      }}
    >
      <div className="grain" />

      <div className="mfz-container relative z-10">
        <div className="mb-12 text-center md:mb-16">
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{
              color: active.accentColor,
            }}
          >
            Anatomy
          </span>

          <h2
            className="mt-3 text-section-title font-black"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            Inside the Crunch
          </h2>

          <p
            className="mt-3 text-base sm:text-lg"
            style={{
              color: active.textColor,
              opacity: 0.7,
            }}
          >
            Every layer hits different.
          </p>
        </div>

        {/* Desktop exploded diagram */}
        <div
          className="
            relative
            mx-auto
            hidden
            min-h-[760px]
            w-full
            max-w-[900px]
            items-center
            justify-center
            md:flex
            lg:min-h-[840px]
          "
        >
          {layers.map((layer, index) => (
            <ExplodedLayer
              key={layer.label}
              layer={layer}
              index={index}
              separation={separation}
              rotation={rotation}
            />
          ))}
        </div>

        {/* Mobile organized diagram */}
        <div className="mx-auto grid max-w-md gap-4 md:hidden">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.label}
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.07,
                duration: 0.4,
              }}
              className="
                grid
                grid-cols-[72px_1fr]
                items-center
                gap-4
                rounded-2xl
                p-4
              "
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${layer.color}33`,
              }}
            >
              <div className="flex items-center justify-center">
                <div
                  className="h-12 w-[68px] rounded-[50%]"
                  style={{
                    background: layer.color,
                    boxShadow: `
                      0 8px 24px ${layer.color}44,
                      inset 0 -6px 14px rgba(0,0,0,0.24),
                      inset 0 6px 12px rgba(255,255,255,0.14)
                    `,
                  }}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-black
                    uppercase
                    leading-tight
                    tracking-wide
                  "
                  style={{
                    color: active.textColor,
                  }}
                >
                  {layer.label}
                </p>

                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color: active.textColor,
                    opacity: 0.6,
                  }}
                >
                  {layer.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 3: BUILD YOUR MFZ
========================================================= */

export function BuildPreview() {
  const { activeProduct } = useTheme();

  const active = activeProduct;

  return (
    <section
      className="relative overflow-hidden mfz-section"
      style={{
        background: active.bgGradient,
      }}
    >
      <div
        className="
          mfz-container
          grid
          items-center
          gap-10
          md:grid-cols-2
          md:gap-12
        "
      >
        <div>
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{
              color: active.accentColor,
            }}
          >
            Make It Yours
          </span>

          <h2
            className="mb-4 mt-3 text-section-title font-black"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            Build Your MFZ
          </h2>

          <p
            className="mb-7 max-w-md text-base leading-relaxed sm:text-lg"
            style={{
              color: active.textColor,
              opacity: 0.8,
            }}
          >
            Pick your coating, filling, sauces and extras. Watch your creation
            come to life in real time.
          </p>

          <Link
            to="/build"
            className="
              btn-primary
              inline-flex
              items-center
              gap-2
              rounded-full
              px-8
              py-4
              font-black
              uppercase
              tracking-wide
            "
            style={{
              background: active.accentColor,
              color: active.onAccent,
            }}
          >
            Start Building
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="flex min-h-[390px] items-center justify-center">
          <motion.div
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              h-[340px]
              w-[170px]
              sm:h-[380px]
              sm:w-[190px]
              md:h-[420px]
              md:w-[210px]
            "
          >
            {active.image ? (
              <img
                src={active.image}
                alt={active.name}
                className="h-full w-full object-contain"
                draggable={false}
                loading="lazy"
              />
            ) : (
              <CorndogSVG
                product={active}
                className="h-full w-full"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 4: BESTSELLERS
========================================================= */

export function Bestsellers() {
  const { activeProduct } = useTheme();
  const { add } = useCart();

  const active = activeProduct;

  const bestsellers = menuItems
    .filter((menuItem) => menuItem.popular)
    .slice(0, 4);

  return (
    <section
      className="relative mfz-section"
      style={{
        background: active.bgColor,
      }}
    >
      <div className="mfz-container">
        <div
          className="
            mb-10
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
            md:mb-12
          "
        >
          <div>
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{
                color: active.accentColor,
              }}
            >
              Fan Favourites
            </span>

            <h2
              className="mt-3 text-section-title font-black"
              style={{
                color: active.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              MFZ Favourites
            </h2>
          </div>

          <Link
            to="/menu"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-bold
              uppercase
              transition-transform
              hover:translate-x-1
            "
            style={{
              color: active.accentColor,
            }}
          >
            Full Menu
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {bestsellers.map((menuItem, index) => (
            <motion.article
              key={menuItem.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="
                group
                flex
                min-h-[280px]
                flex-col
                rounded-3xl
                p-5
                md:p-6
              "
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${active.accentColor}22`,
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Star
                  size={14}
                  fill={active.accentColor}
                  color={active.accentColor}
                />

                <span
                  className="text-xs font-bold uppercase"
                  style={{
                    color: active.accentColor,
                  }}
                >
                  Bestseller
                </span>
              </div>

              <h3
                className="mb-2 text-product-card-title font-black"
                style={{
                  color: active.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                {menuItem.name}
              </h3>

              <p
                className="mb-5 text-sm leading-relaxed"
                style={{
                  color: active.textColor,
                  opacity: 0.6,
                }}
              >
                {menuItem.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <span
                  className="text-2xl font-black"
                  style={{
                    color: active.accentColor,
                  }}
                >
                  {formatPKR(menuItem.price)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    add({
                      id: menuItem.id,
                      name: menuItem.name,
                      price: menuItem.price,
                    })
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    transition-transform
                    duration-200
                    hover:scale-110
                    group-hover:rotate-90
                  "
                  style={{
                    background: active.accentColor,
                    color: active.onAccent,
                  }}
                  aria-label={`Add ${menuItem.name}`}
                >
                  <Plus size={18} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 5: LOCATIONS PREVIEW
========================================================= */

export function LocationsPreview() {
  const { activeProduct } = useTheme();

  const active = activeProduct;

  return (
    <section
      className="relative mfz-section"
      style={{
        background: active.bgGradient,
      }}
    >
      <div className="mfz-container">
        <div className="mb-10 md:mb-12">
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{
              color: active.accentColor,
            }}
          >
            Find Us
          </span>

          <h2
            className="mt-3 text-section-title font-black"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            Our Locations
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((branch, index) => (
            <motion.article
              key={branch.id}
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="rounded-3xl p-5 md:p-6"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${active.accentColor}33`,
              }}
            >
              <MapPin
                size={24}
                style={{
                  color: active.accentColor,
                }}
              />

              <h3
                className="mb-1 mt-3 text-product-card-title font-black"
                style={{
                  color: active.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                {branch.name}
              </h3>

              <p
                className="mb-4 text-sm"
                style={{
                  color: active.textColor,
                  opacity: 0.6,
                }}
              >
                {branch.area}
              </p>

              <span
                className="
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-bold
                "
                style={{
                  background: branch.delivery
                    ? active.accentColor
                    : 'rgba(255,255,255,0.1)',
                  color: branch.delivery
                    ? active.onAccent
                    : active.textColor,
                  opacity: branch.delivery ? 1 : 0.55,
                }}
              >
                {branch.delivery
                  ? 'Delivery Available'
                  : 'Pickup Only'}
              </span>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/locations"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              uppercase
              transition-transform
              hover:translate-x-1
            "
            style={{
              color: active.accentColor,
            }}
          >
            View Map
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 6: SOCIAL GALLERY
========================================================= */

export function SocialGallery() {
  const { activeProduct } = useTheme();

  const active = activeProduct;

  return (
    <section
      className="relative mfz-section"
      style={{
        background: active.bgColor,
      }}
    >
      <div className="mfz-container">
        <div className="mb-10 text-center md:mb-12">
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{
              color: active.accentColor,
            }}
          >
            The Crunch Community
          </span>

          <h2
            className="mt-3 text-section-title font-black"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            Social Gallery
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {Array.from({ length: 8 }).map((_, index) => {
            const product = products[index % products.length];

            return (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                }}
                whileHover={{
                  scale: 1.04,
                }}
                className="
                  flex
                  aspect-square
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                "
                style={{
                  background: product.bgGradient,
                }}
              >
                <motion.div
                  animate={{
                    rotate: [-5, 5, -5],
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                  className="
                    h-40
                    w-25
                    sm:h-45
                    sm:w-[80px]
                    md:h-50
                    md:w-30
                  "
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                      draggable={false}
                      loading="lazy"
                    />
                  ) : (
                    <CorndogSVG
                      product={product}
                      className="h-full w-full"
                      showStick={false}
                      tilt={0}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <p
          className="mt-6 text-center text-sm leading-relaxed"
          style={{
            color: active.textColor,
            opacity: 0.5,
          }}
        >
          Tag @mfz.pk on Instagram to be featured. Content shown as a
          placeholder pending approval.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 7: CRUNCH CLUB
========================================================= */

export function CrunchClub() {
  const { activeProduct } = useTheme();

  const active = activeProduct;

  const perks = [
    'Earn Crunch Points',
    'Save Favourites',
    'Previous Orders',
    'Unlock Offers',
    'Birthday Rewards',
  ];

  return (
    <section
      className="relative overflow-hidden mfz-section"
      style={{
        background: active.bgGradient,
      }}
    >
      <div className="mfz-container max-w-3xl text-center">
        <span
          className="text-xs font-bold uppercase tracking-[0.3em]"
          style={{
            color: active.accentColor,
          }}
        >
          Proposed Feature
        </span>

        <h2
          className="mb-4 mt-3 text-section-title font-black"
          style={{
            color: active.textColor,
            fontFamily: 'Anton, sans-serif',
          }}
        >
          Crunch Club
        </h2>

        <p
          className="
            mx-auto
            mb-8
            max-w-2xl
            text-base
            leading-relaxed
            sm:text-lg
            md:text-xl
          "
          style={{
            color: active.textColor,
            opacity: 0.8,
          }}
        >
          Join the club. Earn points on every crunch. Unlock rewards, save
          your favourites and get a birthday treat.
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {perks.map((perk) => (
            <span
              key={perk}
              className="
                rounded-full
                px-5
                py-2
                text-sm
                font-bold
              "
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: active.textColor,
                border: `1px solid ${active.accentColor}44`,
              }}
            >
              {perk}
            </span>
          ))}
        </div>

        <Link
          to="/signin"
          className="
            btn-primary
            inline-flex
            items-center
            gap-2
            rounded-full
            px-10
            py-4
            text-base
            font-black
            uppercase
            sm:text-lg
          "
          style={{
            background: active.accentColor,
            color: active.onAccent,
          }}
        >
          Join the Club
        </Link>

        <p
          className="mt-4 text-xs"
          style={{
            color: active.textColor,
            opacity: 0.4,
          }}
        >
          Proposed loyalty feature — benefits pending MFZ approval.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 8: FINAL CTA
========================================================= */

export function FinalCTA() {
  const { activeProduct } = useTheme();

  const active = activeProduct;

  return (
    <section
      className="
        relative
        flex
        min-h-[720px]
        flex-col
        items-center
        justify-center
        overflow-hidden
        text-center
        mfz-section
      "
      style={{
        background: active.bgGradient,
      }}
    >
      <div className="grain" />

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          relative
          z-10
          mb-8
          h-64
          w-32
          sm:h-72
          sm:w-36
          md:h-80
          md:w-40
        "
      >
        {active.image ? (
          <img
            src={active.image}
            alt={active.name}
            className="h-full w-full object-contain"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <CorndogSVG
            product={active}
            className="h-full w-full"
          />
        )}
      </motion.div>

      <h2
        className="relative z-10 mb-6 text-section-title font-black"
        style={{
          color: active.textColor,
          fontFamily: 'Anton, sans-serif',
        }}
      >
        Ready to Crunch?
      </h2>

      <p
        className="
          relative
          z-10
          mb-8
          max-w-xl
          px-5
          text-lg
          leading-relaxed
          sm:text-xl
        "
        style={{
          color: active.textColor,
          opacity: 0.7,
        }}
      >
        Your next favourite corndog is one click away.
      </p>

      <Link
        to="/menu"
        className="
          btn-primary
          relative
          z-10
          rounded-full
          px-10
          py-4
          text-lg
          font-black
          uppercase
          sm:px-12
          sm:py-5
          sm:text-xl
        "
        style={{
          background: active.accentColor,
          color: active.onAccent,
        }}
      >
        Order Now
      </Link>
    </section>
  );
}