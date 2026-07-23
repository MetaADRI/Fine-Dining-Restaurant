import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useOrder } from '../context/orderContext';

const statusColors = {
  confirmed: 'bg-blue-500/20 text-blue-400',
  preparing: 'bg-yellow-500/20 text-yellow-400',
  cooking: 'bg-orange-500/20 text-orange-400',
  quality_check: 'bg-purple-500/20 text-purple-400',
  ready: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function OrderHistoryPage() {
  const { orderHistory, reorder, loyaltyPoints } = useOrder();

  return (
    <div className="min-h-screen bg-charcoal-900 text-cream pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/40 hover:text-amber-400 transition-colors text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-cream">
                Order <span className="text-amber-400 italic">History</span>
              </h1>
              <p className="text-cream/40 mt-2">{orderHistory.length} {orderHistory.length === 1 ? 'order' : 'orders'} placed</p>
            </div>
            <div className="bg-charcoal-800 border border-charcoal-700/50 rounded-xl px-5 py-3 text-center">
              <p className="text-amber-400 font-serif text-2xl">{loyaltyPoints}</p>
              <p className="text-cream/30 text-[10px] tracking-wider uppercase">Loyalty Points</p>
            </div>
          </div>
        </motion.div>

        {orderHistory.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-cream/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-cream mb-3">No orders yet</h3>
            <p className="text-cream/40 mb-8">Your order history will appear here</p>
            <Link to="/menu" className="inline-block px-8 py-3 bg-amber-500 text-charcoal-900 font-semibold tracking-wider uppercase text-sm rounded hover:bg-amber-400 transition-all">
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orderHistory.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-lg text-cream">{order.id}</h3>
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                        {order.status === 'cancelled' ? 'Cancelled' : order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-cream/30 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-semibold">ZMW {order.total.toLocaleString()}</p>
                    <p className="text-cream/30 text-xs capitalize">{order.orderType} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 pb-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.image}
                        alt={item.name}
                        title={`${item.name} ×${item.quantity}`}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-charcoal-700"
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-charcoal-700/30">
                  {order.status !== 'cancelled' && (
                    <Link
                      to={`/order/${order.id}`}
                      className="flex-1 py-3 text-center text-cream/50 text-xs tracking-wider uppercase hover:text-amber-400 hover:bg-charcoal-800/50 transition-all border-r border-charcoal-700/30"
                    >
                      {order.status === 'ready' ? 'View Receipt' : 'Track Order'}
                    </Link>
                  )}
                  <button
                    onClick={() => { reorder(order); }}
                    className="flex-1 py-3 text-center text-cream/50 text-xs tracking-wider uppercase hover:text-amber-400 hover:bg-charcoal-800/50 transition-all"
                  >
                    Reorder
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
