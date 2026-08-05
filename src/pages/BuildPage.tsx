import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { products, type Product } from '@/data/products';
import { formatPKR } from '@/data/menu';
import { CorndogSVG } from '@/components/CorndogSVG';
import { Footer } from '@/components/Footer';

const coatings = ['Classic', 'Potato', 'Ramen', 'Flaming', 'Smoked', 'Cheeto', 'Nashville', 'Zinger'];
const fillings = ['Full Cheese', 'Full Sausage', 'Half & Half', 'Cheese Wrap', 'Sausage & Cheese Wrap'];
const sauces = ['Ketchup', 'Mustard', 'Spicy Mayo', 'Cheese Sauce', 'Hot Sauce'];
const extras = ['Extra Cheese', 'Extra Sauce', 'Crushed Cheetos', 'Potato Coating', 'Spice Boost'];

const basePrice = 500;
const coatingPrices: Record<string, number> = { Classic: 0, Potato: 100, Ramen: 200, Flaming: 150, Smoked: 250, Cheeto: 170, Nashville: 180, Zinger: 220 };
const fillingPrices: Record<string, number> = { 'Full Cheese': 50, 'Full Sausage': 50, 'Half & Half': 50, 'Cheese Wrap': 80, 'Sausage & Cheese Wrap': 100 };
const saucePrices: Record<string, number> = { Ketchup: 0, Mustard: 0, 'Spicy Mayo': 30, 'Cheese Sauce': 50, 'Hot Sauce': 20 };
const extraPrices: Record<string, number> = { 'Extra Cheese': 80, 'Extra Sauce': 30, 'Crushed Cheetos': 60, 'Potato Coating': 70, 'Spice Boost': 40 };

export default function BuildPage() {
  const { activeProduct } = useTheme();
  const { add } = useCart();
  const a = activeProduct;

  const [coating, setCoating] = useState('Classic');
  const [filling, setFilling] = useState('Full Cheese');
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const previewProduct: Product = useMemo(() => {
    const match = products.find((p) => p.coating === coating);
    return match || products[3];
  }, [coating]);

  const totalPrice = useMemo(() => {
    let total = basePrice;
    total += coatingPrices[coating] || 0;
    total += fillingPrices[filling] || 0;
    selectedSauces.forEach((s) => (total += saucePrices[s] || 0));
    selectedExtras.forEach((e) => (total += extraPrices[e] || 0));
    return total;
  }, [coating, filling, selectedSauces, selectedExtras]);

  const toggle = (item: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const reset = () => {
    setCoating('Classic');
    setFilling('Full Cheese');
    setSelectedSauces([]);
    setSelectedExtras([]);
  };

  const steps = [
    { num: '01', label: 'Coating', desc: 'Choose your crunch' },
    { num: '02', label: 'Filling', desc: 'What goes inside' },
    { num: '03', label: 'Sauces', desc: 'Drizzle it up' },
    { num: '04', label: 'Extras', desc: 'Go the extra mile' },
  ];

  return (
    <div className="min-h-screen" style={{ background: a.bgColor, paddingTop: 'var(--nav-h)', paddingBottom: '80px' }}>
      <div className="mfz-container">
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: a.accentColor }}>Make It Yours</span>
          <h1 className="text-6xl md:text-8xl font-black mt-2" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Build Your MFZ</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl p-8 flex flex-col items-center" style={{ background: previewProduct.bgGradient, border: `1px solid ${previewProduct.accentColor}44` }}>
              <motion.div
                key={previewProduct.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="w-48 h-96 mb-6"
              >
                <CorndogSVG product={previewProduct} className="w-full h-full" />
              </motion.div>
              <div className="text-center mb-4">
                <p className="text-xs uppercase tracking-widest" style={{ color: previewProduct.textColor, opacity: 0.6 }}>Your Creation</p>
                <p className="text-2xl font-black mt-1" style={{ color: previewProduct.textColor, fontFamily: 'Anton, sans-serif' }}>
                  {coating} · {filling}
                </p>
                {selectedSauces.length > 0 && <p className="text-sm mt-1" style={{ color: previewProduct.textColor, opacity: 0.7 }}>{selectedSauces.join(', ')}</p>}
                {selectedExtras.length > 0 && <p className="text-sm" style={{ color: previewProduct.textColor, opacity: 0.7 }}>+ {selectedExtras.join(', ')}</p>}
              </div>
              <div className="text-4xl font-black mb-4" style={{ color: previewProduct.accentColor, fontFamily: 'Anton, sans-serif' }}>{formatPKR(totalPrice)}</div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => add({ id: Date.now(), name: `Custom ${coating} Corndog`, price: totalPrice, filling, sauces: selectedSauces, extras: selectedExtras })}
                  className="flex-1 py-4 rounded-full font-black uppercase"
                  style={{ background: previewProduct.accentColor, color: previewProduct.onAccent }}
                >
                  Order Your Creation
                </button>
                <button onClick={reset} className="px-4 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: previewProduct.textColor }} aria-label="Reset"><RotateCcw size={18} /></button>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {/* Step 1: Coating */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-black" style={{ color: a.accentColor, fontFamily: 'Anton, sans-serif' }}>01</span>
                <div>
                  <h3 className="text-xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Coating</h3>
                  <p className="text-xs" style={{ color: a.textColor, opacity: 0.5 }}>Choose your crunch</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {coatings.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCoating(c)}
                    className="px-4 py-3 rounded-2xl text-sm font-bold transition-all"
                    style={{ background: coating === c ? a.accentColor : 'rgba(255,255,255,0.08)', color: coating === c ? a.onAccent : a.textColor, border: `1px solid ${coating === c ? a.accentColor : 'transparent'}` }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Filling */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-black" style={{ color: a.accentColor, fontFamily: 'Anton, sans-serif' }}>02</span>
                <div>
                  <h3 className="text-xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Filling</h3>
                  <p className="text-xs" style={{ color: a.textColor, opacity: 0.5 }}>What goes inside</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fillings.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilling(f)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all"
                    style={{ background: filling === f ? a.accentColor : 'rgba(255,255,255,0.08)', color: filling === f ? a.onAccent : a.textColor }}
                  >
                    {f}
                    {filling === f && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Sauces */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-black" style={{ color: a.accentColor, fontFamily: 'Anton, sans-serif' }}>03</span>
                <div>
                  <h3 className="text-xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Sauces</h3>
                  <p className="text-xs" style={{ color: a.textColor, opacity: 0.5 }}>Drizzle it up (select multiple)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sauces.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle(s, selectedSauces, setSelectedSauces)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all"
                    style={{ background: selectedSauces.includes(s) ? a.accentColor : 'rgba(255,255,255,0.08)', color: selectedSauces.includes(s) ? a.onAccent : a.textColor }}
                  >
                    {s}
                    {selectedSauces.includes(s) && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Extras */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-black" style={{ color: a.accentColor, fontFamily: 'Anton, sans-serif' }}>04</span>
                <div>
                  <h3 className="text-xl font-black" style={{ color: a.textColor, fontFamily: 'Anton, sans-serif' }}>Extras</h3>
                  <p className="text-xs" style={{ color: a.textColor, opacity: 0.5 }}>Go the extra mile (select multiple)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {extras.map((e) => (
                  <button
                    key={e}
                    onClick={() => toggle(e, selectedExtras, setSelectedExtras)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all"
                    style={{ background: selectedExtras.includes(e) ? a.accentColor : 'rgba(255,255,255,0.08)', color: selectedExtras.includes(e) ? a.onAccent : a.textColor }}
                  >
                    {e}
                    {selectedExtras.includes(e) && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
