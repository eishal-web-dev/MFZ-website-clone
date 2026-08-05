import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { CorndogSVG } from '@/components/CorndogSVG';
import { Footer } from '@/components/Footer';

const timeline = [
  { year: 'Pending', title: 'The First Crunch', desc: 'MFZ opens its doors in Peshawar with a bold idea: bring Korean-style corndogs to the city. [Founding date pending confirmation.]' },
  { year: 'Pending', title: 'First Branch', desc: 'The first MFZ location opens, introducing Peshawar to the cheese pull. [First branch details pending confirmation.]' },
  { year: 'Pending', title: 'Growing the Crunch', desc: 'MFZ expands across Peshawar with new branches and a growing community of crunch lovers. [Growth story pending confirmation.]' },
  { year: 'Today', title: 'The MFZ Mission', desc: 'MFZ brings Korean-style corndogs to Peshawar with bold coatings, dramatic cheese pulls and flavours made for the city\'s next generation of food lovers.' },
];

export default function AboutPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <div className="min-h-screen" style={{ background: a.bgColor, paddingTop: 'var(--nav-h)', paddingBottom: '80px' }}>
      <div className="mfz-container" style={{ maxWidth: '1100px' }}>
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Our Story</span>
            <h1 className="text-6xl md:text-8xl font-black mt-2 mb-4" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>
              About MFZ
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: a.textColor, opacity: 0.8 }}>
              MFZ brings Korean-style corndogs to Peshawar with bold coatings, dramatic cheese pulls and flavours made for the city's next generation of food lovers.
            </p>
          </div>
          <div className="flex justify-center">
            <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="w-40 h-80">
              <CorndogSVG product={a} className="w-full h-full" />
            </motion.div>
          </div>
        </div>

        {/* Mission */}
        <div className="rounded-3xl p-8 md:p-12 mb-16 text-center" style={{ background: a.bgGradient, border: `1px solid ${a.accentColor}33` }}>
          <Sparkles size={32} style={{ color: a.accentColor }} className="mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Our Mission</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: a.textColor, opacity: 0.8 }}>
            To make corndogs that stop people mid-scroll. Bold flavours, dramatic cheese pulls and a crunch you can hear. This is not your average corndog.
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-6xl font-black mb-8" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>The Journey</h2>
          <p className="text-sm mb-8" style={{ color: a.accentColor }}>
            The following timeline uses placeholders. All factual content is marked for client confirmation.
          </p>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-sm font-black uppercase" style={{ color: a.accentColor }}>{item.year}</span>
                </div>
                <div className="flex-shrink-0 w-1 h-16 rounded-full" style={{ background: a.accentColor }} />
                <div className="flex-1 pb-6">
                  <h3 className="text-xl font-black mb-1" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: a.textColor, opacity: 0.7 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Founder note */}
        <div className="rounded-3xl p-8 mt-12" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
          <h3 className="text-2xl font-black mb-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Founder Story</h3>
          <p className="text-sm" style={{ color: a.textColor, opacity: 0.6 }}>
            [Founder story, founding date and first branch details are placeholders pending confirmation from MFZ. No business history has been fabricated.]
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
