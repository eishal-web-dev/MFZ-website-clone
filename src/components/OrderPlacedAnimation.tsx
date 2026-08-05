import {
  Check,
  Clock3,
  Home,
  MapPin,
  MessageCircle,
  PackageCheck,
  Truck,
  X,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@/context/ThemeContext';

interface OrderPlacedAnimationProps {
  open: boolean;
  orderNumber: string;
  customerName?: string;
  orderType?: 'delivery' | 'pickup';
  onClose: () => void;
}

const MFZ_WHATSAPP = '923051880355';

export function OrderPlacedAnimation({
  open,
  orderNumber,
  customerName,
  orderType = 'delivery',
  onClose,
}: OrderPlacedAnimationProps) {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  const navigate = useNavigate();

  const whatsappMessage = encodeURIComponent(
    [
      'Assalamualaikum MFZ,',
      '',
      `I have placed order ${orderNumber}.`,
      'Please confirm my order status.',
    ].join('\n'),
  );

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {open && (
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
            z-[200]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/80
            px-4
            py-8
            backdrop-blur-xl
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.88,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 25,
              scale: 0.92,
            }}
            transition={{
              type: 'spring',
              stiffness: 170,
              damping: 20,
            }}
            className="
              relative
              w-full
              max-w-xl
              overflow-hidden
              rounded-[32px]
              border
              p-6
              shadow-2xl
              sm:p-8
            "
            style={{
              background: active.bgGradient,
              borderColor: `${active.accentColor}55`,
              boxShadow: `0 30px 100px ${active.accentColor}20`,
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order confirmation"
              className="
                absolute
                right-4
                top-4
                z-30
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                transition-transform
                hover:scale-110
              "
              style={{
                background:
                  'rgba(255,255,255,0.08)',
                color: active.textColor,
              }}
            >
              <X size={19} />
            </button>

            {/* Ambient glow */}
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.15, 0.38, 0.15],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="
                pointer-events-none
                absolute
                left-1/2
                top-12
                h-52
                w-52
                -translate-x-1/2
                rounded-full
                blur-[75px]
              "
              style={{
                background: active.accentColor,
              }}
            />

            {/* Success animation */}
            <div className="relative mx-auto mt-3 flex h-44 w-64 items-end justify-center overflow-hidden">
              {/* Moving road */}
              <div
                className="
                  absolute
                  bottom-5
                  left-1/2
                  h-[2px]
                  w-56
                  -translate-x-1/2
                  overflow-hidden
                  rounded-full
                "
                style={{
                  background: `${active.textColor}40`,
                }}
              >
                <motion.div
                  animate={{
                    x: ['120%', '-120%'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-y-0 w-20"
                  style={{
                    background: active.accentColor,
                  }}
                />
              </div>

              {/* Delivery truck */}
              <motion.div
                initial={{
                  x: -220,
                }}
                animate={{
                  x: 0,
                  y: [0, -3, 0],
                }}
                transition={{
                  x: {
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  y: {
                    duration: 0.55,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="relative z-10 mb-6"
              >
                <div className="relative">
                  <Truck
                    size={118}
                    strokeWidth={1.7}
                    style={{
                      color: active.accentColor,
                      filter:
                        'drop-shadow(0 15px 20px rgba(0,0,0,0.35))',
                    }}
                  />

                  <div
                    className="
                      absolute
                      left-[23px]
                      top-[35px]
                      text-sm
                      font-black
                    "
                    style={{
                      color: active.textColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    MFZ
                  </div>
                </div>
              </motion.div>

              {/* Completed badge */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.9,
                  type: 'spring',
                  stiffness: 230,
                  damping: 14,
                }}
                className="
                  absolute
                  right-6
                  top-3
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  boxShadow:
                    '0 12px 35px rgba(37,211,102,0.35)',
                }}
              >
                <motion.div
                  initial={{
                    pathLength: 0,
                  }}
                  animate={{
                    pathLength: 1,
                  }}
                >
                  <Check
                    size={31}
                    strokeWidth={3}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Copy */}
            <div className="relative text-center">
              <motion.span
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.45,
                }}
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.3em]
                "
                style={{
                  color: active.accentColor,
                }}
              >
                Order Confirmed
              </motion.span>

              <motion.h2
                id="order-success-title"
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                }}
                className="
                  mt-3
                  text-4xl
                  font-black
                  leading-none
                  sm:text-5xl
                "
                style={{
                  color: active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                Your Crunch Is Coming!
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.7,
                }}
                className="
                  mx-auto
                  mt-4
                  max-w-md
                  text-sm
                  leading-relaxed
                  sm:text-base
                "
                style={{
                  color: active.textColor,
                  opacity: 0.7,
                }}
              >
                {customerName
                  ? `Thanks, ${customerName}. `
                  : ''}
                Your MFZ order has been received and
                is now being prepared.
              </motion.p>
            </div>

            {/* Details */}
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
              }}
              className="
                mt-7
                grid
                gap-3
                rounded-2xl
                border
                p-4
                sm:grid-cols-2
              "
              style={{
                background:
                  'rgba(255,255,255,0.05)',
                borderColor: `${active.accentColor}25`,
              }}
            >
              <div className="flex items-center gap-3">
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
                    background: `${active.accentColor}18`,
                    color: active.accentColor,
                  }}
                >
                  <PackageCheck size={18} />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-widest
                    "
                    style={{
                      color: active.textColor,
                      opacity: 0.45,
                    }}
                  >
                    Order Number
                  </p>

                  <p
                    className="mt-0.5 text-sm font-black"
                    style={{
                      color: active.textColor,
                    }}
                  >
                    {orderNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
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
                    background: `${active.accentColor}18`,
                    color: active.accentColor,
                  }}
                >
                  {orderType === 'delivery' ? (
                    <Clock3 size={18} />
                  ) : (
                    <MapPin size={18} />
                  )}
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-widest
                    "
                    style={{
                      color: active.textColor,
                      opacity: 0.45,
                    }}
                  >
                    {orderType === 'delivery'
                      ? 'Estimated Time'
                      : 'Order Type'}
                  </p>

                  <p
                    className="mt-0.5 text-sm font-black"
                    style={{
                      color: active.textColor,
                    }}
                  >
                    {orderType === 'delivery'
                      ? '30–45 minutes'
                      : 'Branch Pickup'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.95,
              }}
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              <button
                type="button"
                onClick={handleGoHome}
                className="
                  flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-5
                  py-3
                  font-black
                  uppercase
                  transition-transform
                  hover:scale-[1.02]
                "
                style={{
                  background: active.accentColor,
                  color: active.onAccent,
                }}
              >
                <Home size={17} />
                Back Home
              </button>

              <a
                href={`https://wa.me/${MFZ_WHATSAPP}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-5
                  py-3
                  font-black
                  uppercase
                  transition-transform
                  hover:scale-[1.02]
                "
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                }}
              >
                <MessageCircle size={17} />
                Contact MFZ
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}