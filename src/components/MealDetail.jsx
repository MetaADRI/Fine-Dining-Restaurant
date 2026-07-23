import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/orderContext';
import { CartIcon, UtensilsIcon, BoltIcon } from './Icons';

export default function MealDetail({ meal, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('cart');
  const { addItem, parsePrice } = useOrder();
  const navigate = useNavigate();

  if (!meal) return null;

  const unitPrice = parsePrice(meal.price);
  const lineTotal = unitPrice * quantity;
  const vatAmount = Math.round(lineTotal * 0.16);
  const grandTotal = lineTotal + vatAmount;

  const handleAdd = () => {
    addItem(meal, quantity);
    if (orderType === 'reserve') {
      onClose();
      navigate('/#reservation');
    } else if (orderType === 'checkout') {
      onClose();
      navigate('/checkout');
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-charcoal-900 border border-charcoal-700/60 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto"
        >
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-charcoal-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cream/60 hover:text-cream hover:bg-charcoal-800 transition-all"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {meal.tag && (
              <span className="absolute top-4 left-4 bg-amber-500/90 text-charcoal-900 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                {meal.tag}
              </span>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h2 className="font-serif text-xl md:text-2xl text-cream">{meal.name}</h2>
              <span className="text-amber-400 font-serif text-xl whitespace-nowrap">{meal.price}</span>
            </div>
            <span className="text-[10px] text-cream/30 tracking-wider uppercase border border-charcoal-700 rounded px-2 py-0.5 mb-3 inline-block">
              {meal.category}
            </span>
            <p className="text-cream/50 text-sm leading-relaxed mb-5">{meal.description}</p>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-cream/50 text-sm tracking-wider uppercase">Quantity</span>
              <div className="flex items-center gap-1 bg-charcoal-800 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-cream font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-charcoal-800/50 rounded-xl p-4 mb-5 text-sm space-y-1.5">
              <div className="flex justify-between text-cream/50">
                <span>{meal.price} × {quantity}</span>
                <span>ZMW {lineTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-cream/50">
                <span>VAT (16%)</span>
                <span>ZMW {vatAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-cream border-t border-charcoal-700/50 pt-2 mt-2">
                <span>Total</span>
                <span className="text-amber-400">ZMW {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Order Type */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { id: 'cart', label: 'Add to Cart', icon: '🛒' },
                { id: 'reserve', label: 'Dine In', icon: '🍽️' },
                { id: 'checkout', label: 'Order Now', icon: '⚡' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setOrderType(opt.id)}
                  className={`py-3 rounded-xl text-center transition-all text-xs font-medium ${
                    orderType === opt.id
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                      : 'bg-charcoal-800/60 border border-charcoal-700/40 text-cream/40 hover:text-cream/60'
                  }`}
                >
                  <span className="text-lg block mb-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded-lg hover:bg-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
            >
              {orderType === 'cart' && 'Add to Cart'}
              {orderType === 'reserve' && 'Add & Reserve Table'}
              {orderType === 'checkout' && `Order Now — ZMW ${grandTotal.toLocaleString()}`}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
