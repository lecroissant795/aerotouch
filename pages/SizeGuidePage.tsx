import React, { useState } from 'react';
import { Button } from '../components/Button';
import { 
  Ruler,
  CheckCircle,
  Info,
  Scissors,
  ArrowRight,
  AlertCircle,
  Footprints,
  HelpCircle,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';

type GenderFilter = 'all' | 'women' | 'men';
type ShoeSize = number;

interface SizeChart {
  size: string;
  womenUS: string;
  menUS: string;
  eu: string;
  uk: string;
  cm: string;
  recommended: boolean;
}

const sizeChartData: SizeChart[] = [
  { size: 'XS', womenUS: '4-6', menUS: '-', eu: '35-37', uk: '2-4', cm: '21.5-23', recommended: false },
  { size: 'S', womenUS: '6.5-8.5', menUS: '5-7', eu: '37.5-39.5', uk: '4.5-6.5', cm: '23.5-25', recommended: true },
  { size: 'M', womenUS: '9-11', menUS: '7.5-9.5', eu: '40-42.5', uk: '7-9', cm: '25.5-27', recommended: true },
  { size: 'L', womenUS: '11.5+', menUS: '10-12', eu: '43-45', uk: '9.5-11.5', cm: '27.5-29', recommended: true },
  { size: 'XL', womenUS: '-', menUS: '12.5+', eu: '45.5+', uk: '12+', cm: '29.5+', recommended: false },
];

export const SizeGuidePage: React.FC = () => {
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [shoeSize, setShoeSize] = useState<string>('');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  const handleSizeCalculator = () => {
    const size = parseFloat(shoeSize);
    if (isNaN(size)) {
      setRecommendedSize(null);
      return;
    }

    // Simple size recommendation logic
    if (genderFilter === 'women' || genderFilter === 'all') {
      if (size >= 4 && size <= 6) setRecommendedSize('XS');
      else if (size >= 6.5 && size <= 8.5) setRecommendedSize('S');
      else if (size >= 9 && size <= 11) setRecommendedSize('M');
      else if (size >= 11.5) setRecommendedSize('L');
    } else {
      if (size >= 5 && size <= 7) setRecommendedSize('S');
      else if (size >= 7.5 && size <= 9.5) setRecommendedSize('M');
      else if (size >= 10 && size <= 12) setRecommendedSize('L');
      else if (size >= 12.5) setRecommendedSize('XL');
    }
  };

  const getFilteredSizes = () => {
    if (genderFilter === 'women') {
      return sizeChartData.filter(item => item.womenUS !== '-');
    } else if (genderFilter === 'men') {
      return sizeChartData.filter(item => item.menUS !== '-');
    }
    return sizeChartData;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-lime/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Ruler className="w-3 h-3" />
            Size Guide
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-400">Perfect Fit</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Get the right size for maximum comfort and performance. Our insoles are designed to fit most shoes and can be trimmed for a custom fit.
          </p>
        </div>
      </section>

      {/* Size Calculator */}
      <section className="relative z-20 -mt-10 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-brand-dark">Size Calculator</h2>
                <p className="text-slate-600 text-sm">Find your recommended size instantly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">I am shopping for</label>
                <div className="flex gap-2">
                  {[
                    { value: 'women' as GenderFilter, label: 'Women' },
                    { value: 'men' as GenderFilter, label: 'Men' },
                    { value: 'all' as GenderFilter, label: 'All' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setGenderFilter(option.value);
                        setRecommendedSize(null);
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        genderFilter === option.value
                          ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">My shoe size (US)</label>
                <input
                  type="number"
                  step="0.5"
                  value={shoeSize}
                  onChange={(e) => {
                    setShoeSize(e.target.value);
                    setRecommendedSize(null);
                  }}
                  placeholder="e.g. 9"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>

              <div>
                <Button
                  onClick={handleSizeCalculator}
                  disabled={!shoeSize}
                  className="w-full rounded-xl py-3 font-bold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calculate Size
                </Button>
              </div>
            </div>

            {recommendedSize && (
              <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-1">Your Recommended Size</h3>
                    <p className="text-slate-700 mb-4">Based on your inputs, we recommend:</p>
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl border-2 border-green-300">
                      <span className="text-3xl font-black text-brand-dark">{recommendedSize}</span>
                      <div className="text-left">
                        <p className="text-xs text-slate-500 font-bold">Size</p>
                        <p className="text-sm text-slate-700 font-medium">
                          {sizeChartData.find(s => s.size === recommendedSize)?.womenUS || 
                           sizeChartData.find(s => s.size === recommendedSize)?.menUS} US
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Size Chart */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-3">Size Chart</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Compare sizes across different measurement systems. Select a size for more details.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-dark text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wider">Women's (US)</th>
                    <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wider">Men's (US)</th>
                    <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wider">EU</th>
                    <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wider">UK</th>
                    <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wider">Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredSizes().map((item, index) => (
                    <tr
                      key={item.size}
                      onClick={() => setSelectedSize(selectedSize === item.size ? null : item.size)}
                      className={`border-t border-slate-100 cursor-pointer transition-all ${
                        selectedSize === item.size
                          ? 'bg-brand-orange/10'
                          : 'hover:bg-slate-50'
                      } ${index % 2 === 0 ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-brand-dark">{item.size}</span>
                          {item.recommended && (
                            <span className="px-2 py-1 bg-brand-orange text-white text-xs font-bold rounded-lg">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-700 font-medium">{item.womenUS}</td>
                      <td className="px-6 py-5 text-slate-700 font-medium">{item.menUS}</td>
                      <td className="px-6 py-5 text-slate-700 font-medium">{item.eu}</td>
                      <td className="px-6 py-5 text-slate-700 font-medium">{item.uk}</td>
                      <td className="px-6 py-5 text-slate-700 font-medium">{item.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">Between Sizes?</p>
              <p>We recommend sizing up if you're between sizes. Our insoles can be easily trimmed for a perfect fit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Measuring Guide */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-lime/20 text-brand-lime rounded-xl flex items-center justify-center">
                  <Footprints className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark">How to Measure Your Foot</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Prepare Your Materials</h4>
                    <p className="text-slate-600 text-sm">Get a ruler or measuring tape, a piece of paper, and a pen.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Stand on Paper</h4>
                    <p className="text-slate-600 text-sm">Place the paper on a flat surface and stand on it with your full weight.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Mark Your Heel & Toe</h4>
                    <p className="text-slate-600 text-sm">Mark the longest part of your foot (usually the big toe) and the back of your heel.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Measure the Distance</h4>
                    <p className="text-slate-600 text-sm">Measure in centimeters from heel to toe and compare with our size chart.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Repeat for Both Feet</h4>
                    <p className="text-slate-600 text-sm">Measure both feet and use the measurement of your larger foot.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-bold mb-1">Pro Tip</p>
                    <p>Measure your feet at the end of the day when they're slightly swollen for the most accurate size.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trimming Guide */}
            <div className="bg-gradient-to-br from-brand-dark to-slate-800 rounded-3xl shadow-sm border border-slate-700 p-8 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black">How to Trim Your Insoles</h3>
              </div>

              <p className="text-slate-300 mb-8">
                Our insoles are designed to be trimmed for a custom fit. Follow these steps for the perfect cut.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-lime shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Remove Your Factory Insole</h4>
                    <p className="text-slate-300 text-sm">Take out the original insole from your shoe to use as a template.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-lime shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Trace the Outline</h4>
                    <p className="text-slate-300 text-sm">Place your factory insole on top of the AeroTouch insole and trace around it with a pen.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-lime shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Cut Carefully</h4>
                    <p className="text-slate-300 text-sm">Use sharp scissors to cut along the marked line. Cut slowly and smoothly for the best result.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-lime shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Test the Fit</h4>
                    <p className="text-slate-300 text-sm">Place the trimmed insole in your shoe. If needed, trim small amounts until it fits perfectly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-lime shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Start Using</h4>
                    <p className="text-slate-300 text-sm">Once trimmed, your insoles are ready to provide maximum comfort and support!</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
            <h3 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-brand-orange" />
              Sizing FAQs
            </h3>

            <div className="space-y-6">
              {[
                {
                  q: 'What if I\'m between sizes?',
                  a: 'We recommend sizing up if you\'re between sizes. Our insoles can be trimmed at the toe for a perfect fit, but they cannot be extended.'
                },
                {
                  q: 'Can I use the same insoles for different shoes?',
                  a: 'Yes! As long as the shoes are the same size, you can move the insoles between them. For best results, we recommend having dedicated pairs for your most-used shoes.'
                },
                {
                  q: 'Do you have half sizes?',
                  a: 'Our sizes cover a range (e.g., Size M fits Women\'s 9-11). This design accommodates half sizes within each range and can be trimmed for precision.'
                },
                {
                  q: 'Will trimming affect the performance?',
                  a: 'No! Trimming only affects the length at the toe area. The arch support, heel cup, and cushioning remain fully functional.'
                },
                {
                  q: 'What if the insoles are too big for my shoes?',
                  a: 'Simply trim them following our guide above. Use your factory insole as a template for the most accurate cut.'
                },
                {
                  q: 'Can I return insoles if the size doesn\'t fit?',
                  a: 'Yes! We offer a 60-day money-back guarantee. Returns are accepted even if the insoles have been trimmed or worn.'
                }
              ].map((faq, index) => (
                <div key={index} className="border-l-4 border-brand-orange pl-6 py-2">
                  <h4 className="font-bold text-brand-dark mb-2">{faq.q}</h4>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-brand-orange to-red-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Still Not Sure?</h2>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                Our customer support team is here to help you find the perfect size. Get in touch and we'll guide you through the process.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  className="bg-white text-brand-orange hover:bg-slate-50 border-0 rounded-xl px-8"
                  size="lg"
                >
                  Chat with Us
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 rounded-xl px-8"
                  size="lg"
                >
                  Shop Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
