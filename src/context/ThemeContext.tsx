import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products, type Product } from '@/data/products';

interface ThemeContextValue {
  activeProduct: Product;
  index: number;
  setIndex: (i: number) => void;
  direction: number;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const activeProduct = products[index];

  useEffect(() => {
    const p = products[index];
    const root = document.documentElement;
    root.style.setProperty('--mfz-dominant', p.dominantColor);
    root.style.setProperty('--mfz-secondary', p.secondaryColor);
    root.style.setProperty('--mfz-accent', p.accentColor);
    root.style.setProperty('--mfz-text', p.textColor);
    root.style.setProperty('--mfz-bg', p.bgColor);
    root.style.setProperty('--mfz-particle', p.particleColor);
    root.style.setProperty('--theme-primary', p.dominantColor);
    root.style.setProperty('--theme-secondary', p.secondaryColor);
    root.style.setProperty('--theme-accent', p.accentColor);
    root.style.setProperty('--theme-text', p.textColor);
    root.style.setProperty('--theme-on-accent', p.onAccent);
    root.style.setProperty('--theme-muted', p.bgColor);
    root.style.setProperty('--theme-glow', p.dominantColor + '66');
  }, [index]);

  const handleSetIndex = (i: number) => {
    setDirection(i > index || (i === 0 && index === products.length - 1) ? 1 : -1);
    setIndex(i);
  };

  return (
    <ThemeContext.Provider value={{ activeProduct, index, setIndex: handleSetIndex, direction }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
