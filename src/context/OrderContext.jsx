import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OrderContext = createContext();

export function useOrder() {
  return useContext(OrderContext);
}

function parsePrice(priceStr) {
  return parseInt(priceStr.replace(/[^\d]/g, ''), 10);
}

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(`ember_oak_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(`ember_oak_${key}`, JSON.stringify(value));
  } catch { /* storage full */ }
}

function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'EO-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const ORDER_STATUSES = ['confirmed', 'preparing', 'cooking', 'quality_check', 'ready'];

const STATUS_LABELS = {
  confirmed: 'Order Confirmed',
  preparing: 'Preparing Your Order',
  cooking: 'Cooking Over Open Flame',
  quality_check: 'Quality Check',
  ready: 'Ready for You',
};

const DELIVERY_FEE = 50;

export { ORDER_STATUSES, STATUS_LABELS, DELIVERY_FEE };

export function OrderProvider({ children }) {
  const [orderItems, setOrderItems] = useState(() => loadFromStorage('cart', []));
  const [orderHistory, setOrderHistory] = useState(() => loadFromStorage('history', []));
  const [activeOrder, setActiveOrder] = useState(() => loadFromStorage('active', null));
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => loadFromStorage('points', 0));
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => saveToStorage('cart', orderItems), [orderItems]);
  useEffect(() => saveToStorage('history', orderHistory), [orderHistory]);
  useEffect(() => saveToStorage('active', activeOrder), [activeOrder]);
  useEffect(() => saveToStorage('points', loyaltyPoints), [loyaltyPoints]);

  const addItem = useCallback((meal, quantity) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === meal.id);
      if (existing) {
        return prev.map((i) =>
          i.id === meal.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...meal, quantity }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setOrderItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setOrderItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearOrder = useCallback(() => {
    setOrderItems([]);
    setAppliedPromo(null);
  }, []);

  const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = orderItems.reduce(
    (sum, i) => sum + parsePrice(i.price) * i.quantity,
    0
  );

  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? Math.round(subtotal * (appliedPromo.value / 100))
      : appliedPromo.value
    : 0;

  const tax = Math.round((subtotal - promoDiscount) * 0.16);
  const total = subtotal - promoDiscount + tax;

  const applyPromo = useCallback((code) => {
    const promos = {
      FIRE10: { type: 'percent', value: 10, label: '10% off' },
      EMBER50: { type: 'flat', value: 50, label: 'ZMW 50 off' },
      FIRST15: { type: 'percent', value: 15, label: '15% off first order' },
      OAK20: { type: 'flat', value: 20, label: 'ZMW 20 off' },
    };
    const promo = promos[code.toUpperCase()];
    if (promo) {
      setAppliedPromo({ ...promo, code: code.toUpperCase() });
      return true;
    }
    return false;
  }, []);

  const removePromo = useCallback(() => setAppliedPromo(null), []);

  const placeOrder = useCallback((orderDetails) => {
    const order = {
      id: generateOrderId(),
      items: [...orderItems],
      ...orderDetails,
      subtotal,
      promoDiscount,
      appliedPromo: appliedPromo ? { code: appliedPromo.code, label: appliedPromo.label } : null,
      tax,
      total: orderDetails.orderType === 'delivery' ? total + DELIVERY_FEE : total,
      deliveryFee: orderDetails.orderType === 'delivery' ? DELIVERY_FEE : 0,
      status: 'confirmed',
      statusHistory: [{ status: 'confirmed', time: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };

    setOrderHistory((prev) => [order, ...prev]);
    setActiveOrder(order);
    setOrderItems([]);
    setAppliedPromo(null);

    const pointsEarned = Math.floor(order.total / 10);
    setLoyaltyPoints((prev) => prev + pointsEarned);

    return order.id;
  }, [orderItems, subtotal, promoDiscount, tax, total, appliedPromo]);

  const simulateProgress = useCallback((orderId) => {
    setOrderHistory((prev) => {
      const idx = prev.findIndex((o) => o.id === orderId);
      if (idx === -1) return prev;
      const order = prev[idx];
      const currentIdx = ORDER_STATUSES.indexOf(order.status);
      if (currentIdx >= ORDER_STATUSES.length - 1) return prev;

      const nextStatus = ORDER_STATUSES[currentIdx + 1];
      const updated = {
        ...order,
        status: nextStatus,
        statusHistory: [
          ...order.statusHistory,
          { status: nextStatus, time: new Date().toISOString() },
        ],
      };

      const newList = [...prev];
      newList[idx] = updated;

      if (nextStatus === 'ready') {
        setActiveOrder(null);
      } else {
        setActiveOrder(updated);
      }

      return newList;
    });
  }, []);

  const reorder = useCallback((order) => {
    setOrderItems(order.items.map((item) => ({ ...item })));
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setOrderHistory((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled', cancelledAt: new Date().toISOString() } : o
      )
    );
    setActiveOrder((prev) => (prev?.id === orderId ? null : prev));
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        addItem,
        removeItem,
        updateQuantity,
        clearOrder,
        totalItems,
        subtotal,
        tax,
        total,
        promoDiscount,
        appliedPromo,
        applyPromo,
        removePromo,
        parsePrice,
        orderHistory,
        activeOrder,
        placeOrder,
        simulateProgress,
        reorder,
        cancelOrder,
        loyaltyPoints,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
