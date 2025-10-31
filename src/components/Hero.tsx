import { motion } from "framer-motion";
import heroImage from "../assets/hero.jpg";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: "brightness(0.75) contrast(1.1)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight
                     bg-gradient-to-r from-[var(--color-gold-light)] via-yellow-500 to-amber-600
                     bg-clip-text text-transparent drop-shadow-2xl"
        >
          THE PERFECT<br />BEAUTY<sup className="text-base align-super">®</sup>
        </motion.h1>

        <motion.p className="mt-6 text-lg md:text-xl text-yellow-200/90 italic tracking-wider">
           We craft your perfect look 
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 120 }}
          className="mt-12"
        >
          <button className="group relative inline-flex items-center justify-center
                             px-10 py-4 text-lg font-semibold text-[var(--color-gold)]
                             border-2 border-[var(--color-gold)] rounded-full
                             overflow-hidden transition-all duration-300
                             hover:text-white hover:shadow-2xl hover:shadow-[var(--color-gold)]/30">
            <span className="relative z-10">BOOK NOW</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-light)] to-amber-500
                            translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[var(--color-gold-light)]/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[var(--color-gold-light)] rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}