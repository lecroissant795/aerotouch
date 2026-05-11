import React from 'react';
import { Cookie } from 'lucide-react';

export const CookiesPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-lime text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Cookie className="w-3 h-3" aria-hidden />
            Cookies
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-emerald-400">Policy</span>
          </h1>
          <p className="text-lg text-slate-400 mb-2 max-w-2xl mx-auto">
            This policy explains what cookies are, which types we use, and how you can control them.
          </p>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-20 -mt-12 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
            <div className="space-y-10 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">What Cookies Are</h2>
                <p className="text-slate-600">
                  Cookies are small text files stored on your device when you visit a website. They help websites remember
                  information about your visit, such as your preferences or session state, which can make the site work
                  better and feel more personalized.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Types of Cookies Used</h2>
                <p className="text-slate-600">
                  We may use cookies that are strictly necessary for the site to function, cookies that remember preferences,
                  and cookies used for analytics and marketing measurement. The exact cookies may change over time as we
                  update our tools and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Analytics and Marketing Cookies</h2>
                <p className="text-slate-600">
                  Analytics cookies help us understand how visitors interact with our site (for example, which pages are visited
                  and how long visitors spend on them). Marketing cookies may be used to measure ad performance and show relevant
                  offers. Where required, we use these tools based on your consent and applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Shopify / Payment-Related Cookies</h2>
                <p className="text-slate-600">
                  Our storefront and checkout use Shopify. Shopify and payment providers may set cookies to enable checkout,
                  prevent fraud, and support payment processing. AeroTouch does not control all third-party cookies used by
                  Shopify or payment processors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">How to Manage or Disable Cookies</h2>
                <p className="text-slate-600">
                  Most browsers let you manage cookies through settings, including deleting existing cookies and blocking new ones.
                  You can also configure your browser to notify you when cookies are set. If you disable cookies, some site features
                  (including checkout or saved preferences) may not function properly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Contact</h2>
                <p className="text-slate-600">
                  If you have questions about this Cookie Policy, contact us at{' '}
                  <a className="text-brand-orange hover:text-orange-600 font-bold" href="mailto:support@aerotouch.com">
                    support@aerotouch.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

