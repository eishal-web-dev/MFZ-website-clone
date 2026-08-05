import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, MessageCircle, Phone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  const { activeProduct } = useTheme();
  const a = activeProduct;
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen" style={{ background: a.bgColor, paddingTop: 'var(--nav-h)', paddingBottom: '80px' }}>
      <div className="mfz-container" style={{ maxWidth: '1100px' }}>
        <div className="mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Get In Touch</span>
          <h1 className="text-6xl md:text-8xl font-black mt-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Contact</h1>
          <p className="text-lg mt-3" style={{ color: a.textColor, opacity: 0.7 }}>Questions, catering or just want to talk corndogs? We're here.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl p-8 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
            <div>
              <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Name</label>
              <input required type="text" className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
            </div>
            <div>
              <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Phone</label>
              <input required type="tel" className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
            </div>
            <div>
              <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Message</label>
              <textarea required rows={4} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
            </div>
            <button type="submit" className="w-full py-4 rounded-full font-black uppercase flex items-center justify-center gap-2 transition-transform hover:scale-105" style={{ background: a.accentColor, color: a.onAccent }}>
              {sent ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
            </button>
          </form>

          {/* Info */}
          <div className="space-y-4">
            <div className="rounded-3xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
              <div className="p-3 rounded-full" style={{ background: a.accentColor }}><MapPin size={20} style={{ color: a.onAccent }} /></div>
              <div>
                <h3 className="font-black" style={{ color: a.textColor }}>Location</h3>
                <p className="text-sm" style={{ color: a.textColor, opacity: 0.6 }}>Peshawar, Pakistan</p>
              </div>
            </div>
            <div className="rounded-3xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
              <div className="p-3 rounded-full" style={{ background: a.accentColor }}><Phone size={20} style={{ color: a.onAccent }} /></div>
              <div>
                <h3 className="font-black" style={{ color: a.textColor }}>Phone</h3>
                <p className="text-sm" style={{ color: a.textColor, opacity: 0.6 }}>Confirm with MFZ</p>
              </div>
            </div>
            <div className="rounded-3xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
              <div className="p-3 rounded-full" style={{ background: a.accentColor }}><Mail size={20} style={{ color: a.onAccent }} /></div>
              <div>
                <h3 className="font-black" style={{ color: a.textColor }}>Email</h3>
                <p className="text-sm" style={{ color: a.textColor, opacity: 0.6 }}>Confirm with MFZ</p>
              </div>
            </div>
            <a href="https://wa.me/" target="_blank" rel="noopener" className="rounded-3xl p-6 flex items-center gap-4 transition-transform hover:scale-[1.02]" style={{ background: '#25D366' }}>
              <div className="p-3 rounded-full" style={{ background: '#fff' }}><MessageCircle size={20} style={{ color: '#25D366' }} /></div>
              <div>
                <h3 className="font-black text-white">WhatsApp Us</h3>
                <p className="text-sm text-white opacity-80">Quick ordering & support</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
