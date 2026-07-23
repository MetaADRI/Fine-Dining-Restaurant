import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useOrder, ORDER_STATUSES, STATUS_LABELS } from '../context/orderContext';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { orderHistory, simulateProgress, cancelOrder } = useOrder();
  const timerRef = useRef(null);

  const order = orderHistory.find((o) => o.id === orderId);

  useEffect(() => {
    if (!order || order.status === 'ready' || order.status === 'cancelled') return;

    timerRef.current = setInterval(() => {
      simulateProgress(orderId);
    }, 4000);

    return () => clearInterval(timerRef.current);
  }, [order?.status, orderId, simulateProgress]);

  if (!order) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-cream mb-4">Order not found</h2>
          <Link to="/orders" className="text-amber-400 hover:text-amber-300">View all orders</Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = ORDER_STATUSES.indexOf(order.status);
  const isComplete = order.status === 'ready';
  const isCancelled = order.status === 'cancelled';

  const statusEmoji = {
    confirmed: '✓',
    preparing: '🔪',
    cooking: '🔥',
    quality_check: '✨',
    ready: '🎉',
  };

  return (
    <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Link to="/orders" className="inline-flex items-center gap-2 text-cream/40 hover:text-amber-400 transition-colors text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Orders
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">
            Order <span className="text-amber-400 italic">{order.id}</span>
          </h1>
          <p className="text-cream/40 mt-2">
            Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-8 text-center mb-10 ${
            isCancelled
              ? 'bg-red-900/20 border border-red-500/30'
              : isComplete
              ? 'bg-green-900/20 border border-green-500/30'
              : 'bg-charcoal-800/60 border border-amber-500/20'
          }`}
        >
          {isCancelled ? (
            <>
              <p className="text-red-400 text-lg font-semibold">Order Cancelled</p>
              <p className="text-cream/40 text-sm mt-1">This order has been cancelled</p>
            </>
          ) : isComplete ? (
            <>
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-green-400 text-lg font-semibold">Your order is ready!</p>
              <p className="text-cream/40 text-sm mt-1">
                {order.orderType === 'delivery' && 'Our delivery partner is on the way'}
                {order.orderType === 'takeaway' && 'Ready for pickup at the counter'}
                {order.orderType === 'dine-in' && 'Your table is set and food is served'}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl mb-2">{statusEmoji[order.status]}</p>
              <p className="text-amber-400 text-lg font-semibold">{STATUS_LABELS[order.status]}</p>
              <p className="text-cream/40 text-sm mt-1">Estimated completion in ~{Math.max(1, (4 - currentStepIndex) * 5)} min</p>
            </>
          )}
        </motion.div>

        {/* Progress Steps */}
        {!isCancelled && (
          <div className="space-y-0 mb-12">
            {ORDER_STATUSES.map((status, i) => {
              const isDone = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              const historyEntry = order.statusHistory.find((h) => h.status === status);

              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isDone
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-charcoal-900 ring-4 ring-amber-500/20'
                        : 'bg-charcoal-800 text-cream/20 border border-charcoal-700'
                    }`}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    {i < ORDER_STATUSES.length - 1 && (
                      <div className={`w-0.5 h-12 ${isDone ? 'bg-green-500' : 'bg-charcoal-700'}`} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-amber-400' : isDone ? 'text-cream' : 'text-cream/30'}`}>
                      {STATUS_LABELS[status]}
                    </p>
                    {historyEntry && (
                      <p className="text-cream/30 text-xs mt-0.5">
                        {new Date(historyEntry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Order Details */}
        <div className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-6">
          <h3 className="font-serif text-xl text-cream mb-4">Order Details</h3>
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-cream/60">{item.name} ×{item.quantity}</span>
                <span className="text-cream">ZMW {(parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-charcoal-700/50 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-cream/50">
              <span>Type</span>
              <span className="capitalize">{order.orderType}</span>
            </div>
            <div className="flex justify-between text-cream/50">
              <span>Payment</span>
              <span className="capitalize">{order.paymentMethod === 'momo' ? 'Mobile Money' : order.paymentMethod === 'card' ? 'Card' : 'Cash'}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-cream/50">
                <span>Delivery Fee</span>
                <span>ZMW {order.deliveryFee}</span>
              </div>
            )}
            {order.appliedPromo && (
              <div className="flex justify-between text-green-400">
                <span>Promo ({order.appliedPromo.code})</span>
                <span>-ZMW {order.promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-cream text-lg border-t border-charcoal-700/50 pt-2">
              <span>Total Paid</span>
              <span className="text-amber-400">ZMW {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          {!isCancelled && !isComplete && (
            <button
              onClick={() => {
                clearInterval(timerRef.current);
                cancelOrder(orderId);
              }}
              className="px-6 py-3 border border-red-500/30 text-red-400 text-sm rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Cancel Order
            </button>
          )}
          <Link to="/menu" className="flex-1 py-3 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded-lg text-center hover:bg-amber-400 transition-all">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}
