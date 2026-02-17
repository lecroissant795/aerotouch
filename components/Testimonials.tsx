import React, { useState, useEffect } from 'react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { testimonialImages } from '../utils/mediaUrls';

const reviews = [
  {
    id: 1,
    headline: "Issues even after walking 18 holes? Not anymore.",
    text: "I used to have major foot fatigue after walking rigorous hikes. Glad I have these now. I actually bought more online for all my shoes.",
    author: "Dat Le",
    role: "Avid Hiker",
    productLink: "Hike Pain Relief",
    image: testimonialImages.james,
    rating: 5
  },
  {
    id: 2,
    headline: "Been recovering from plantar fasciitis and an ankle injury.",
    text: "Recently used these insoles for my long runs training for a marathon and they provided a comfortable cushion support for the tired feet.",
    author: "Cindy Hoang",
    role: "Marathon Runner",
    productLink: "Run Pain Relief",
    image: testimonialImages.cindy,
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate carousel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeReview = reviews[activeIndex];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
               Real Stories. Real Relief.
             </h2>
             <p className="text-xl text-slate-600">
               Join the athletes who trust their feet to AeroTouch.
             </p>
        </div>

        {/* Featured Review - Carousel Layout */}
        <div 
          className="max-w-6xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
              
              {/* Image Side */}
              <div className="w-full md:w-1/2 relative group">
                 {/* Decorative offset background */}
                 <div className="absolute inset-0 bg-slate-100 rounded-lg transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                 
                 <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-200 shadow-sm">
                   <img 
                     key={activeReview.image} // Force re-render for animation if desired, or let src change handle it
                     src={activeReview.image} 
                     alt="Athlete using AeroTouch" 
                     className="w-full h-full object-cover transition-opacity duration-500"
                   />
                 </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 flex flex-col justify-center min-h-[400px]"> {/* min-h prevents jumping */}
                 <div className="mb-8 animate-fade-in">
                   <Quote className="w-8 h-8 text-brand-orange mb-6 fill-current" />
                   
                   <h3 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                     {activeReview.headline}
                   </h3>
                   
                   <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-8">
                     {activeReview.text}
                   </p>

                   <div className="flex items-center gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-brand-lime text-brand-lime" />
                      ))}
                   </div>
                 </div>
                 
                 <div>
                    <p className="font-bold text-slate-900 text-lg mb-4">- {activeReview.author}</p>
                    
                    <button className="group inline-flex items-center text-lg font-bold text-slate-900 border-b-2 border-brand-orange/30 hover:border-brand-orange pb-0.5 transition-all">
                      {activeReview.productLink}
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                 </div>
              </div>

            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-3 mt-16">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'w-12 bg-brand-orange' 
                      : 'w-3 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
        </div>

      </div>
    </section>
  );
};