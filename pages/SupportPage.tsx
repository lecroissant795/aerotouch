import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  ChevronRight,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

type SupportFaq = {
  q: string;
  a: string;
  /** Extra match terms (not shown) — sizing, shipping, returns, etc. */
  keywords?: string[];
};

type SupportCategory = {
  category: string;
  questions: SupportFaq[];
};

const FAQS: SupportCategory[] = [
  {
    category: 'Product & Sizing',
    questions: [
      {
        q: 'How do I know which size to buy?',
        a: 'We recommend choosing the size range that corresponds to your shoe size. If you are between sizes, we generally suggest sizing up as our insoles can be trimmed at the toe for a perfect fit.',
        keywords: ['size', 'sizing', 'fit', 'shoe size', 'measure', 'too small', 'too big', 'width']
      },
      {
        q: 'Can I trim the insoles?',
        a: 'Yes! AeroTouch insoles are designed to be trimmed. Use your factory insole as a template, trace it onto the AeroTouch insole, and trim with sharp scissors.',
        keywords: ['trim', 'cut', 'template', 'scissors', 'customize', 'length']
      },
      {
        q: 'How long do they last?',
        a: 'For daily use, we recommend replacing them every 6-12 months. For high-impact running or sports, we recommend replacing every 300-500 miles, similar to your running shoes.',
        keywords: ['durability', 'lifespan', 'replace', 'wear out', 'miles', 'months']
      }
    ]
  },
  {
    category: 'Performance & Benefits',
    questions: [
      {
        q: 'Do these help with Plantar Fasciitis?',
        a: 'Yes. Our specialized arch support is designed to reduce strain on the plantar fascia, providing targeted relief for heel pain and arch discomfort.',
        keywords: ['plantar fasciitis', 'heel pain', 'arch', 'fascia', 'foot pain', 'morning pain']
      },
      {
        q: 'Are they good for high-impact sports?',
        a: 'Absolutely. AeroTouch insoles are engineered for energy return and shock absorption, making them ideal for running, basketball, and other high-impact activities.',
        keywords: ['running', 'basketball', 'sports', 'impact', 'shock', 'energy return', 'athletic']
      },
      {
        q: 'How do they differ from generic insoles?',
        a: 'Generic insoles offer basic cushioning. AeroTouch uses performance-grade materials to provide structural support, stability, and energy return that actually improves your movement.',
        keywords: ['vs', 'compare', 'dr scholls', 'generic', 'cushion', 'support', 'difference']
      }
    ]
  },
  {
    category: 'Usage & Care',
    questions: [
      {
        q: 'Do I need to break them in?',
        a: 'Most users find them comfortable immediately. However, if you are new to support insoles, we recommend wearing them for 2-3 hours a day for the first few days to let your feet adjust.',
        keywords: ['break in', 'adjust', 'comfort', 'first time', 'new']
      },
      {
        q: 'How do I clean my insoles?',
        a: 'Hand wash with mild soap and lukewarm water. Air dry away from direct heat sources. Do not machine wash or dry, as this can damage the structural integrity.',
        keywords: ['wash', 'clean', 'soap', 'smell', 'odor', 'dry', 'laundry']
      },
      {
        q: 'Can I switch them between shoes?',
        a: 'Yes, as long as the shoes are the same size range. For the best fit and longevity, we recommend having a dedicated pair for your primary athletic shoes.',
        keywords: ['multiple shoes', 'swap', 'transfer', 'different shoes']
      }
    ]
  },
  {
    category: 'Shipping & Returns',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 60-day "Risk-Free" trial. If you are not completely satisfied, you can return them for a full refund, even if they have been trimmed or worn.',
        keywords: ['return', 'refund', 'money back', 'trial', '60 day', 'exchange', 'warranty']
      },
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 3-5 business days. Expedited options are available at checkout. Orders placed before 2PM EST ship same-day.',
        keywords: ['shipping', 'delivery', 'how long', 'track order', 'expedited', 'same day', 'EST']
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries. International shipping times vary by location but typically take 7-14 business days.',
        keywords: ['international', 'overseas', 'country', 'abroad', 'Canada', 'UK', 'EU']
      }
    ]
  }
];

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function tokenize(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}-]+/gu, ''))
    .filter(Boolean);
}

