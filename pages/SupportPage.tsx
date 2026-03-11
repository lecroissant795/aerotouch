import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Page } from '../types';
import { 
  Search, 
  Package, 
  RefreshCcw, 
  Ruler, 
  Shield, 
  MessageCircle, 
  Mail, 
  ChevronDown, 
  ChevronRight,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const FAQS = [
  {
    category: 'Product & Sizing',
    questions: [
      { q: 'How do I know which size to buy?', a: 'We recommend choosing the size range that corresponds to your shoe size. If you are between sizes, we generally suggest sizing up as our insoles can be trimmed at the toe for a perfect fit.' },
      { q: 'Can I trim the insoles?', a: 'Yes! AeroTouch insoles are designed to be trimmed. Use your factory insole as a template, trace it onto the AeroTouch insole, and trim with sharp scissors.' },
      { q: 'How long do they last?', a: 'For daily use, we recommend replacing them every 6-12 months. For high-impact running or sports, we recommend replacing every 300-500 miles, similar to your running shoes.' }
    ]
  },
  {
    category: 'Performance & Benefits',
    questions: [
      { q: 'Do these help with Plantar Fasciitis?', a: 'Yes. Our specialized arch support is designed to reduce strain on the plantar fascia, providing targeted relief for heel pain and arch discomfort.' },
      { q: 'Are they good for high-impact sports?', a: 'Absolutely. AeroTouch insoles are engineered for energy return and shock absorption, making them ideal for running, basketball, and other high-impact activities.' },
      { q: 'How do they differ from generic insoles?', a: 'Generic insoles offer basic cushioning. AeroTouch uses performance-grade materials to provide structural support, stability, and energy return that actually improves your movement.' }
    ]
  },
  {
    category: 'Usage & Care',
    questions: [
      { q: 'Do I need to break them in?', a: 'Most users find them comfortable immediately. However, if you are new to support insoles, we recommend wearing them for 2-3 hours a day for the first few days to let your feet adjust.' },
      { q: 'How do I clean my insoles?', a: 'Hand wash with mild soap and lukewarm water. Air dry away from direct heat sources. Do not machine wash or dry, as this can damage the structural integrity.' },
      { q: 'Can I switch them between shoes?', a: 'Yes, as long as the shoes are the same size range. For the best fit and longevity, we recommend having a dedicated pair for your primary athletic shoes.' }
    ]
  },
  {
    category: 'Shipping & Returns',
    questions: [
      { q: 'What is your return policy?', a: 'We offer a 60-day "Risk-Free" trial. If you are not completely satisfied, you can return them for a full refund, even if they have been trimmed or worn.' },
      { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days. Expedited options are available at checkout. Orders placed before 2PM EST ship same-day.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries. International shipping times vary by location but typically take 7-14 business days.' }
    ]
  }
];

interface SupportPageProps {
  onNavigate?: (page: Page) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<string | null>('0-0'); // Default open first one

  const toggleFaq = (idx: string) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Search Section - Modern Deep Dark Theme */}
      <section className="relative pt-32 pb-32 bg-brand-dark overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-lime text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <HelpCircle className="w-3 h-3" />
              Support Center
           </div>
           <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-emerald-400">help you?</span>
           </h1>
           <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Find answers to common questions, track your order, or get in touch with our performance experts.
           </p>
           
           <div className="relative max-w-2xl mx-auto group">
             <div className="absolute inset-0 bg-brand-lime/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="relative flex items-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl transition-all focus-within:bg-white/10 focus-within:border-white/20">
                <Search className="w-6 h-6 text-slate-400 ml-4 mr-4" />
                <input 
                   type="text" 
                   placeholder="Search for answers (e.g., sizing, shipping)..." 
                   className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-lg py-3"
                />
                <Button className="hidden md:flex rounded-xl px-8" size="lg">Search</Button>
             </div>
           </div>
        </div>
      </section>

      {/* Quick Actions Grid - Floating Cards */}
      <section className="relative z-20 -mt-16 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Order Status - Interactive */}
              <button 
                onClick={() => onNavigate?.(Page.ORDER_STATUS)}
                className="group bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 hover:border-brand-lime/20 hover:shadow-2xl hover:shadow-brand-lime/5 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-50 text-slate-900 group-hover:bg-brand-dark group-hover:text-brand-lime rounded-xl flex items-center justify-center transition-colors duration-300">
                       <Package className="w-6 h-6"/>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-dark transition-colors">Order Status</h3>
                 <p className="text-sm text-slate-500 font-medium">Track your shipment</p>
              </button>

              {/* Returns & Exchanges - Interactive */}
              <button 
                onClick={() => onNavigate?.(Page.RETURNS_EXCHANGE)}
                className="group bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 hover:border-brand-lime/20 hover:shadow-2xl hover:shadow-brand-lime/5 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-50 text-slate-900 group-hover:bg-brand-dark group-hover:text-brand-lime rounded-xl flex items-center justify-center transition-colors duration-300">
                       <RefreshCcw className="w-6 h-6"/>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-dark transition-colors">Returns & Exchanges</h3>
                 <p className="text-sm text-slate-500 font-medium">Start a return request</p>
              </button>

              {/* Size Guide - Interactive */}
              <button 
                onClick={() => onNavigate?.(Page.SIZE_GUIDE)}
                className="group bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 hover:border-brand-lime/20 hover:shadow-2xl hover:shadow-brand-lime/5 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-50 text-slate-900 group-hover:bg-brand-dark group-hover:text-brand-lime rounded-xl flex items-center justify-center transition-colors duration-300">
                       <Ruler className="w-6 h-6"/>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-dark transition-colors">Size Guide</h3>
                 <p className="text-sm text-slate-500 font-medium">Find your perfect fit</p>
              </button>

              {/* Warranty Claim - Interactive */}
              <button 
                onClick={() => onNavigate?.(Page.WARRANTY)}
                className="group bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 hover:border-brand-lime/20 hover:shadow-2xl hover:shadow-brand-lime/5 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-50 text-slate-900 group-hover:bg-brand-dark group-hover:text-brand-lime rounded-xl flex items-center justify-center transition-colors duration-300">
                       <Shield className="w-6 h-6"/>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-dark transition-colors">Warranty Claim</h3>
                 <p className="text-sm text-slate-500 font-medium">File a warranty claim</p>
              </button>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 pb-24">
         <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-16">
               <span className="text-brand-orange font-bold uppercase tracking-wider text-sm">FAQ</span>
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-4">Frequently Asked Questions</h2>
               <div className="w-20 h-1.5 bg-brand-lime mx-auto rounded-full"></div>
            </div>
            
            <div className="grid gap-4">
               {FAQS.map((category, catIdx) => (
                  <div key={catIdx} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                     <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 pb-6 border-b border-slate-100">
                        <div className="w-2 h-8 bg-brand-dark rounded-full"></div>
                        {category.category}
                     </h3>
                     <div className="space-y-4">
                        {category.questions.map((faq, qIdx) => {
                           const id = `${catIdx}-${qIdx}`;
                           const isOpen = openFaq === id;
                           return (
                              <div key={qIdx} className={`rounded-xl transition-all duration-300 border border-transparent ${isOpen ? 'bg-slate-50 border-slate-200' : 'hover:bg-slate-50/50 hover:border-slate-100'}`}>
                                 <button 
                                    className="w-full flex items-center text-left p-4 md:p-5 focus:outline-none"
                                    onClick={() => toggleFaq(id)}
                                 >
                                    <span className={`mr-4 transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-slate-400'}`}>
                                       <ChevronRight className="w-5 h-5" />
                                    </span>
                                    <span className={`block text-lg font-bold transition-colors ${isOpen ? 'text-brand-dark' : 'text-slate-700'}`}>
                                       {faq.q}
                                    </span>
                                 </button>
                                 <div 
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mb-5' : 'grid-rows-[0fr] opacity-0'}`}
                                 >
                                    <div className="overflow-hidden px-5 md:px-14">
                                       <p className="text-slate-600 leading-relaxed">
                                          {faq.a}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-50 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

         <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-brand-dark rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
               {/* Decorative Circles */}
               <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

               <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Still need help?</h2>
                  <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
                     Our dedicated performance experts are available Mon-Fri, 9am - 5pm EST to help you get back on your feet.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button className="flex items-center justify-center gap-3 h-14 px-8 text-base bg-brand-lime text-brand-dark hover:bg-white hover:text-brand-dark border-0" size="lg">
                        <MessageCircle className="w-5 h-5" />
                        Live Chat Support
                     </Button>
                     <Button variant="outline" className="flex items-center justify-center gap-3 h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white" size="lg">
                        <Mail className="w-5 h-5" />
                        Email Support
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};
