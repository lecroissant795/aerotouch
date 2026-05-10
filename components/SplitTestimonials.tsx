import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { reviewAvatars, reviewPhotos } from '../utils/mediaUrls';

const TESTIMONIALS = [
  {
    quote: "AeroTouch insoles completely changed my daily routine. My feet used to ache after a long shift, but now I feel energized and ready to go. The comfort is unmatched.",
    name: "Sophia Bennett",
    role: "Nurse & Active Walker",
    rating: 5,
    avatar: reviewAvatars.sarahJ,
    image: reviewPhotos.sarahJ
  },
  {
    quote: "I've tried dozens of insoles for my flat feet, but these are the only ones that provide the right amount of arch support without feeling too rigid. Excellent quality.",
    name: "Marcus Johnson",
    role: "Marathon Runner",
    rating: 5,
    avatar: reviewAvatars.marcusT,
    image: reviewPhotos.marcusT
  },
  {
    quote: "These are a game changer. The shock absorption is fantastic, especially when I'm playing tennis. I've noticed a significant reduction in knee pain.",
    name: "Elena Rodriguez",
    role: "Tennis Player",
    rating: 5,
    avatar: reviewAvatars.emmaW,
    image: reviewPhotos.emmaW
  }
];

export const SplitTestimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <div className="py-16 md:py-24 bg-slate-50 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 max-w-[1050px]">
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-2xl flex flex-col md:flex-row h-auto md:h-[500px] border border-slate-100">
            {/* Left Side - Text */}
            <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">
              <div className="text-slate-300 mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <div className="min-h-[160px] flex flex-col justify-start">
                <p 
                    key={`quote-${activeIndex}`}
                    className="text-xl md:text-[22px] text-slate-800 font-medium leading-[1.6] mb-6 animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  {current.quote}
                </p>
                
                <div 
                    key={`stars-${activeIndex}`}
                    className="flex items-center gap-1.5 text-amber-400 mb-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-75"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="border-t-2 border-dashed border-slate-100 pt-8 mt-4">
                <div 
                    key={`author-${activeIndex}`}
                    className="flex items-center gap-4 animate-in fade-in duration-500 delay-150"
                >
                  <img 
                    src={current.avatar} 
                    alt={current.name} 
                    className="w-14 h-14 rounded-full object-cover bg-slate-200 border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{current.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{current.role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Image */}
            <div className="w-full md:w-1/2 relative bg-[#D7C9BA] h-[300px] md:h-full">
              <img 
                key={`img-${activeIndex}`}
                src={current.image} 
                alt="Testimonial lifestyle" 
                className="w-full h-full object-cover animate-in fade-in duration-700"
              />
              
              {/* Pagination Dots */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'bg-[#C1F11D] w-8' : 'bg-white/80 hover:bg-white w-2.5'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-slate-600 hover:text-black hover:scale-110 transition-all z-10 border border-slate-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 ml-[-2px]" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6 w-12 h-12 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-slate-600 hover:text-black hover:scale-110 transition-all z-10 border border-slate-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 mr-[-2px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
