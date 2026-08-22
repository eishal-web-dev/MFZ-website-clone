import { motion } from 'framer-motion';

const HERMES_IMAGE =
  'https://loveluxury.com/wp-content/uploads/2025/10/Hermes-Birkin-25-Orange-Minimum-Togo-Palladium-Hardware-2023-1-1024x683.jpg';

export default function LoveLuxuryLoader() {
  return (
    <motion.div
      className="lux-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lux-loader__grain" />
      <div className="lux-loader__word">HERMÈS</div>

      <div className="lux-loader__content">
        <motion.div
          className="lux-loader__bag-stage"
          initial={{ opacity: 0, scale: 0.82, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lux-loader__halo" />
          <motion.img
            src={HERMES_IMAGE}
            alt="Hermès Birkin"
            className="lux-loader__bag"
            draggable={false}
            animate={{ y: [0, -13, 0], rotate: [-2.5, 1.5, -2.5] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          className="lux-loader__copy"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65 }}
        >
          <div className="lux-loader__brand">LOVE <span>LUXURY</span></div>
          <div className="lux-loader__eyebrow">KNIGHTSBRIDGE · LONDON</div>
        </motion.div>

        <div className="lux-loader__track">
          <motion.span
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 2.05, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
