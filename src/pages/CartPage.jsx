import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useOrder } from '../context/orderContext';

export default function CartPage() {
  const {
    orderItems, updateQuantity, removeItem, clearOrder,
    subtotal, tax, total, promoDiscount, appliedPromo,
    applyPromo, removePromo, totalItems, parsePrice, loyaltyPoints,
  } = useOrder();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromo(promoInput.trim());
    if (success) {
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-cream/40 hover:text-amber-400 transition-colors text-sm mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">
            Your <span className="text-amber-400 italic">Cart</span>
          </h1>
          <p className="text-cream/40 mt-2">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
          </p>
        </motion.div>

        {orderItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-cream/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-cream mb-3">Your cart is empty</h3>
            <p className="text-cream/40 mb-8">Browse our menu and add some delicious dishes</p>
            <Link
              to="/menu"
              className="inline-block px-8 py-3 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded hover:bg-amber-400 transition-all duration-300"
            >
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {orderItems.map((item) => {
                  const unitPrice = parsePrice(item.price);
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100, height: 0 }}
                      className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-4 flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-lg text-cream truncate">{item.name}</h3>
                            <p className="text-cream/30 text-xs">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-cream/30 hover:text-red-400 transition-colors shrink-0 p-1"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-charcoal-900 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-cream font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-400 font-semibold">ZMW {lineTotal.toLocaleString()}</p>
                            <p className="text-cream/30 text-[10px]">{item.price} each</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={clearOrder}
                  className="text-cream/30 text-sm hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
                <Link to="/menu" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
                  + Add more items
                </Link>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-6 sticky top-28">
                <h3 className="font-serif text-xl text-cream mb-5">Order Summary</h3>

                {/* Promo Code */}
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-5">
                    <div>
                      <span className="text-amber-400 font-semibold text-sm">{appliedPromo.code}</span>
                      <span className="text-cream/40 text-xs ml-2">{appliedPromo.label}</span>
                    </div>
                    <button onClick={removePromo} className="text-cream/40 hover:text-red-400 text-xs">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2 mb-5">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                      placeholder="Promo code"
                      className="flex-1 bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal-700 text-cream/70 text-sm rounded-lg hover:bg-charcoal-600 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-red-400 text-xs mb-4">{promoError}</p>}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-cream/50">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>ZMW {subtotal.toLocaleString()}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Promo discount</span>
                      <span>-ZMW {promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-cream/50">
                    <span>VAT (16%)</span>
                    <span>ZMW {tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-charcoal-700/50 pt-3 flex justify-between font-semibold text-cream text-lg">
                    <span>Total</span>
                    <span className="text-amber-400">ZMW {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 bg-charcoal-900/50 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-cream/40 text-xs">
                    Earn <span className="text-amber-400">+{Math.floor(total / 10)}</span> loyalty points
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full py-4 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded-lg text-center hover:bg-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 mt-6"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-cream/20 text-[10px] text-center mt-3">
                  Try promo codes: FIRE10, EMBER50, OAK20
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
