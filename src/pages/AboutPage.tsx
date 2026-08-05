import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { Footer } from '@/components/Footer';
import potatoImage from '@/assets/products/potatoeCD.png';

const timeline = [
  {
    year: 'Pending',
    title: 'The First Crunch',
    desc:
      'MFZ opens its doors in Peshawar with a bold idea: bring Korean-style corndogs to the city. [Founding date pending confirmation.]',
  },
  {
    year: 'Pending',
    title: 'First Branch',
    desc:
      'The first MFZ location opens, introducing Peshawar to the cheese pull. [First branch details pending confirmation.]',
  },
  {
    year: 'Pending',
    title: 'Growing the Crunch',
    desc:
      'MFZ expands across Peshawar with new branches and a growing community of crunch lovers. [Growth story pending confirmation.]',
  },
  {
    year: 'Today',
    title: 'The MFZ Mission',
    desc:
      "MFZ brings Korean-style corndogs to Peshawar with bold coatings, dramatic cheese pulls and flavours made for the city's next generation of food lovers.",
  },
];

export default function AboutPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background: a.bgColor,
        paddingTop: 'var(--nav-h)',
      }}
    >
      <main className="pb-20">
        <div
          className="mfz-container"
          style={{
            maxWidth: '1100px',
          }}
        >
          {/* =====================================================
              HERO
          ===================================================== */}

          <section
  className="
    relative
    -mt-[100px]
    grid
    min-h-[620px]
    items-center
    gap-10
    py-12
    md:grid-cols-2
    md:gap-12
    md:py-16
    lg:min-h-[700px]
  "
>
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{
                  color: a.accentColor,
                }}
              >
                Our Story
              </span>

              <h1
                className="
                  mb-5
                  mt-3
                  text-[clamp(56px,8vw,110px)]
                  font-black
                  leading-[0.9]
                "
                style={{
                  color: a.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                About MFZ
              </h1>

              <p
                className="
                  max-w-xl
                  text-base
                  leading-relaxed
                  sm:text-lg
                  md:text-xl
                "
                style={{
                  color: a.textColor,
                  opacity: 0.8,
                }}
              >
                MFZ brings Korean-style corndogs to Peshawar with bold
                coatings, dramatic cheese pulls and flavours made for the
                city's next generation of food lovers.
              </p>
            </motion.div>

            {/* Real potato corndog image */}
            <motion.div
              initial={{
                opacity: 0,
                x: 30,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                flex
                min-h-[420px]
                items-center
                justify-center
                sm:min-h-[480px]
                md:min-h-[560px]
              "
            >
              {/* Background glow */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.25, 0.42, 0.25],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="
                  absolute
                  h-[280px]
                  w-[280px]
                  rounded-full
                  blur-[90px]
                  sm:h-[340px]
                  sm:w-[340px]
                "
                style={{
                  background: a.accentColor,
                }}
              />

              {/* Floating product */}
              <motion.div
                animate={{
                  rotate: [-5, 5, -5],
                  y: [0, -16, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="
                  relative
                  z-10
                  h-[390px]
                  w-[190px]
                  sm:h-[450px]
                  sm:w-[220px]
                  md:h-[510px]
                  md:w-[250px]
                "
              >
                <img
                  src={potatoImage}
                  alt="MFZ Potato Corn Dog"
                  className="
                    h-full
                    w-full
                    select-none
                    object-contain
                    drop-shadow-[0_28px_45px_rgba(0,0,0,0.45)]
                  "
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </section>

          {/* =====================================================
              MISSION
          ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-80px',
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              mb-20
              rounded-3xl
              p-7
              text-center
              sm:p-10
              md:p-12
            "
            style={{
              background: a.bgGradient,
              border: `1px solid ${a.accentColor}33`,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mx-auto mb-5 flex w-fit"
            >
              <Sparkles
                size={34}
                style={{
                  color: a.accentColor,
                }}
              />
            </motion.div>

            <h2
              className="
                mb-5
                text-4xl
                font-black
                sm:text-5xl
                md:text-6xl
              "
              style={{
                color: a.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              Our Mission
            </h2>

            <p
              className="
                mx-auto
                max-w-2xl
                text-base
                leading-relaxed
                sm:text-lg
                md:text-xl
              "
              style={{
                color: a.textColor,
                opacity: 0.8,
              }}
            >
              To make corndogs that stop people mid-scroll. Bold flavours,
              dramatic cheese pulls and a crunch you can hear. This is not
              your average corndog.
            </p>
          </motion.section>

          {/* =====================================================
              TIMELINE
          ===================================================== */}

          <section className="mb-20">
            <div className="mb-10">
              <span
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{
                  color: a.accentColor,
                }}
              >
                Brand Journey
              </span>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-black
                  sm:text-5xl
                  md:text-6xl
                "
                style={{
                  color: a.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                The Journey
              </h2>

              <p
                className="mt-4 max-w-2xl text-sm leading-relaxed"
                style={{
                  color: a.accentColor,
                }}
              >
                The following timeline uses placeholders. All factual
                information should be confirmed by MFZ before the website is
                published.
              </p>
            </div>

            <div className="space-y-3">
              {timeline.map((item, index) => (
                <motion.article
                  key={`${item.title}-${index}`}
                  initial={{
                    opacity: 0,
                    x: -30,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: '-50px',
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  className="
                    grid
                    grid-cols-[68px_4px_1fr]
                    items-start
                    gap-4
                    rounded-2xl
                    px-3
                    py-5
                    sm:grid-cols-[96px_4px_1fr]
                    sm:gap-6
                    sm:px-5
                  "
                >
                  <div className="pt-1 text-right">
                    <span
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wide
                        sm:text-sm
                      "
                      style={{
                        color: a.accentColor,
                      }}
                    >
                      {item.year}
                    </span>
                  </div>

                  <div
                    className="min-h-[88px] w-1 rounded-full"
                    style={{
                      background: a.accentColor,
                      boxShadow: `0 0 18px ${a.accentColor}55`,
                    }}
                  />

                  <div className="min-w-0 pb-3">
                    <h3
                      className="
                        mb-2
                        text-xl
                        font-black
                        leading-tight
                        sm:text-2xl
                      "
                      style={{
                        color: a.textColor,
                        fontFamily: 'Anton, sans-serif',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        max-w-2xl
                        text-sm
                        leading-relaxed
                        sm:text-base
                      "
                      style={{
                        color: a.textColor,
                        opacity: 0.7,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* =====================================================
              FOUNDER STORY
          ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.55,
            }}
            className="
              mb-10
              rounded-3xl
              p-7
              sm:p-8
              md:p-10
            "
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${a.accentColor}22`,
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{
                color: a.accentColor,
              }}
            >
              Behind the Brand
            </span>

            <h3
              className="
                mb-3
                mt-3
                text-3xl
                font-black
                sm:text-4xl
              "
              style={{
                color: a.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              Founder Story
            </h3>

            <p
              className="
                max-w-3xl
                text-sm
                leading-relaxed
                sm:text-base
              "
              style={{
                color: a.textColor,
                opacity: 0.65,
              }}
            >
              Founder story, founding date and first branch details are
              placeholders pending confirmation from MFZ. No business history
              has been fabricated.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}