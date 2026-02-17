import React from 'react';
import { Button } from './Button';
import { Star } from 'lucide-react';
import { miscImages } from '../utils/mediaUrls';

export const TrustedPartners: React.FC = () => {
  return (
    <section className="w-full bg-brand-light overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[520px]">
        {/* Left Side: Image Content */}
        <div className="w-full md:w-1/2 relative overflow-hidden min-h-[320px]">
          <img
            src={miscImages.foamPad}
            alt="Foam pad detail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full md:w-1/2 flex items-center bg-[#F2F2F2] px-8 py-16 md:px-16 lg:px-24">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-[1.1] mb-8">
              ENGINEERED FOR ALL-DAY COMFORT <span className="text-brand-orange">ANYWHERE LIFE TAKES YOU</span>
            </h2>
            
            <div className="space-y-5 text-slate-700 text-lg md:text-xl leading-relaxed mb-8">
              <p>
                AeroTouch insoles are designed to <span className="font-bold italic">move with you</span> From long workdays and workouts to travel, errands, and everything in between, they deliver consistent comfort and support you can actually feel.
              </p>
              
              <p className="font-bold text-brand-dark pt-2">
                Standing all day? Walking miles? On your feet nonstop?
Your comfort shouldn’t be optional.
              </p>
            </div>

            <Button 
              variant="secondary"
              className="bg-black hover:bg-brand-orange transition-colors duration-300 px-10 py-5 text-lg font-black uppercase tracking-widest rounded-none mb-8"
            >
              Shop Our Biggest Sale
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <span className="text-brand-dark font-semibold tracking-tight text-lg">
                10000
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};