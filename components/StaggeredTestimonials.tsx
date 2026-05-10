import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewAvatars } from '../utils/mediaUrls';

const TESTIMONIALS = [
  {
    quote: `"If I could give 11 stars, I'd give 12."`,
    author: "- Andre, Head of Design at CreativeSolutions",
    image: reviewAvatars.marcusT
  },
  {
    quote: `"COMPANY's product has made planning for the future seamless. Can't recommend them enough!"`,
    author: "- Marie, CFO at FuturePlanning",
    image: reviewAvatars.sarahJ
  },
  {
    quote: `"This is our favorite solution so far. We work 5x faster with COMPANY."`,
    author: "- Alex, CEO at TechCorp",
    image: reviewAvatars.davidK
  },
  {
    quote: `"I know it's cliche, but we were lost before we found COMPANY. Can't thank you guys enough!"`,
    author: "- Stephanie, COO at InnovateInc",
    image: reviewAvatars.nicoleP
  },
  {
    quote: `"I'm confident my data is safe with COMPANY. I can't say that about other providers."`,
    author: "- Dan, CTO at SecureNet",
    image: reviewAvatars.michaelT
  }
];

export const StaggeredTestimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="py-24 bg-white overflow-hidden relative w-full flex flex-col items-center">
      <div className="relative w-full max-w-5xl h-[350px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {TESTIMONIALS.map((testimonial, i) => {
            // Calculate relative position based on activeIndex
            // Array indices are essentially on a circle
            let relativeOffset = (i - activeIndex + TESTIMONIALS.length) % TESTIMONIALS.length;
            // Map offsets to shifts to center around 0
            if (relativeOffset > TESTIMONIALS.length / 2) {
                relativeOffset -= TESTIMONIALS.length;
            }

            // Only render items close to the center
            if (Math.abs(relativeOffset) > 2) return null;

            const isActive = relativeOffset === 0;

            // X offset
            const xOffset = relativeOffset * 220; // Spacing between cards

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: xOffset + (relativeOffset > 0 ? 50 : -50), scale: 0.8 }}
                animate={{ 
                  opacity: isActive ? 1 : Math.max(0.4 - Math.abs(relativeOffset) * 0.1, 0.1),
                  x: xOffset,
                  scale: isActive ? 1 : 0.85 - Math.abs(relativeOffset) * 0.05,
                  zIndex: TESTIMONIALS.length - Math.abs(relativeOffset)
                }}
                exit={{ opacity: 0, x: xOffset, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleNext();
                  if (info.offset.x > 50) handlePrev();
                }}
                className={`absolute w-[320px] h-[320px] p-8 rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing flex flex-col justify-center ${
                  isActive 
                    ? "bg-[#F97316] text-white overflow-hidden shadow-orange-500/20" 
                    : "bg-white text-slate-800 border border-slate-100 shadow-xl"
                }`}
              >
                  {/* Design Accent for active card */}
                  {isActive && (
                      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                          <div className="absolute top-8 right-8 w-16 h-[2px] bg-white/40 rotate-[45deg] origin-top-right"></div>
                      </div>
                  )}

                  <div className="mb-6 z-10">
                      <img 
                          src={testimonial.image} 
                          alt="Testimonial Author" 
                          className={`w-12 h-12 rounded-xl object-cover ${isActive ? 'border-2 border-white' : ''}`}
                      />
                  </div>
                  
                  <p className={`text-xl font-medium leading-relaxed z-10 ${isActive ? 'text-white' : 'text-slate-800'}`}>
                      {testimonial.quote}
                  </p>

                  <p className={`text-xs mt-auto z-10 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                      {testimonial.author}
                  </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-12 z-20 relative">
        <button 
          onClick={handlePrev}
          className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer hover:border-slate-300"
          aria-label="Previous Testimonial"
        >
          <ChevronLeft className="w-5 h-5 ml-[-2px]" />
        </button>
        <button 
          onClick={handleNext}
          className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer hover:border-slate-300"
          aria-label="Next Testimonial"
        >
          <ChevronRight className="w-5 h-5 mr-[-2px]" />
        </button>
      </div>
    </div>
  );
};
