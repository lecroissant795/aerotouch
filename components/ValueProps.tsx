import React from 'react';
import { Stethoscope, Footprints, PenTool, Fingerprint, Package } from 'lucide-react';

const valueProps = [
  {
    icon: Stethoscope,
    title: 'Designed with Doctors',
    description: 'Closely mimics the functional properties of custom orthotics',
  },
  {
    icon: Footprints,
    title: 'Prevents Injury & Pain',
    description: 'Custom support stabilizes and protects your body',
  },

  {
    icon: Fingerprint,
    title: 'Custom Cloud Technology',
    description: 'For flat feet, high arches, and everything in between',
  },
  {
    icon: Package,
    title: '60-Day Comfort Guarantee',
    description: 'Your first steps with AeroTouch are 100% risk-free',
  },
];

export const ValueProps: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#F6F4EE] border-y border-slate-200/50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 justify-center">
          {valueProps.map((prop, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FFBC42] flex items-center justify-center mb-5 md:mb-6 shadow-sm hover:scale-105 transition-transform duration-300">
                <prop.icon className="w-10 h-10 md:w-12 md:h-12 text-[#133A2E]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[#133A2E] text-base md:text-lg font-bold leading-tight mb-2.5">
                {prop.title}
              </h3>
              <p className="text-[#133A2E]/80 text-[13px] md:text-sm font-medium leading-snug px-2">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
