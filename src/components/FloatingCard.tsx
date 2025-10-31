import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import floatImage from '../assets/float.jpg';

export default function FloatingCard() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="absolute top-1/3 right-12 w-80 bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center"
    >
      <div className="flex space-x-2 mb-4">
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">Gel-x</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">Acrylic</button>
        <button className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-white text-sm">Biab</button>
      </div>

      <h3 className="text-lg font-semibold mb-1">Unique styles & pampering</h3>
      <p className="text-xs text-[var(--color-muted)] mb-4">From consultation to perfection.</p>

      <div className="relative w-full h-48 bg-gray-200 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${floatImage})` }}
        />
        <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
          <Play className="w-5 h-5 text-[var(--color-accent)]" />
        </button>
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded px-2 py-1 text-xs font-medium">
          SALON TOUR
        </div>
      </div>
    </motion.div>
  );
}