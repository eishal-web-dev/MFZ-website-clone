import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export function LoadingScreen() {
  const { activeProduct } = useTheme();
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: activeProduct.bgGradient }}
    >
      <div className="relative w-32 h-64 mb-8">
        {/* Stick */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-24 rounded-full bg-amber-700" />
        {/* Corndog body */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-16 h-40 rounded-full"
          style={{ background: activeProduct.dominantColor }}
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Rising sauce line */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-1 rounded-full"
          style={{ background: activeProduct.accentColor, bottom: 0 }}
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </div>
      <motion.h2
        className="text-3xl font-black uppercase tracking-tight"
        style={{ color: activeProduct.textColor, fontFamily: 'Anton, sans-serif' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Heating the Crunch...
      </motion.h2>
    </div>
  );
}
