import { motion } from 'framer-motion';
import type { Product } from '@/data/products';

interface Props {
  product: Product;
  className?: string;
  tilt?: number;
  showStick?: boolean;
}

export function CorndogSVG({ product, className = '', tilt = -18, showStick = true }: Props) {
  const { dominantColor, secondaryColor, accentColor, coating } = product;

  return (
    <motion.div
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ rotate: tilt }}
      animate={{ rotate: tilt }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
    >
      <svg
        viewBox="0 0 300 600"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: `drop-shadow(0 30px 40px rgba(0,0,0,0.5))` }}
      >
        <defs>
          <linearGradient id={`body-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={dominantColor} />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={dominantColor} />
          </linearGradient>
          <radialGradient id={`shine-${product.id}`} cx="0.35" cy="0.3" r="0.5">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id={`sauce-${product.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Stick */}
        {showStick && (
          <rect x="138" y="460" width="24" height="160" rx="12" fill="#8b6f47" />
        )}
        {showStick && (
          <rect x="138" y="460" width="10" height="160" rx="5" fill="#a88a5c" opacity="0.6" />
        )}

        {/* Corndog body - diagonal sausage shape */}
        <g transform="rotate(-25 150 280)">
          {/* Shadow body */}
          <ellipse cx="155" cy="285" rx="78" ry="200" fill="rgba(0,0,0,0.25)" transform="translate(8 12)" />

          {/* Main body */}
          <ellipse cx="150" cy="280" rx="75" ry="195" fill={`url(#body-${product.id})`} />

          {/* Coating texture based on type */}
          {coating === 'Potato' && (
            <g opacity="0.85">
              {Array.from({ length: 28 }).map((_, i) => {
                const angle = (i / 28) * Math.PI * 2;
                const r = 60 + Math.sin(i * 7) * 12;
                const cx = 150 + Math.cos(angle) * r;
                const cy = 280 + Math.sin(angle) * 180;
                return (
                  <rect
                    key={i}
                    x={cx}
                    y={cy}
                    width="14"
                    height="14"
                    rx="3"
                    fill={i % 2 ? '#e8a020' : '#f5c542'}
                    transform={`rotate(${i * 20} ${cx} ${cy})`}
                  />
                );
              })}
            </g>
          )}

          {coating === 'Ramen' && (
            <g opacity="0.8" stroke="#ffd08a" strokeWidth="3" fill="none">
              {Array.from({ length: 18 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${80 + (i % 3) * 45} ${120 + i * 18} q ${20 + (i % 4) * 10} ${-15 - (i % 3) * 8} ${40 + (i % 2) * 15} ${5 + (i % 3) * 10}`}
                />
              ))}
            </g>
          )}

          {(coating === 'Flaming' || coating === 'Cheeto') && (
            <g opacity="0.7">
              {Array.from({ length: 22 }).map((_, i) => (
                <circle
                  key={i}
                  cx={90 + (i % 5) * 28 + Math.sin(i) * 8}
                  cy={120 + Math.floor(i / 5) * 70}
                  r={4 + (i % 3) * 2}
                  fill={i % 2 ? '#ff6b1a' : accentColor}
                />
              ))}
            </g>
          )}

          {coating === 'Smoked' && (
            <g opacity="0.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <ellipse key={i} cx={100 + (i % 4) * 32} cy={140 + Math.floor(i / 4) * 80} rx="20" ry="8" fill="#1a1a1a" />
              ))}
            </g>
          )}

          {coating === 'Zinger' && (
            <g opacity="0.75">
              {Array.from({ length: 26 }).map((_, i) => (
                <polygon
                  key={i}
                  points={`${90 + (i % 6) * 22},${130 + Math.floor(i / 6) * 55} ${100 + (i % 6) * 22},${140 + Math.floor(i / 6) * 55} ${110 + (i % 6) * 22},${130 + Math.floor(i / 6) * 55}`}
                  fill={i % 2 ? '#facc15' : '#dc2626'}
                />
              ))}
            </g>
          )}

          {coating === 'Green' && (
            <g opacity="0.7">
              {Array.from({ length: 20 }).map((_, i) => (
                <circle key={i} cx={88 + (i % 4) * 32} cy={130 + Math.floor(i / 4) * 70} r="5" fill={i % 2 ? '#22c55e' : '#86efac'} />
              ))}
            </g>
          )}

          {coating === 'Nashville' && (
            <g opacity="0.65">
              {Array.from({ length: 24 }).map((_, i) => (
                <circle
                  key={i}
                  cx={85 + (i % 5) * 28 + Math.sin(i * 3) * 6}
                  cy={120 + Math.floor(i / 5) * 65}
                  r={3 + (i % 2) * 2}
                  fill={i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#dc2626' : '#7f1d1d'}
                />
              ))}
            </g>
          )}

          {/* Shine highlight */}
          <ellipse cx="125" cy="220" rx="30" ry="140" fill={`url(#shine-${product.id})`} />

          {/* Sauce ribbon - drizzle from top */}
          <path
            d="M 100 100 Q 120 180 95 240 Q 70 300 100 360 Q 130 420 105 470"
            stroke={`url(#sauce-${product.id})`}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 180 110 Q 165 200 195 270 Q 220 340 185 410"
            stroke={`url(#sauce-${product.id})`}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Bottom rim light */}
          <ellipse cx="150" cy="280" rx="75" ry="195" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.4" />
        </g>
      </svg>
    </motion.div>
  );
}
