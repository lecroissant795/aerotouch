import React from 'react';

interface GivingBackSectionProps {
  onLearnMore?: () => void;
}

export const GivingBackSection: React.FC<GivingBackSectionProps> = ({ onLearnMore }) => {
  return (
    <section className="bg-[#354f38] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#253326] to-transparent z-0"></div>
        
        <div className="container mx-auto px-0 md:px-0 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
            {/* Text Content */}
            <div className="lg:w-1/2 py-24 px-6 md:px-12 lg:pr-16 lg:pl-24">
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-6 opacity-80">Giving Back</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    AeroTouch donates 1% of annual sales to make a difference.
                </h2>
                <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-md">
                    Your purchase supports initiatives that support foot health accessibility, helping mobility for workers, seniors, athletes, and children, helping people stay active pain-free.
                </p>
                <button
                    onClick={onLearnMore}
                    className="bg-white text-[#253326] px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-brand-lime transition-colors"
                >
                    Learn More
                </button>
            </div>

            {/* Image Content */}
            <div className="lg:w-1/2 w-full h-[500px] lg:h-[700px] relative bg-[#2f3e30]">
                <img
                    src="https://images.unsplash.com/photo-1675345771255-733034aff5a2?q=80&w=1600&auto=format&fit=crop"
                    alt="Family walking together on a path in a park"
                    className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-overlay opacity-90"
                />
                <img
                    src="https://images.unsplash.com/photo-1675345771255-733034aff5a2?q=80&w=1600&auto=format&fit=crop"
                    alt="Family walking together on a path in a park"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                
                {/* Tech Overlays - Recreating the lines/circles from reference */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Horizontal Line */}
                    <div className="absolute top-1/3 left-0 w-full h-px bg-white/40"></div>
                    {/* Vertical Line */}
                    <div className="absolute top-0 left-1/4 h-full w-px bg-white/40"></div>
                    {/* Vertical Line 2 */}
                    <div className="absolute top-0 right-1/4 h-full w-px bg-white/40"></div>
                    
                    {/* Intersections/Dots */}
                    <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"></div>
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"></div>
                    
                    {/* Large circle highlight */}
                    <div className="absolute bottom-[20%] right-[30%] w-64 h-64 border border-white/60 rounded-full"></div>
                    <div className="absolute bottom-[20%] right-[30%] w-2 h-2 bg-white -translate-y-1/2 -translate-x-1/2 absolute top-0 left-1/2 transform -mt-1 shadow-[0_0_10px_white]"></div>
                    
                    {/* Corner markers */}
                    <div className="absolute top-1/3 left-1/4 w-32 h-px bg-white/70"></div>
                    <div className="absolute top-1/3 left-1/4 w-px h-32 bg-white/70"></div>
                </div>
            </div>
        </div>
        </div>
    </section>
  );
};
