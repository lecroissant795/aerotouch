import React, { useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'insoles',
    name: 'Insoles',
    description: 'Peak comfort',
    image:
      'https://mhecgxhcmohbmeimrfud.supabase.co/storage/v1/object/public/media/category_photos/cloud%20insole.JPG',
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Advanced recovery',
    image:
      'https://mhecgxhcmohbmeimrfud.supabase.co/storage/v1/object/public/media/category_photos/IMG_5653.JPG',
  },
  {
    id: 'pads',
    name: 'Pads',
    description: 'Targeted relief',
    image:
      'https://mhecgxhcmohbmeimrfud.supabase.co/storage/v1/object/public/media/category_photos/IMG_5654.JPG',
  },
  {
    id: 'socks',
    name: 'Socks',
    description: 'Everyday support',
    image:
      'https://mhecgxhcmohbmeimrfud.supabase.co/storage/v1/object/public/media/category_photos/IMG_5655.PNG',
  },
  {
    id: 'bundle',
    name: 'Bundle',
    routeCategory: 'Bundle Kits',
    description: 'Limited edition kits',
    image:
      'https://mhecgxhcmohbmeimrfud.supabase.co/storage/v1/object/public/media/category_photos/IMG_5656.JPG',
  },
];

interface CategoriesProps {
  onCategoryClick?: (category: string) => void;
}

const GAP = 16;

export const Categories: React.FC<CategoriesProps> = ({ onCategoryClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    // Calculate child width dynamically since it's vw now
    const child = el.firstElementChild as HTMLElement;
    const itemWidth = child ? child.offsetWidth + GAP : 200 + GAP;

    const index = Math.round(scrollLeft / itemWidth);
    const clamped = Math.min(Math.max(0, index), categories.length - 1);
    setActiveIndex(clamped);
  }, []);

  const goToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement;
    const itemWidth = child ? child.offsetWidth + GAP : 200 + GAP;
    
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
              className="flex-none w-[70vw] md:w-full group relative aspect-[3/4.41] md:aspect-[4/5.51] overflow-hidden rounded-2xl cursor-pointer snap-start bg-brand-dark border border-white/5 hover:border-brand-lime/30 transition-all duration-500"
              onClick={() => onCategoryClick?.(('routeCategory' in cat ? (cat as any).routeCategory : cat.name) as string)}
            >
              <img
                src={cat.image}
                alt={`${cat.name} — shop category`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 group-hover:from-black/80 group-hover:via-black/35 transition-all duration-500" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,241,29,0.08),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
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