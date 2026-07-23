import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import menuItems, { categories } from '../data/menuData';
import MealDetail from '../components/MealDetail';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const filtered = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cream/40 hover:text-amber-400 transition-colors text-sm mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="font-serif text-5xl md:text-6xl text-cream leading-tight">
            The <span className="text-amber-400 italic">Full</span> Menu
          </h1>
          <p className="text-cream/50 mt-4 max-w-xl mx-auto">
            Click any dish to view details, pick your quantity, and add to your reservation.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg pl-11 pr-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-charcoal-900 shadow-lg shadow-amber-500/20'
                  : 'bg-charcoal-800 text-cream/50 border border-charcoal-700 hover:border-amber-500/30 hover:text-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <p className="text-cream/30 text-sm text-center mb-8">
          Showing {filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
        </p>

        {/* Menu Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeCategory + searchTerm}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                layout
                onClick={() => setSelectedMeal(item)}
                className="group relative bg-charcoal-800/60 rounded-lg overflow-hidden border border-charcoal-700/50 hover:border-amber-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
                  {item.tag && (
                    <span className="absolute top-3 left-3 bg-amber-500/90 text-charcoal-900 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-cream group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-amber-400 font-semibold text-sm whitespace-nowrap ml-3">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-cream/45 text-xs leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-cream/25 tracking-wider uppercase border border-charcoal-700 rounded px-2 py-0.5">
                      {item.category}
                    </span>
                    <span className="text-amber-400/50 text-[10px] tracking-wider uppercase flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Order
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-cream/30 text-lg">No dishes found.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="mt-4 text-amber-400 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-12 border-t border-charcoal-700/30"
        >
          <p className="text-cream/40 mb-6">Ready to experience Ember & Oak?</p>
          <Link
            to="/#reservation"
            className="inline-block px-10 py-4 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded hover:bg-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
          >
            Reserve a Table
          </Link>
        </motion.div>
      </div>

      {selectedMeal && (
        <MealDetail meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </div>
  );
}
