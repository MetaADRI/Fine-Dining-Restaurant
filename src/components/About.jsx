import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div className="orb orb-1 top-1/4 -left-20" />
      <div className="orb orb-2 bottom-1/4 right-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-black/40">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
              alt="Chef preparing a dish over open flame"
              className="w-full h-[400px] md:h-[500px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-charcoal-800 border border-charcoal-700 rounded-lg px-6 py-4 shadow-xl">
            <p className="text-amber-400 font-serif text-3xl">12+</p>
            <p className="text-cream/60 text-sm tracking-wider uppercase">Years of Excellence</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-amber-400 tracking-[0.2em] uppercase text-sm mb-4 font-sans">
            Our Story
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
            Where <span className="text-amber-400 italic">Fire</span> Meets{' '}
            <span className="text-amber-400 italic">Flavour</span>
          </h2>
          <div className="space-y-4 text-cream/60 leading-relaxed">
            <p>
              Ember & Oak was born from a deep love for Zambia&apos;s culinary traditions
              and a desire to elevate them. Our founder, Chef Chanda Mwila, spent years
              honing his craft across Europe before returning home with a vision:
              to create a dining experience that honours local ingredients while pushing
              culinary boundaries.
            </p>
            <p>
              Every dish on our menu is a conversation between the ancient art of
              fire cooking and modern gastronomic technique. We source from local
              farmers and fishermen, celebrating the bounty of our land in every bite.
            </p>
            <p>
              From the open-flame grill to the carefully curated wine cellar,
              every detail is designed to transport you into a world where food
              is not just sustenance — it is art.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: '100%', label: 'Local Sourcing' },
              { value: 'ZMW 450', label: 'Avg. Per Person' },
              { value: '4.9★', label: 'Guest Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-amber-400 font-serif text-2xl">{stat.value}</p>
                <p className="text-cream/50 text-xs tracking-wider uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
