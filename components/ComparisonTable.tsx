import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

const comparisonData = [
  {
    feature: 'Prevents overpronation',
    aerotouch: true,
    drugStore: false,
    custom: true,
    standard: false,
  },
  {
    feature: 'Comfortable',
    aerotouch: true,
    drugStore: false,
    custom: false,
    standard: false,
  },
  {
    feature: 'Affordable',
    aerotouch: true,
    drugStore: true,
    custom: false,
    standard: true,
  },
  {
    feature: 'Molds to the way you walk',
    aerotouch: true,
    drugStore: false,
    custom: false,
    standard: false,
  },
  {
    feature: 'Sustainably made',
    aerotouch: true,
    drugStore: false,
    custom: false,
    standard: false,
  },
];

export const ComparisonTable: React.FC<{ onShopNow: () => void }> = ({ onShopNow }) => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col gap-12 items-center">
          
          {/* Top Section: Content Centered */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase">
              How We Compare
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-bold leading-snug">
              See how AeroTouch stacks up against other insole options
            </p>
            <div className="pt-2">
              <button
                onClick={onShopNow}
                className="inline-flex items-center justify-center bg-black text-white font-black text-sm uppercase tracking-widest px-10 py-5 rounded-full hover:bg-brand-lime hover:text-black hover:shadow-xl transition-all duration-300"
              >
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Bottom Section: Table Card Full Width */}
          <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-900/5 overflow-hidden border border-slate-100">
            {/* Mobile hint: show scroll affordance */}
            <div className="px-5 pt-5 md:hidden">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Swipe to compare
                </span>
                <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-brand-orange">
                  <span>Scroll</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="relative">
              {/* Subtle edge fades (mobile only) to suggest horizontal scroll */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent md:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent md:hidden"
                aria-hidden
              />

              <div className="comparison-scroll overflow-x-auto scroll-smooth md:scrollbar-hide">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="p-8 text-left w-1/4"></th>
                    <th className="p-8 text-center w-1/4 relative">
                      <div className="absolute inset-0 bg-slate-50 opacity-100 rounded-t-2xl m-2 mb-0" />
                      <span className="relative z-10 text-3xl font-black text-brand-orange tracking-tighter">AeroTouch</span>
                    </th>
                    <th className="p-8 text-center w-1/4 relative z-10">
                       <div className="inline-block bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-black italic shadow-sm">Drug Store</div>
                    </th>
                    <th className="p-8 text-center w-1/4 text-sm font-black text-slate-400 uppercase tracking-tighter leading-none px-4">
                       Custom from<br />Podiatrist
                    </th>
                    <th className="p-8 text-center w-1/4 text-sm font-black text-slate-400 uppercase tracking-tighter leading-none px-4">
                       Standard<br />shoe insole
                    </th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {comparisonData.map((item, idx) => (
                    <tr key={idx} className="border-t border-slate-100">
                      <td className="p-6 md:p-8 text-sm md:text-base font-black text-slate-900 uppercase tracking-tight">
                        {item.feature}
                      </td>
                      <td className="p-6 md:p-8 text-center relative">
                        <div className="absolute inset-y-0 left-2 right-2 bg-slate-50 z-0" />
                        <div className="relative z-10 flex justify-center">
                          <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center shadow-sm">
                            <Check className="w-5 h-5 text-brand-dark" strokeWidth={3} />
                          </div>
                        </div>
                      </td>
                      <td className="p-6 md:p-8 text-center">
                        <div className="flex justify-center">
                          {item.drugStore ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 flex items-center justify-center">
                              <X className="w-4 h-4 text-slate-400" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6 md:p-8 text-center">
                        <div className="flex justify-center">
                          {item.custom ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 flex items-center justify-center">
                              <X className="w-4 h-4 text-slate-400" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6 md:p-8 text-center">
                        <div className="flex justify-center">
                          {item.standard ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 flex items-center justify-center">
                              <X className="w-4 h-4 text-slate-400" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* AeroTouch column bottom rounding */}
                  <tr className="h-6">
                    <td></td>
                    <td className="relative">
                       <div className="absolute inset-0 top-0 left-2 right-2 bg-slate-50 rounded-b-2xl mb-2" />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>

            {/* Visible scrollbar affordance (mobile only) */}
            <div className="md:hidden px-5 pb-5 pt-3">
              <div className="h-2 w-full rounded-full bg-slate-100" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
