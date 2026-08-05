import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Phone, MessageCircle, Navigation, Truck, ArrowRight } from 'lucide-react';
import { branches } from '@/data/branches';
import { useTheme } from '@/context/ThemeContext';
import { Footer } from '@/components/Footer';

export default function LocationsPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: a.bgColor, paddingTop: 'var(--nav-h)', paddingBottom: '80px' }}>
      <div className="mfz-container">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Find Us in Peshawar</span>
          <h1 className="text-6xl md:text-8xl font-black mt-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Locations</h1>
          <p className="text-sm mt-2" style={{ color: a.textColor, opacity: 0.5 }}>Address, hours and contact details pending MFZ confirmation.</p>
        </div>

        {/* Map */}
        <div className="relative rounded-3xl overflow-hidden mb-8 aspect-[16/9]" style={{ background: a.bgGradient, border: `1px solid ${a.accentColor}33` }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {branches.map((b) => (
            <motion.div
              key={b.id}
              className="absolute"
              style={{ left: `${b.mapX}%`, top: `${b.mapY}%` }}
              onMouseEnter={() => setHovered(b.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                animate={{ scale: hovered === b.id ? 1.5 : 1 }}
                className="relative"
              >
                <div className="w-6 h-6 rounded-full" style={{ background: a.accentColor, boxShadow: `0 0 20px ${a.accentColor}` }} />
                <AnimatePresence>
                  {hovered === b.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap z-10"
                      style={{ background: a.bgColor, color: a.textColor, border: `1px solid ${a.accentColor}` }}
                    >
                      {b.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
          <div className="absolute bottom-4 right-4 text-xs font-bold uppercase" style={{ color: a.textColor, opacity: 0.4 }}>Peshawar, PK</div>
        </div>

        {/* Branch cards */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {branches.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl p-6"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>{b.name}</h3>
                  <p className="text-sm" style={{ color: a.textColor, opacity: 0.6 }}>{b.area}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: b.delivery ? a.accentColor : 'rgba(255,255,255,0.1)', color: b.delivery ? a.onAccent : a.textColor, opacity: b.delivery ? 1 : 0.5 }}>
                  {b.delivery ? 'Delivery' : 'Pickup'}
                </span>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm" style={{ color: a.textColor, opacity: 0.7 }}>
                  <MapPin size={14} /> {b.address}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: a.textColor, opacity: 0.7 }}>
                  <Clock size={14} /> {b.hours}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: a.textColor, opacity: 0.7 }}>
                  <Phone size={14} /> {b.phone}
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.area)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-full text-sm font-bold text-center flex items-center justify-center gap-1" style={{ background: a.accentColor, color: a.onAccent }}>
                  <Navigation size={14} /> Directions
                </a>
                <a href={`https://wa.me/`} target="_blank" rel="noopener" className="flex-1 py-2.5 rounded-full text-sm font-bold text-center flex items-center justify-center gap-1" style={{ background: '#25D366', color: '#fff' }}>
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
