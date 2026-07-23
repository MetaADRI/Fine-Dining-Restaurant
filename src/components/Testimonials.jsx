import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Grace Mwangi',
    role: 'Food Critic, Lusaka Times',
    text: 'Ember & Oak redefines what fine dining means in Zambia. The flame-kissed tilapia was unlike anything I have ever tasted — smoky, delicate, and utterly unforgettable.',
    rating: 5,
  },
  {
    name: 'James Phiri',
    role: 'Returning Guest',
    text: 'We celebrate every anniversary here. The atmosphere, the warmth of the staff, and the open-fire ribeye make it our favourite place in Lusaka. Truly special.',
    rating: 5,
  },
  {
    name: 'Amara Banda',
    role: 'Corporate Event Host',
    text: 'Hosted a dinner for 40 guests. Chef Chanda and his team delivered a flawless experience from start to finish. The wine pairings were impeccable.',
    rating: 5,
  },
  {
    name: 'David Kaoma',
    role: 'Travel Blogger',
    text: 'I have dined at Michelin-starred restaurants across Europe and Africa. Ember & Oak holds its own — the fire-cooking technique here is world-class.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-amber-400 tracking-[0.2em] uppercase text-sm mb-4 font-sans">
            What Our Guests Say
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-16">
            Words by the <span className="text-amber-400 italic">Fire</span>
          </h2>
        </motion.div>

        <div className="relative min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="flex justify-center mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400 mx-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-cream/80 text-lg md:text-xl leading-relaxed italic max-w-2xl mx-auto mb-8">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>

              <div>
                <p className="text-cream font-semibold tracking-wide">
                  {testimonials[current].name}
                </p>
                <p className="text-cream/40 text-sm tracking-wider mt-1">
                  {testimonials[current].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-amber-400 w-8'
                  : 'bg-charcoal-600 hover:bg-charcoal-700'
              }`}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
