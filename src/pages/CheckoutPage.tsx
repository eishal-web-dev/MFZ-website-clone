import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Truck, Store, MessageCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart, cartItemKey } from '@/context/CartContext';
import { formatPKR } from '@/data/menu';
import { branches } from '@/data/branches';
import { Footer } from '@/components/Footer';

export default function CheckoutPage() {
  const { activeProduct } = useTheme();
  const { items, total, clear } = useCart();
  const a = activeProduct;
  const navigate = useNavigate();
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [payment, setPayment] = useState('cod');
  const [placed, setPlaced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clear();
    setTimeout(() => navigate('/'), 3000);
  };

  if (placed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: a.bgGradient }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: a.accentColor }}>
            <Check size={40} style={{ color: a.onAccent }} />
          </motion.div>
          <h1 className="text-5xl font-black mb-3" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Order Placed!</h1>
          <p className="text-lg" style={{ color: a.textColor, opacity: 0.7 }}>Your crunch is on the way. Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: a.bgColor, paddingTop: 'var(--nav-h)', paddingBottom: '80px' }}>
      <div className="mfz-container" style={{ maxWidth: '1100px' }}>
        <h1 className="text-5xl md:text-7xl font-black mb-8" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg mb-4" style={{ color: a.textColor, opacity: 0.6 }}>Your cart is empty.</p>
            <Link to="/menu" className="font-bold uppercase" style={{ color: a.accentColor }}>Browse Menu</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mode */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setMode('delivery')} className="py-4 rounded-2xl flex flex-col items-center gap-2 font-bold transition-all" style={{ background: mode === 'delivery' ? a.accentColor : 'rgba(255,255,255,0.08)', color: mode === 'delivery' ? a.onAccent : a.textColor }}>
                  <Truck size={20} /> Delivery
                </button>
                <button type="button" onClick={() => setMode('pickup')} className="py-4 rounded-2xl flex flex-col items-center gap-2 font-bold transition-all" style={{ background: mode === 'pickup' ? a.accentColor : 'rgba(255,255,255,0.08)', color: mode === 'pickup' ? a.onAccent : a.textColor }}>
                  <Store size={20} /> Pickup
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-4 rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
                <div>
                  <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Phone</label>
                  <input required type="tel" className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
                </div>
                {mode === 'pickup' ? (
                  <div>
                    <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Branch</label>
                    <select className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }}>
                      {branches.map((b) => <option key={b.id} style={{ background: a.bgColor }}>{b.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Address</label>
                    <textarea required rows={2} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
                  </div>
                )}
                <div>
                  <label className="text-xs uppercase font-bold mb-2 block" style={{ color: a.textColor, opacity: 0.6 }}>Instructions</label>
                  <input className="w-full px-4 py-3 rounded-xl outline-none" placeholder="Optional" style={{ background: 'rgba(255,255,255,0.08)', color: a.textColor, border: `1px solid ${a.accentColor}33` }} />
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="text-xs uppercase font-bold mb-3 block" style={{ color: a.textColor, opacity: 0.6 }}>Payment Method</label>
                <div className="space-y-2">
                  {[
                    { id: 'cod', label: 'Cash on Delivery' },
                    { id: 'card', label: 'Card (placeholder)' },
                    { id: 'easypaisa', label: 'Easypaisa (placeholder)' },
                    { id: 'jazzcash', label: 'JazzCash (placeholder)' },
                  ].map((p) => (
                    <button key={p.id} type="button" onClick={() => setPayment(p.id)} className="w-full px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-all" style={{ background: payment === p.id ? a.accentColor : 'rgba(255,255,255,0.08)', color: payment === p.id ? a.onAccent : a.textColor }}>
                      {p.label}
                      {payment === p.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: a.textColor, opacity: 0.4 }}>Card, Easypaisa and JazzCash are placeholders. Use WhatsApp checkout for a working order.</p>
              </div>

              <button type="submit" className="w-full py-4 rounded-full font-black uppercase text-lg" style={{ background: a.accentColor, color: a.onAccent }}>Place Order</button>
              <a href={`https://wa.me/?text=I'd like to order from MFZ. Total: ${formatPKR(total)}`} target="_blank" rel="noopener" className="w-full py-4 rounded-full font-black uppercase text-lg flex items-center justify-center gap-2" style={{ background: '#25D366', color: '#fff' }}>
                <MessageCircle size={18} /> Order via WhatsApp
              </a>
            </form>

            {/* Summary */}
            <div className="rounded-3xl p-6 h-fit lg:sticky lg:top-24" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.accentColor}22` }}>
              <h3 className="text-xl font-black mb-4" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={cartItemKey(item)} className="flex justify-between text-sm" style={{ color: a.textColor, opacity: 0.8 }}>
                    <div className="min-w-0">
                      <p>{item.quantity}× {item.name}</p>
                      {item.filling && <p className="text-xs opacity-60">{item.filling}</p>}
                      {item.sauces && item.sauces.length > 0 && <p className="text-xs opacity-50">{item.sauces.join(', ')}</p>}
                      {item.extras && item.extras.length > 0 && <p className="text-xs opacity-50">+ {item.extras.join(', ')}</p>}
                    </div>
                    <span style={{ color: a.accentColor }}>{formatPKR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-lg" style={{ color: a.textColor }}>Total</span>
                <span className="text-3xl font-black" style={{ color: a.accentColor, fontFamily: 'Anton, sans-serif' }}>{formatPKR(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
