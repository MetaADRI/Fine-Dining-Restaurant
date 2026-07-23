import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../context/orderContext';

export default function Reservation() {
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', guests: '2', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { orderItems, updateQuantity, removeItem, subtotal, tax, total, clearOrder } = useOrder();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleNewReservation = () => {
    setSubmitted(false);
    clearOrder();
    setForm({ name: '', email: '', date: '', time: '', guests: '2', message: '' });
  };

  return (
    <section id="reservation" className="relative py-24 md:py-32 bg-charcoal-800/30 overflow-hidden">
      <div className="orb orb-2 top-1/3 -right-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <p className="text-amber-400 tracking-[0.2em] uppercase text-sm mb-4 font-sans">
            Reservations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight">
            Save Your <span className="text-amber-400 italic">Seat</span>
          </h2>
          <p className="text-cream/50 mt-4 max-w-lg mx-auto">
            Book your table at Ember & Oak and let us create an unforgettable evening for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: '-50px' }}
          className="bg-charcoal-900/80 backdrop-blur-sm border border-charcoal-700/50 rounded-xl p-8 md:p-12"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-3xl text-cream mb-3">Reservation Confirmed</h3>
              <p className="text-cream/60 mb-2">
                Thank you, {form.name}. We will send a confirmation to {form.email}.
              </p>
              {orderItems.length > 0 && (
                <p className="text-amber-400 text-sm mb-1">
                  Your order of ZMW {total.toLocaleString()} has been placed.
                </p>
              )}
              <p className="text-cream/40 text-sm">
                Date: {form.date} at {form.time} • {form.guests} {Number(form.guests) === 1 ? 'Guest' : 'Guests'}
              </p>
              <p className="text-cream/50 mt-4 italic">See you at Ember & Oak!</p>
              <button
                onClick={handleNewReservation}
                className="mt-8 px-8 py-3 border border-amber-500/50 text-amber-400 rounded text-sm tracking-wider uppercase hover:bg-amber-500 hover:text-charcoal-900 transition-all duration-300"
              >
                Make Another Reservation
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-cream/50 text-sm tracking-wider uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/50 text-sm tracking-wider uppercase mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-cream/50 text-sm tracking-wider uppercase mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={form.date}
                      onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-cream focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/50 text-sm tracking-wider uppercase mb-2">Time</label>
                    <select
                      name="time"
                      required
                      value={form.time}
                      onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-cream focus:outline-none focus:border-amber-500/50 transition-colors"
                    >
                      <option value="">Select time</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="18:30">6:30 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="19:30">7:30 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="20:30">8:30 PM</option>
                      <option value="21:00">9:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cream/50 text-sm tracking-wider uppercase mb-2">Party Size</label>
                    <select
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-cream focus:outline-none focus:border-amber-500/50 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                      <option value="9+">Private Event (9+)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-cream/50 text-sm tracking-wider uppercase mb-2">
                    Special Requests
                  </label>
                  <input
                    type="text"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Dietary needs, celebrations..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded hover:bg-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
                >
                  {orderItems.length > 0
                    ? `Confirm Reservation — ZMW ${total.toLocaleString()}`
                    : 'Confirm Reservation'}
                </button>
                <p className="text-cream/30 text-xs text-center">
                  Average spend: ZMW 450–700 per person • Deposits required for parties of 8+
                </p>
              </form>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-6 sticky top-28">
                  <h3 className="font-serif text-xl text-cream mb-1">Your Order</h3>
                  <p className="text-cream/30 text-xs mb-5">
                    {orderItems.length === 0
                      ? 'No items yet — click a dish to add'
                      : `${orderItems.length} ${orderItems.length === 1 ? 'item' : 'items'} selected`}
                  </p>

                  <AnimatePresence>
                    {orderItems.length === 0 ? (
                      <div className="py-10 text-center">
                        <div className="w-14 h-14 bg-charcoal-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-7 h-7 text-cream/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-cream/25 text-sm">Browse the menu and add dishes</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {orderItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            className="flex items-center gap-3 bg-charcoal-900/50 rounded-lg p-3"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-cream text-sm font-medium truncate">{item.name}</p>
                              <p className="text-amber-400 text-xs">{item.price} each</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded bg-charcoal-700 text-cream/60 flex items-center justify-center hover:bg-charcoal-600 text-sm"
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-cream text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded bg-charcoal-700 text-cream/60 flex items-center justify-center hover:bg-charcoal-600 text-sm"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-cream text-sm font-medium">
                                ZMW {(parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.quantity).toLocaleString()}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-400/60 text-[10px] hover:text-red-400 uppercase tracking-wider"
                              >
                                Remove
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  {orderItems.length > 0 && (
                    <div className="border-t border-charcoal-700/50 mt-5 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-cream/50">
                        <span>Subtotal</span>
                        <span>ZMW {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-cream/50">
                        <span>VAT (16%)</span>
                        <span>ZMW {tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-cream text-lg border-t border-charcoal-700/50 pt-2">
                        <span>Total</span>
                        <span className="text-amber-400">ZMW {total.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={clearOrder}
                        className="w-full mt-3 py-2 text-cream/30 text-xs tracking-wider uppercase hover:text-red-400 transition-colors"
                      >
                        Clear Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
