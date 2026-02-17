import React, { useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'insoles',
    name: 'Insoles',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    description: 'Peak performance'
  },
  {
    id: 'footwear',
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
    description: 'Professional grade'
  },
  {
    id: 'tools',
    name: 'Tools',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced recovery'
  },
  {
    id: 'pads',
    name: 'Pads',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Targeted relief'
  },
  {
    id: 'socks',
    name: 'Socks',
    image: 'https://images.unsplash.com/photo-1582966298431-a1217ec1e695?auto=format&fit=crop&q=80&w=800',
    description: 'Ultimate comfort'
  }
];

interface CategoriesProps {
  onCategoryClick?: (category: string) => void;
}

const CARD_WIDTH_MOBILE = 200;
const GAP = 16;

export const Categories: React.FC<CategoriesProps> = ({ onCategoryClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = CARD_WIDTH_MOBILE + GAP;
    const index = Math.round(scrollLeft / itemWidth);
    const clamped = Math.min(Math.max(0, index), categories.length - 1);
    setActiveIndex(clamped);
  }, []);

  const goToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = CARD_WIDTH_MOBILE + GAP;
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setActiveIndex(index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div
          ref={scrollRef}
          onScroll={updateActiveIndex}
          className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 pb-4 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
        >
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="flex-none w-[200px] md:w-auto group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer snap-start"
              onClick={() => onCategoryClick?.(cat.name)}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <p className="text-xs font-bold text-brand-lime uppercase tracking-wider mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel dots - visible on mobile where the list is scrollable */}
        <div className="flex justify-center gap-2 mt-4 md:hidden" aria-hidden>
          {categories.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === activeIndex
                  ? 'w-6 bg-brand-lime'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};