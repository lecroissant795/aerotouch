import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export const Newsletter: React.FC = () => {
  return (
    <section className="bg-brand-dark py-24 lg:py-32 border-t border-white/5 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-lime/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 lg:gap-24">
          
          {/* Text Block */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
               <div className="flex h-6 px-2 items-center justify-center rounded bg-brand-lime/10 border border-brand-lime/20 backdrop-blur-sm">
                 <Zap className="w-3 h-3 text-brand-lime mr-2" />
                 <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase">Insider Access</span>
               </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
              Don't Miss<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white">A Step.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-8 sm:items-start text-lg text-slate-400 max-w-2xl leading-relaxed">
               <p>
                 Join the AeroTouch squad. Get <span className="text-brand-lime font-bold">10% off</span> your first order, plus early access to new drops and pro training guides.
               </p>
            </div>
          </div>

          {/* Minimal Form Block */}
          <div className="w-full lg:max-w-md mb-2">
             <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <div className="relative">
                    <input 
                    id="email"
                    type="email" 
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-transparent border-b border-slate-700 py-6 pr-16 text-lg md:text-xl font-bold text-white placeholder:text-slate-600 placeholder:font-bold focus:outline-none focus:border-brand-lime transition-colors rounded-none tracking-wide"
                    required
                    />
                    <button 
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white hover:text-brand-lime transition-colors group-focus-within:text-brand-lime"
                    aria-label="Subscribe"
                    >
                    <ArrowRight className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:translate-x-1 duration-300" />
                    </button>
                </div>
                
                {/* Tech Specs / Footer links for form */}
                <div className="mt-4 flex justify-between items-center text-[10px] md:text-xs font-mono text-slate-600 uppercase tracking-wider">
                    <div className="flex gap-4">
                        <span className="hover:text-slate-400 cursor-pointer transition-colors">Data Privacy</span>
                        <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
                    </div>
                    <span>Secure//Encrypted</span>
                </div>
             </form>
          </div>

        </div>
      </div>
    </section>
  );
};