import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-charcoal-900 flex flex-col items-center justify-center gap-6"
        >
          <div className="flex items-center gap-1 h-12">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <span className="text-sm text-cream/40 font-medium tracking-widest uppercase font-sans">
            Loading...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
