import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart, cartItemKey } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { formatPKR } from '@/data/menu';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, close, remove, updateQty, total, count } = useCart();
  const { activeProduct } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[80] flex flex-col"
            style={{ background: '#0a0a0a', borderLeft: `1px solid ${activeProduct.accentColor}` }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-2xl font-black uppercase" style={{ color: activeProduct.textColor, fontFamily: 'Anton, sans-serif' }}>
                Your Cart <span className="text-sm opacity-50">({count})</span>
              </h3>
              <button onClick={close} style={{ color: activeProduct.textColor }} aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <ShoppingBag size={48} style={{ color: activeProduct.textColor, opacity: 0.3 }} />
                  <p style={{ color: activeProduct.textColor, opacity: 0.5 }}>Your cart is empty</p>
                  <Link to="/menu" onClick={close} className="px-6 py-3 rounded-full font-bold uppercase text-sm" style={{ background: activeProduct.accentColor, color: activeProduct.onAccent }}>
                    Browse Menu
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const key = cartItemKey(item);
                  return (
                    <div key={key} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate" style={{ color: activeProduct.textColor }}>{item.name}</p>
                        {item.filling && <p className="text-xs opacity-60" style={{ color: activeProduct.textColor }}>{item.filling}</p>}
                        {item.sauces && item.sauces.length > 0 && <p className="text-xs opacity-50" style={{ color: activeProduct.textColor }}>{item.sauces.join(', ')}</p>}
                        {item.extras && item.extras.length > 0 && <p className="text-xs opacity-50" style={{ color: activeProduct.textColor }}>+ {item.extras.join(', ')}</p>}
                        <p className="text-sm font-bold mt-1" style={{ color: activeProduct.accentColor, opacity: 0.9 }}>{formatPKR(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(key, item.quantity - 1)} className="p-1.5 rounded-full transition-colors hover:bg-white/10" style={{ color: activeProduct.textColor, background: 'rgba(255,255,255,0.1)' }} aria-label="Decrease">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold" style={{ color: activeProduct.textColor }}>{item.quantity}</span>
                        <button onClick={() => updateQty(key, item.quantity + 1)} className="p-1.5 rounded-full transition-colors hover:bg-white/10" style={{ color: activeProduct.textColor, background: 'rgba(255,255,255,0.1)' }} aria-label="Increase">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => remove(key)} className="p-1.5 ml-1 transition-colors hover:bg-red-500/20" style={{ color: '#ff4444' }} aria-label="Remove">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg" style={{ color: activeProduct.textColor, opacity: 0.7 }}>Total</span>
                  <span className="text-3xl font-black" style={{ color: activeProduct.accentColor, fontFamily: 'Anton, sans-serif' }}>{formatPKR(total)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={close}
                  className="block w-full py-4 rounded-full text-center font-black uppercase text-lg transition-transform hover:scale-105"
                  style={{ background: activeProduct.accentColor, color: activeProduct.onAccent }}
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
