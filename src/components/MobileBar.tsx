import { Link, useLocation } from 'react-router-dom';
import { Menu, Wrench, ShoppingBag, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';

export function MobileBar() {
  const { activeProduct } = useTheme();
  const { count, open } = useCart();
  const location = useLocation();
  const a = activeProduct;

  const items = [
    { icon: Menu, label: 'Menu', to: '/menu' },
    { icon: Wrench, label: 'Build', to: '/build' },
    { icon: ShoppingBag, label: 'Cart', onClick: open, badge: count },
    { icon: MapPin, label: 'Locations', to: '/locations' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around py-3 px-2 backdrop-blur-xl" style={{ background: 'rgba(10,10,10,0.85)', borderTop: `1px solid ${a.accentColor}` }}>
      {items.map((item) => {
        const active = item.to && location.pathname === item.to;
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className="flex flex-col items-center gap-1 px-4 py-1 relative"
            style={{ color: active ? a.accentColor : a.textColor, opacity: active ? 1 : 0.7 }}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
            {item.badge ? (
              <span className="absolute top-0 right-1 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center" style={{ background: a.accentColor, color: a.onAccent }}>{item.badge}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