function faqMatchScore(tokens: string[], category: string, item: SupportFaq): number {
  if (tokens.length === 0) return 0;
  const cat = normalize(category);
  const title = normalize(item.q);
  const body = normalize(item.a);
  const kwBlob = normalize((item.keywords || []).join(' '));
  const fullPhrase = tokens.join(' ');
  let score = 0;

  if (title.includes(fullPhrase)) score += 100;
  if (cat.includes(fullPhrase)) score += 70;
  if (kwBlob.includes(fullPhrase)) score += 55;
  if (body.includes(fullPhrase)) score += 45;

  for (const t of tokens) {
    if (title.includes(t)) score += 28;
    if (cat.includes(t)) score += 18;
    if (kwBlob.includes(t)) score += 14;
    if (body.includes(t)) score += 6;
  }
  return score;
}

type ScoredFaq = {
  catIdx: number;
  qIdx: number;
  id: string;
  category: string;
  faq: SupportFaq;
  score: number;
};

function buildScoredMatches(query: string): ScoredFaq[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored: ScoredFaq[] = [];
  FAQS.forEach((cat, catIdx) => {
    cat.questions.forEach((faq, qIdx) => {
      const score = faqMatchScore(tokens, cat.category, faq);
      if (score > 0) {
        scored.push({
          catIdx,
          qIdx,
          id: `${catIdx}-${qIdx}`,
          category: cat.category,
          faq,
          score
        });
      }
    });
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.catIdx !== b.catIdx) return a.catIdx - b.catIdx;
    return a.qIdx - b.qIdx;
  });
  return scored;
}

function groupMatchesByCategory(matches: ScoredFaq[]): { category: string; items: ScoredFaq[] }[] {
  const order: string[] = [];
  const map = new Map<string, ScoredFaq[]>();
  for (const m of matches) {
    if (!map.has(m.category)) {
      order.push(m.category);
      map.set(m.category, []);
    }
    map.get(m.category)!.push(m);
  }
  return order.map((category) => ({ category, items: map.get(category)! }));
}

