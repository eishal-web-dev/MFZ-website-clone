import {
  useMemo,
  useState,
} from 'react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Truck,
} from 'lucide-react';

import {
  branches,
  formatPhoneForDisplay,
  type Branch,
} from '@/data/branches';
import { useTheme } from '@/context/ThemeContext';
import { Footer } from '@/components/Footer';

function createWhatsAppLink(branch: Branch): string {
  const message = encodeURIComponent(
    `Assalamualaikum, I would like information about ordering from ${branch.name}.`,
  );

  return `https://wa.me/${branch.whatsapp}?text=${message}`;
}

function createDirectionsLink(branch: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    branch.mapQuery,
  )}`;
}

function createMapEmbedUrl(branch: Branch): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    branch.mapQuery,
  )}&output=embed`;
}

export default function LocationsPage() {
  const { activeProduct } = useTheme();

  const active = activeProduct;

  const [selectedBranchId, setSelectedBranchId] =
    useState<number>(branches[0]?.id ?? 1);

  const selectedBranch = useMemo(
    () =>
      branches.find(
        (branch) => branch.id === selectedBranchId,
      ) ?? branches[0],
    [selectedBranchId],
  );

  if (!selectedBranch) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: active.bgColor,
        paddingTop: 'var(--nav-h)',
      }}
    >
      <main className="pb-20">
        <div className="mfz-container">
          {/* Page heading */}
          <header className="mb-10 pt-8 md:mb-12 md:pt-12">
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{
                color: active.accentColor,
              }}
            >
              Find Us in Peshawar
            </span>

            <h1
              className="mt-2 text-6xl font-black md:text-8xl"
              style={{
                color: active.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              Locations
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base"
              style={{
                color: active.textColor,
                opacity: 0.65,
              }}
            >
              Select a branch to view its map, call directly,
              open directions or contact MFZ through WhatsApp.
            </p>
          </header>

          {/* Branch selector */}
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
            {branches.map((branch) => {
              const isSelected =
                branch.id === selectedBranch.id;

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() =>
                    setSelectedBranchId(branch.id)
                  }
                  className="
                    shrink-0
                    rounded-full
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    transition-all
                    hover:scale-[1.03]
                  "
                  style={{
                    background: isSelected
                      ? active.accentColor
                      : 'rgba(255,255,255,0.07)',
                    color: isSelected
                      ? active.onAccent
                      : active.textColor,
                    borderColor: isSelected
                      ? active.accentColor
                      : `${active.textColor}22`,
                  }}
                >
                  {branch.name}
                </button>
              );
            })}
          </div>

          {/* Real Google map */}
          <section
            className="
              relative
              mb-10
              overflow-hidden
              rounded-3xl
              border
            "
            style={{
              borderColor: `${active.accentColor}44`,
              background: active.bgGradient,
            }}
          >
            <div className="relative h-[360px] sm:h-[440px] lg:h-[520px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBranch.id}
                  initial={{
                    opacity: 0,
                    scale: 0.985,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.985,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="absolute inset-0"
                >
                  <iframe
                    title={`${selectedBranch.name} Google Map`}
                    src={createMapEmbedUrl(selectedBranch)}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </motion.div>
              </AnimatePresence>

              {/* Map information overlay */}
              <div
                className="
                  absolute
                  bottom-4
                  left-4
                  right-4
                  rounded-2xl
                  border
                  p-4
                  backdrop-blur-xl
                  sm:left-5
                  sm:right-auto
                  sm:max-w-sm
                  sm:p-5
                "
                style={{
                  background: 'rgba(10,10,10,0.82)',
                  borderColor: `${active.accentColor}55`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      background: active.accentColor,
                      color: active.onAccent,
                    }}
                  >
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="text-xl font-black"
                      style={{
                        color: '#ffffff',
                        fontFamily: 'Anton, sans-serif',
                      }}
                    >
                      {selectedBranch.name}
                    </h2>

                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{
                        color: '#ffffff',
                        opacity: 0.72,
                      }}
                    >
                      {selectedBranch.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Branch cards */}
          <section className="grid gap-5 sm:grid-cols-2 md:gap-6">
            {branches.map((branch, index) => {
              const isSelected =
                branch.id === selectedBranch.id;

              return (
                <motion.article
                  key={branch.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.45,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  onClick={() =>
                    setSelectedBranchId(branch.id)
                  }
                  className="
                    group
                    cursor-pointer
                    overflow-hidden
                    rounded-3xl
                    border
                    p-5
                    transition-all
                    md:p-6
                  "
                  style={{
                    background: isSelected
                      ? `${active.accentColor}12`
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isSelected
                      ? active.accentColor
                      : `${active.accentColor}25`,
                    boxShadow: isSelected
                      ? `0 18px 50px ${active.accentColor}18`
                      : 'none',
                  }}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        className="text-2xl font-black leading-tight"
                        style={{
                          color: active.textColor,
                          fontFamily: 'Anton, sans-serif',
                        }}
                      >
                        {branch.name}
                      </h3>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color: active.textColor,
                          opacity: 0.62,
                        }}
                      >
                        {branch.area}
                      </p>
                    </div>

                    <span
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-1.5
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
                        opacity: branch.delivery
                          ? 1
                          : 0.6,
                      }}
                    >
                      {branch.delivery && (
                        <Truck size={12} />
                      )}

                      {branch.delivery
                        ? 'Delivery'
                        : 'Office'}
                    </span>
                  </div>

                  {/* Branch information */}
                  <div className="mb-6 space-y-3">
                    <div
                      className="flex items-start gap-3 text-sm"
                      style={{
                        color: active.textColor,
                      }}
                    >
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0"
                        style={{
                          color: active.accentColor,
                        }}
                      />

                      <span
                        style={{
                          opacity: 0.74,
                        }}
                      >
                        {branch.address}
                      </span>
                    </div>

                    <div
                      className="flex items-start gap-3 text-sm"
                      style={{
                        color: active.textColor,
                      }}
                    >
                      <Clock
                        size={17}
                        className="mt-0.5 shrink-0"
                        style={{
                          color: active.accentColor,
                        }}
                      />

                      <span
                        style={{
                          opacity: 0.74,
                        }}
                      >
                        {branch.hours}
                      </span>
                    </div>

                    <a
                      href={`tel:${branch.phone}`}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        transition-opacity
                        hover:opacity-100
                      "
                      style={{
                        color: active.textColor,
                        opacity: 0.74,
                      }}
                    >
                      <Phone
                        size={17}
                        className="shrink-0"
                        style={{
                          color: active.accentColor,
                        }}
                      />

                      {formatPhoneForDisplay(
                        branch.phone,
                      )}
                    </a>

                    <a
                      href={createWhatsAppLink(branch)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        transition-opacity
                        hover:opacity-100
                      "
                      style={{
                        color: active.textColor,
                        opacity: 0.74,
                      }}
                    >
                      <MessageCircle
                        size={17}
                        className="shrink-0"
                        style={{
                          color: '#25D366',
                        }}
                      />

                      WhatsApp: +92 305 1880355
                    </a>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <a
                      href={createDirectionsLink(branch)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        flex
                        min-h-11
                        items-center
                        justify-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-2.5
                        text-sm
                        font-bold
                        transition-transform
                        hover:scale-[1.03]
                      "
                      style={{
                        background: active.accentColor,
                        color: active.onAccent,
                      }}
                    >
                      <Navigation size={15} />
                      Directions
                    </a>

                    <a
                      href={`tel:${branch.phone}`}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        flex
                        min-h-11
                        items-center
                        justify-center
                        gap-1.5
                        rounded-full
                        border
                        px-3
                        py-2.5
                        text-sm
                        font-bold
                        transition-transform
                        hover:scale-[1.03]
                      "
                      style={{
                        borderColor: `${active.textColor}35`,
                        color: active.textColor,
                        background:
                          'rgba(255,255,255,0.06)',
                      }}
                    >
                      <Phone size={15} />
                      Call
                    </a>

                    <a
                      href={createWhatsAppLink(branch)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        flex
                        min-h-11
                        items-center
                        justify-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-2.5
                        text-sm
                        font-bold
                        transition-transform
                        hover:scale-[1.03]
                      "
                      style={{
                        background: '#25D366',
                        color: '#ffffff',
                      }}
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedBranchId(branch.id);

                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-bold
                      uppercase
                      transition-transform
                      group-hover:translate-x-1
                    "
                    style={{
                      color: active.accentColor,
                    }}
                  >
                    Show on map
                    <ArrowRight size={15} />
                  </button>
                </motion.article>
              );
            })}
          </section>

          <p
            className="mt-8 text-center text-xs leading-relaxed"
            style={{
              color: active.textColor,
              opacity: 0.5,
            }}
          >
            Branch opening hours and precise map pins
            should be reconfirmed with MFZ before the final
            public launch.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}