import React from 'react';
import { ShieldCheck, Activity, Zap, Scale, X, Check } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="pt-24 pb-12 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Content - The "Problem" & Hook */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 w-full overflow-hidden">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-orange-50 border border-orange-100">
               <span className="text-xs font-bold text-brand-orange tracking-widest uppercase">The AeroTouch Difference</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Why ordinary insoles <span className="text-brand-orange underline decoration-brand-orange/40 decoration-4 underline-offset-4">fail you.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Most insoles are just stamped foam. They flatten out within weeks and provide zero structural support. 
              <br/><br/>
              Your feet are complex machines. We built an engine to power them.
            </p>

            {/* Comparison Module - Simplified */}
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
                {/* The Old Way */}
                <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-500 mt-1">
                        <X className="w-3 h-3" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1 line-through decoration-red-300 decoration-2">Generic Foam</p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Flattens out in 2-3 weeks. Static support that fights your natural movement.
                        </p>
                    </div>
                </div>

                {/* The New Way */}
                <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0 text-brand-lime mt-1 shadow-lg shadow-brand-lime/20">
                        <Check className="w-3 h-3" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-1">The AeroTouch Standard</p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Maintains structural integrity for 500+ miles. Dynamic flex returns 85% energy.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Content - The "Solution" Grid */}
          <div className="lg:w-2/3 grid md:grid-cols-2 gap-6 pb-12">
             {/* Feature 1 */}
             <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 border border-transparent hover:border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-orange">
                   <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Arch Support</h3>
                <p className="text-slate-500 leading-relaxed">
                  Unlike static plastic, our adaptive carbon fiber blend flexes with your foot, stabilizing your arch through the entire gait cycle without locking it in place.
                </p>
             </div>

             {/* Feature 2 - Highlighted */}
             <div className="p-8 rounded-3xl bg-brand-dark text-white shadow-xl shadow-slate-200/50 transform md:translate-y-12">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-brand-lime">
                   <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">85% Energy Return</h3>
                <p className="text-slate-300 leading-relaxed">
                  Proprietary AeroFoam™ creates a trampoline effect, returning energy to your stride and reducing fatigue by up to 30% on long runs.
                </p>
             </div>

             {/* Feature 3 */}
             <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 border border-transparent hover:border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-orange">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Impact Protection</h3>
                <p className="text-slate-500 leading-relaxed">
                  Deep heel cup creates a natural cradle for your heel fat pad, utilizing your body's own shock absorption mechanisms rather than replacing them.
                </p>
             </div>

             {/* Feature 4 */}
             <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300 border border-transparent hover:border-slate-200 md:translate-y-12">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-orange">
                   <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Featherlight Chassis</h3>
                <p className="text-slate-500 leading-relaxed">
                  We removed bulk where it wasn't needed. At just 45g, you get heavy-duty support that feels like it's barely there.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};