const SUPPORT_EMAIL = 'support@aerotouch.com';
const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('AeroTouch support request')}`;

/** Shopify Inbox / chat app URL. Set `VITE_SHOPIFY_CHAT_URL` in `.env` to override. */
const SHOPIFY_CHAT_URL =
  import.meta.env.VITE_SHOPIFY_CHAT_URL || 'https://aerotuch.myshopify.com/apps/chat';

interface SupportPageProps {
  onNavigate?: (page: Page) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<string | null>('0-0'); // Default open first one
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);
  const hadSearchQueryRef = useRef(false);

  const trimmedQuery = searchQuery.trim();
  const isSearchActive = trimmedQuery.length > 0;

  const scoredMatches = useMemo(() => buildScoredMatches(trimmedQuery), [trimmedQuery]);
  const groupedForDisplay = useMemo(() => groupMatchesByCategory(scoredMatches), [scoredMatches]);

  const displayCategories = useMemo(() => {
    if (!isSearchActive) {
      return FAQS.map((c, i) => ({
        category: c.category,
        questions: c.questions.map((faq, qIdx) => ({ faq, id: `${i}-${qIdx}` }))
      }));
    }
    return groupedForDisplay.map((g) => ({
      category: g.category,
      questions: g.items.map((m) => ({ faq: m.faq, id: m.id }))
    }));
  }, [isSearchActive, groupedForDisplay]);

  useEffect(() => {
    if (!isSearchActive) return;
    if (scoredMatches.length === 0) {
      setOpenFaq(null);
      return;
    }
    setOpenFaq((prev) => {
      if (prev && scoredMatches.some((m) => m.id === prev)) return prev;
      return scoredMatches[0].id;
    });
  }, [isSearchActive, scoredMatches]);

  useEffect(() => {
    if (trimmedQuery) {
      hadSearchQueryRef.current = true;
      return;
    }
    if (hadSearchQueryRef.current) {
      hadSearchQueryRef.current = false;
      setOpenFaq('0-0');
    }
  }, [trimmedQuery]);

  const scrollToFaqSection = useCallback(() => {
    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const runSearchNavigation = useCallback(() => {
    scrollToFaqSection();
    if (isSearchActive && scoredMatches.length > 0) {
      setOpenFaq(scoredMatches[0].id);
    }
  }, [scrollToFaqSection, isSearchActive, scoredMatches]);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSearchQuery('');
      searchInputRef.current?.blur();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearchNavigation();
    }
  };

  const toggleFaq = (idx: string) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Search Section - Modern Deep Dark Theme */}
      <section className="relative pt-32 pb-32 bg-brand-dark overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
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
           
           <form
              className="relative max-w-2xl mx-auto group"
              role="search"
              aria-label="Search support articles and FAQs"
              onSubmit={(e) => {
                e.preventDefault();
                runSearchNavigation();
              }}
           >
             <div className="absolute inset-0 bg-brand-lime/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="relative flex items-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl transition-all focus-within:bg-white/10 focus-within:border-white/20">
                <Search className="w-6 h-6 text-slate-400 ml-4 mr-4 shrink-0" aria-hidden />
                <input
                   ref={searchInputRef}
                   type="search"
                   name="support-search"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={onSearchKeyDown}
                   placeholder="Search for answers (e.g., sizing, shipping)..."
                   autoComplete="off"
                   aria-controls="support-faq-panel"
                   className="w-full min-w-0 bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-lg py-3"
                />
                <Button type="submit" className="hidden md:flex rounded-xl px-8 shrink-0" size="lg">Search</Button>
             </div>
           </form>
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
      <section ref={faqSectionRef} className="py-10 pb-24" aria-label="Frequently asked questions">
         <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-16">
               <span className="text-brand-orange font-bold uppercase tracking-wider text-sm">FAQ</span>
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-4">Frequently Asked Questions</h2>
               <div className="w-20 h-1.5 bg-brand-lime mx-auto rounded-full"></div>
            </div>

            <div id="support-faq-panel" className="grid gap-4">
               {isSearchActive && scoredMatches.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-slate-100 text-center">
                     <p className="text-lg font-bold text-slate-900 mb-2">No results found</p>
                     <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        We couldn&apos;t find a help article matching &ldquo;{trimmedQuery}&rdquo;. Try different keywords, or clear the search to browse all FAQs.
                     </p>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                           setSearchQuery('');
                           searchInputRef.current?.focus();
                        }}
                     >
                        Clear search
                     </Button>
                  </div>
               ) : (
                  displayCategories.map((block) => (
                     <div key={block.category} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 pb-6 border-b border-slate-100">
                           <div className="w-2 h-8 bg-brand-dark rounded-full" aria-hidden />
                           {block.category}
                        </h3>
                        <div className="space-y-4">
                           {block.questions.map(({ faq, id }) => {
                              const isOpen = openFaq === id;
                              return (
                                 <div
                                    key={id}
                                    className={`rounded-xl transition-all duration-300 border border-transparent ${isOpen ? 'bg-slate-50 border-slate-200' : 'hover:bg-slate-50/50 hover:border-slate-100'}`}
                                 >
                                    <button
                                       type="button"
                                       className="w-full flex items-center text-left p-4 md:p-5 focus:outline-none"
                                       aria-expanded={isOpen}
                                       onClick={() => toggleFaq(id)}
                                    >
                                       <span className={`mr-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-slate-400'}`}>
                                          <ChevronRight className="w-5 h-5" aria-hidden />
                                       </span>
                                       <span className={`block text-lg font-bold transition-colors ${isOpen ? 'text-brand-dark' : 'text-slate-700'}`}>
                                          {faq.q}
                                       </span>
                                    </button>
                                    <div
                                       className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mb-5' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                       <div className="overflow-hidden px-5 md:px-14">
                                          <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  ))
               )}
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
                     <a
                        href={SHOPIFY_CHAT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 h-14 px-8 text-base font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-lime bg-brand-lime text-brand-dark hover:bg-white hover:text-brand-dark shadow-lg"
                     >
                        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden />
                        Live Chat Support
                     </a>
                     <a
                        href={SUPPORT_MAILTO}
                        className="inline-flex items-center justify-center gap-3 h-14 px-8 text-base font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-white/40 border-2 border-white/20 text-white hover:bg-white/10 hover:text-white"
                     >
                        <Mail className="w-5 h-5 shrink-0" aria-hidden />
                        Email Support
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};
