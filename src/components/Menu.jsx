import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import menuItems from '../data/menuData';
import MealDetail from './MealDetail';

const featured = menuItems.filter((item) =>
  ['Flame-Kissed Tilapia', 'Ember-Roasted Lamb Shank', 'Open-Fire Ribeye', 'Charred Aubergine Tower'].includes(item.name)
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Menu() {
  const [selectedMeal, setSelectedMeal] = useState(null);

  return (
    <section id="menu" className="relative py-24 md:py-32 bg-charcoal-800/50 overflow-hidden">
      <div className="orb orb-3 top-10 right-10" />
      <div className="orb orb-1 bottom-20 left-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 tracking-[0.2em] uppercase text-sm mb-4 font-sans">
            Our Menu
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight">
            Crafted Over <span className="text-amber-400 italic">Open Flame</span>
          </h2>
          <p className="text-cream/50 mt-4 max-w-xl mx-auto">
            Each dish is a celebration of local ingredients, traditional techniques,
            and creative artistry.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featured.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              onClick={() => setSelectedMeal(item)}
              className="group relative bg-charcoal-900 rounded-lg overflow-hidden border border-charcoal-700/50 hover:border-amber-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-amber-500/90 text-charcoal-900 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded">
                  {item.tag}
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-xl text-cream group-hover:text-amber-400 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <span className="text-amber-400 font-semibold text-sm whitespace-nowrap ml-4">
                    {item.price}
                  </span>
                </div>
                <p className="text-cream/50 text-sm leading-relaxed">
                  {item.description}
                </p>
                <p className="mt-4 text-amber-400/60 text-xs tracking-wider uppercase flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Click to view & order
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/menu"
            className="inline-block px-10 py-4 border border-amber-500/50 text-amber-400 font-semibold tracking-wider uppercase text-sm rounded hover:bg-amber-500 hover:text-charcoal-900 transition-all duration-300 hover:scale-105"
          >
            View Full Menu
          </Link>
        </motion.div>
      </div>

      {selectedMeal && (
        <MealDetail meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </section>
  );
}
