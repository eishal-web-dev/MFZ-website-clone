import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  filling?: string;
  sauces?: string[];
  extras?: string[];
}

export const cartItemKey = (item: Pick<CartItem, 'id' | 'filling'>) =>
  `${item.id}-${item.filling ?? 'default'}`;

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'mfz-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const add: CartContextValue['add'] = (item, qty = 1) => {
    setItems((prev) => {
      const key = cartItemKey(item);
      const existing = prev.find((i) => cartItemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartItemKey(i) === key ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  };

  const remove: CartContextValue['remove'] = (key) =>
    setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));

  const updateQty: CartContextValue['updateQty'] = (key, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        cartItemKey(i) === key ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );

  const clear = () => setItems([]);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, add, remove, updateQty, clear, open, close, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
