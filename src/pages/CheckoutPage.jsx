import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder, DELIVERY_FEE } from '../context/orderContext';

const paymentMethods = [
  { id: 'momo', label: 'Mobile Money (MTN/Airtel)', icon: 'M' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'C' },
  { id: 'cash', label: 'Cash on Delivery', icon: '$' },
];

export default function CheckoutPage() {
  const {
    orderItems, subtotal, tax, total, promoDiscount, appliedPromo,
    placeOrder, loyaltyPoints, parsePrice,
  } = useOrder();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('delivery');
  const [payment, setPayment] = useState('momo');
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', notes: '',
    cardNumber: '', cardExpiry: '', cardCvv: '',
    momoNumber: '',
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const deliveryTotal = orderType === 'delivery' ? total + DELIVERY_FEE : total;
  const pointsToUse = Math.min(loyaltyPoints, Math.floor(deliveryTotal * 0.1));
  const pointsDiscount = pointsToUse;
  const finalTotal = deliveryTotal - pointsDiscount;

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-cream mb-4">No items to checkout</h2>
          <Link to="/menu" className="text-amber-400 hover:text-amber-300">Browse the menu</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    const orderId = placeOrder({
      orderType,
      paymentMethod: payment,
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: orderType === 'delivery' ? form.address : null,
      },
      notes: form.notes,
      pointsUsed: pointsToUse,
    });
    navigate(`/order/${orderId}`);
  };

  const step1Valid = form.name && form.phone && form.email &&
    (orderType === 'dine-in' || orderType === 'takeaway' || form.address);

  return (
    <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-cream/40 hover:text-amber-400 transition-colors text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">
            <span className="text-amber-400 italic">Checkout</span>
          </h1>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                step >= s ? 'bg-amber-500 text-charcoal-900' : 'bg-charcoal-800 text-cream/30 border border-charcoal-700'
              }`}>
                {s}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s ? 'text-cream' : 'text-cream/30'}`}>
                {s === 1 ? 'Details' : 'Payment'}
              </span>
              {s < 2 && <div className={`flex-1 h-px ${step > 1 ? 'bg-amber-500' : 'bg-charcoal-700'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Order Type */}
                <div>
                  <label className="block text-cream/50 text-sm tracking-wider uppercase mb-3">Order Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'delivery', label: 'Delivery', desc: 'We bring it to you', fee: `+ZMW ${DELIVERY_FEE}` },
                      { id: 'takeaway', label: 'Takeaway', desc: 'Pick up at restaurant', fee: 'Free' },
                      { id: 'dine-in', label: 'Dine-In', desc: 'Eat at the restaurant', fee: 'Free' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setOrderType(type.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          orderType === type.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-charcoal-700 bg-charcoal-800/40 hover:border-charcoal-600'
                        }`}
                      >
                        <p className={`font-semibold text-sm ${orderType === type.id ? 'text-amber-400' : 'text-cream'}`}>
                          {type.label}
                        </p>
                        <p className="text-cream/40 text-xs mt-1">{type.desc}</p>
                        <p className={`text-xs mt-2 ${orderType === type.id ? 'text-amber-400/70' : 'text-cream/25'}`}>{type.fee}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Full Name</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                      placeholder="John Mwila" />
                  </div>
                  <div>
                    <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                      placeholder="+260 97X XXX XXX" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Email</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                      placeholder="you@email.com" />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Delivery Address</label>
                    <input type="text" name="address" required value={form.address} onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                      placeholder="14 Cairo Road, Rhodes Park, Lusaka" />
                  </div>
                )}

                {orderType === 'dine-in' && (
                  <div>
                    <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Table Preference</label>
                    <select name="notes" value={form.notes} onChange={handleChange}
                      className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-amber-500/50 transition-colors text-sm">
                      <option value="">No preference</option>
                      <option value="Window seat">Window seat</option>
                      <option value="Outdoor terrace">Outdoor terrace</option>
                      <option value="Private booth">Private booth</option>
                      <option value="Near the fireplace">Near the fireplace</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Special Instructions</label>
                  <input type="text" name="notes" value={form.notes} onChange={handleChange}
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    placeholder="Allergies, spice level, celebrations..." />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <label className="block text-cream/50 text-sm tracking-wider uppercase mb-3">Payment Method</label>
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPayment(pm.id)}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                          payment === pm.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-charcoal-700 bg-charcoal-800/40 hover:border-charcoal-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                          payment === pm.id ? 'bg-amber-500 text-charcoal-900' : 'bg-charcoal-700 text-cream/50'
                        }`}>
                          {pm.icon}
                        </div>
                        <span className={`text-sm ${payment === pm.id ? 'text-amber-400 font-semibold' : 'text-cream'}`}>{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {payment === 'card' && (
                  <div className="space-y-4 bg-charcoal-800/40 border border-charcoal-700/40 rounded-xl p-5">
                    <div>
                      <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Card Number</label>
                      <input type="text" name="cardNumber" required value={form.cardNumber} onChange={handleChange}
                        className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 text-sm"
                        placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Expiry</label>
                        <input type="text" name="cardExpiry" required value={form.cardExpiry} onChange={handleChange}
                          className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 text-sm"
                          placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">CVV</label>
                        <input type="text" name="cardCvv" required value={form.cardCvv} onChange={handleChange}
                          className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 text-sm"
                          placeholder="XXX" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                {payment === 'momo' && (
                  <div className="bg-charcoal-800/40 border border-charcoal-700/40 rounded-xl p-5">
                    <label className="block text-cream/50 text-xs tracking-wider uppercase mb-1.5">Mobile Money Number</label>
                    <input type="tel" name="momoNumber" required value={form.momoNumber} onChange={handleChange}
                      className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-amber-500/50 text-sm"
                      placeholder="+260 97X XXX XXX" />
                    <p className="text-cream/30 text-xs mt-2">You will receive a prompt to confirm payment</p>
                  </div>
                )}

                {payment === 'cash' && orderType === 'delivery' && (
                  <div className="bg-charcoal-800/40 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-amber-400/80 text-sm">Please have exact change ready. Our delivery partner will collect payment.</p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)}
                  className="px-6 py-3.5 border border-charcoal-700 text-cream/60 text-sm rounded-lg hover:border-charcoal-600 transition-colors">
                  Back
                </button>
              )}
              <button type="submit"
                className={`flex-1 py-3.5 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded-lg hover:bg-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 ${
                  step === 1 && !step1Valid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={step === 1 && !step1Valid}>
                {step === 1 ? 'Continue to Payment' : `Place Order — ZMW ${finalTotal.toLocaleString()}`}
              </button>
            </div>
          </form>

          {/* Order Review */}
          <div className="lg:col-span-1">
            <div className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-6 sticky top-28">
              <h3 className="font-serif text-xl text-cream mb-4">Your Order</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-cream/60 truncate mr-2">
                      {item.name} ×{item.quantity}
                    </span>
                    <span className="text-cream shrink-0">
                      ZMW {(parsePrice(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-charcoal-700/50 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-cream/50">
                  <span>Subtotal</span>
                  <span>ZMW {subtotal.toLocaleString()}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>{appliedPromo?.code}</span>
                    <span>-ZMW {promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-cream/50">
                    <span>Delivery</span>
                    <span>ZMW {DELIVERY_FEE}</span>
                  </div>
                )}
                {pointsToUse > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>{pointsToUse} loyalty points used</span>
                    <span>-ZMW {pointsDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-cream/50">
                  <span>VAT (16%)</span>
                  <span>ZMW {tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-charcoal-700/50 pt-2 flex justify-between font-bold text-cream text-lg">
                  <span>Total</span>
                  <span className="text-amber-400">ZMW {finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 bg-charcoal-900/50 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-cream/40 text-xs">
                  You have <span className="text-amber-400">{loyaltyPoints}</span> loyalty points
                  {pointsToUse > 0 && ` (using ${pointsToUse})`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
