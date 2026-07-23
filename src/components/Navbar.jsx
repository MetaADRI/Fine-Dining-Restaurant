import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../context/orderContext';

const navLinks = [
  { label: 'About', href: '#about', isRoute: false },
  { label: 'Menu', href: '/menu', isRoute: true },
  { label: 'Testimonials', href: '#testimonials', isRoute: false },
  { label: 'Orders', href: '/orders', isRoute: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { totalItems, activeOrder } = useOrder();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (e, link) => {
    setMobileOpen(false);
    if (!link.isRoute && !isHome) {
      e.preventDefault();
      navigate(link.href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-charcoal-900/90 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-wide text-amber-400">
          Ember <span className="text-cream">&</span> Oak
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-cream/70 hover:text-amber-400 transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-cream/70 hover:text-amber-400 transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                {link.label}
              </a>
            )
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 text-cream/70 hover:text-amber-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-charcoal-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* Active Order Indicator */}
          {activeOrder && activeOrder.status !== 'ready' && (
            <Link
              to={`/order/${activeOrder.id}`}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500/15 border border-green-500/30 rounded-full text-green-400 text-xs font-medium hover:bg-green-500/25 transition-all"
            >
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </Link>
          )}

          <Link
            to="/"
            className="ml-2 px-6 py-2 bg-amber-500 text-charcoal-900 font-semibold text-sm tracking-wider rounded hover:bg-amber-400 transition-all duration-300 hover:scale-105"
            onClick={(e) => {
              if (!isHome) {
                e.preventDefault();
                navigate('/#reservation');
              }
            }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative p-2 text-cream/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-charcoal-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-cream focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-charcoal-900/95 backdrop-blur-md border-t border-charcoal-700"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-cream/70 hover:text-amber-400 transition-colors text-sm tracking-widest uppercase py-2"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="text-cream/70 hover:text-amber-400 transition-colors text-sm tracking-widest uppercase py-2"
                >
                  {link.label}
                </a>
              )
            )}
            {activeOrder && activeOrder.status !== 'ready' && (
              <Link
                to={`/order/${activeOrder.id}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-green-400 text-sm tracking-wider uppercase py-2"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Tracking Order {activeOrder.id}
              </Link>
            )}
            <a
              href="#reservation"
              onClick={(e) => {
                setMobileOpen(false);
                if (!isHome) {
                  e.preventDefault();
                  navigate('/#reservation');
                }
              }}
              className="px-6 py-3 bg-amber-500 text-charcoal-900 font-semibold text-sm tracking-wider rounded text-center hover:bg-amber-400 transition-all duration-300"
            >
              Book Now
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
