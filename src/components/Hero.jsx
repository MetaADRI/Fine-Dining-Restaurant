import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
      >
        <source
          src="https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-amber-400 tracking-[0.3em] uppercase text-sm mb-6 font-sans"
        >
          Lusaka&apos;s Finest Dining Experience
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream max-w-5xl leading-tight"
        >
          Modern Fire Cooking,{' '}
          <span className="text-amber-400 italic">Rooted in Tradition</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-cream/60 text-lg md:text-xl max-w-2xl mt-8 font-light leading-relaxed"
        >
          Where locally sourced ingredients meet open-flame artistry.
          Every dish tells a story of Zambia&apos;s rich culinary heritage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#reservation"
            className="px-10 py-4 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded hover:bg-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
          >
            Reserve a Table
          </a>
          <a
            href="#menu"
            className="px-10 py-4 border border-cream/30 text-cream font-semibold tracking-wider uppercase text-sm rounded hover:border-amber-400 hover:text-amber-400 transition-all duration-300 hover:scale-105"
          >
            Explore the Menu
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
