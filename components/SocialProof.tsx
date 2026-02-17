import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1552674605-469555942da2?q=80&w=1200&auto=format&fit=crop',
    tag: 'THE RUNS WE LOVE',
    caption: 'Lace up. Meet up. Log the miles.',
    gridClass: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=800&auto=format&fit=crop',
    tag: 'THE RUNS WE LOVE',
    caption: 'Sunday long run crew.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
    tag: 'TRAIL TESTED',
    caption: 'Elevation gain: 1120ft',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=800&auto=format&fit=crop',
    tag: 'RUNNER APPROVED',
    caption: 'Trail tested, runner approved.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tag: 'THE RUNS WE LOVE',
    caption: 'Mountain views.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f271?q=80&w=800&auto=format&fit=crop',
    tag: 'GYM LIFE',
    caption: 'Ridge run.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?q=80&w=800&auto=format&fit=crop',
    tag: 'THE 5 AM RUN',
    caption: '5AM Club.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    tag: 'NEW FEELS',
    caption: 'Instant comfort.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    tag: 'NEW MOVES',
    caption: 'Performance boost.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800&auto=format&fit=crop',
    tag: 'ACTIVE',
    caption: 'Recovery mode.',
    gridClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop',
    tag: 'PATTERN',
    caption: 'Premium tech.',
    gridClass: 'md:col-span-2 md:row-span-1'
  }
];

export const SocialProof: React.FC = () => {
  return (
    <section className="bg-slate-50 border-t border-slate-100 py-24 relative">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
        <div className="max-w-xl">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-slate-200 border border-slate-300">
               <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">@AeroTouch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
            Community <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange/60">Bulletin Board</span>
            </h2>
            <p className="text-slate-500 text-lg">
            Real athletes. Real results. Tag us to get pinned.
            </p>
        </div>
        
        <a 
          href="#" 
          className="hidden md:inline-flex items-center font-bold text-slate-900 hover:text-brand-orange transition-colors group"
        >
          <Instagram className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          View All Posts
          <ArrowUpRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>
      </div>

      {/* Grid Board (Bulletin Board) - Full Width */}
      <div className="w-full px-1 md:px-2 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-2">
            {posts.map((post) => (
            <div key={post.id} className={`group relative cursor-pointer overflow-hidden ${post.gridClass}`}>
                <div className="relative h-full w-full bg-slate-200">
                    <img 
                        src={post.image} 
                        alt={post.caption} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Minimal Overlay for Tag */}
                    <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <span className="inline-block bg-brand-lime text-brand-dark text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
                            {post.tag}
                         </span>
                    </div>

                    {/* Simple Bottom Caption - Pinned Style Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-[10px] font-bold text-white uppercase tracking-tight">{post.caption}</p>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>
        
        {/* Mobile View All Link */}
        <div className="mt-16 text-center md:hidden">
             <a 
                href="#" 
                className="inline-flex items-center font-bold text-slate-900 border-b-2 border-brand-lime"
                >
                <Instagram className="w-5 h-5 mr-2" />
                View All Posts
            </a>
        </div>
    </section>
  );
};
