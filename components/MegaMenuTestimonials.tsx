import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewAvatars } from '../utils/mediaUrls';

interface Review {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Queenie Hong',
    role: 'School Teacher',
    quote: '"I\'m on my feet between lessons, recess, and hall duty all day. AeroTouch is the only insole that actually eliminated my plantar fasciitis pain after the first week."',
    image: reviewAvatars.queenieHong,
  },
  {
    id: 2,
    name: 'James Carter',
    role: 'Construction Foreman',
    quote: '"12 hour shifts on concrete used to destroy my feet. These insoles gave me my evenings back — no more soaking, no more pain."',
    image: reviewAvatars.marcusT,
  },
  {
    id: 3,
    name: 'Emily Zhang',
    role: 'Registered Nurse',
    quote: '"Standing all day in the ward was taking a toll. Since switching to AeroTouch, my back pain has completely disappeared."',
    image: reviewAvatars.emmaW,
  },
  {
    id: 4,
    name: 'David Okonkwo',
    role: 'Personal Trainer',
    quote: '"I recommend AeroTouch to every single one of my clients. The arch support is unmatched and they last forever."',
    image: reviewAvatars.davidK,
  },
  {
    id: 5,
    name: 'Maria Santos',
    role: 'Retail Manager',
    quote: '"I was skeptical at first but the results spoke for themselves. Within two weeks my knee pain was gone and I\'m back to hiking."',
    image: reviewAvatars.nicoleP,
  },
];

const imageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const textVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  }),
};

export const MegaMenuTestimonials: React.FC = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex(([prev]) => {
      let next = prev + newDirection;
      if (next < 0) next = REVIEWS.length - 1;
      if (next >= REVIEWS.length) next = 0;
      return [next, newDirection];
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  const review = REVIEWS[currentIndex];

  // Show up to 3 thumbnail previews (excluding current)
  const thumbnails = REVIEWS.filter((_, i) => i !== currentIndex).slice(0, 3);

  return (
    <div className="flex gap-4 h-full">
      {/* Vertical "REVIEWS" label — desktop only */}
      <div className="hidden lg:flex flex-col items-center justify-between py-1 flex-shrink-0">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em] [writing-mode:vertical-lr] rotate-180 select-none">
          Reviews
        </span>
        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')} / {String(REVIEWS.length).padStart(2, '0')}
        </span>
      </div>

      {/* Image column */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        {/* Main image */}
        <div className="w-[140px] h-[180px] rounded-2xl overflow-hidden relative bg-slate-100">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={review.id}
              src={review.image}
              alt={review.name}
              className="absolute inset-0 w-full h-full object-cover"
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-1.5">
          {thumbnails.map((t) => {
            const originalIndex = REVIEWS.findIndex((r) => r.id === t.id);
            return (
              <button
                key={t.id}
                onClick={() => goTo(originalIndex)}
                className="w-[44px] h-[44px] rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-orange/40 transition-all opacity-60 hover:opacity-100 bg-slate-100"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Text + controls column */}
      <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={review.id}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-[11px] text-slate-400 font-medium mb-0.5">{review.role}</p>
            <p className="text-sm font-bold text-slate-900 mb-3">{review.name}</p>
            <p className="text-[13px] leading-relaxed text-slate-700 font-serif italic line-clamp-5">
              {review.quote}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => paginate(-1)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-brand-orange transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
