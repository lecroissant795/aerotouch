import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-lime text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Shield className="w-3 h-3" aria-hidden />
            Privacy
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-emerald-400">Policy</span>
          </h1>
          <p className="text-lg text-slate-400 mb-2 max-w-2xl mx-auto">
            This policy explains what we collect, how we use it, and the choices you have.
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
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Information We Collect</h2>
                <p className="text-slate-600">
                  We collect information you provide directly (such as your name, email, shipping address, and order details),
                  information generated through your use of the site (such as pages viewed and interactions), and information
                  from third-party services used to operate our storefront.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">How Customer Data Is Used</h2>
                <p className="text-slate-600">
                  We use customer data to process orders, provide support, improve our products and site experience, prevent
                  fraud, and communicate with you about purchases, updates, and promotions (where permitted).
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Cookies and Tracking</h2>
                <p className="text-slate-600">
                  We may use cookies and similar technologies to keep the site working, remember preferences, measure performance,
                  and understand how visitors use the site. You can control cookies through your browser settings; some features
                  may not function properly if cookies are disabled.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Email Marketing Consent</h2>
                <p className="text-slate-600">
                  If you opt in to marketing emails, we may send promotions, product updates, and helpful content. You can unsubscribe
                  at any time using the unsubscribe link in emails or by contacting support.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Shopify / Payment Data Handling</h2>
                <p className="text-slate-600">
                  AeroTouch uses Shopify to power product catalog, checkout, and order processing. Payment information is handled by
                  Shopify and payment providers; AeroTouch does not store complete payment card numbers. Order and fulfillment details
                  may be stored in Shopify for operational purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Data Sharing with Third-Party Services</h2>
                <p className="text-slate-600">
                  We share data only as needed to operate the business—for example with Shopify, payment processors, shipping carriers,
                  analytics providers, customer support tools, and email delivery services. These providers process data on our behalf
                  under their own terms and privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Customer Rights and Contact Details</h2>
                <p className="text-slate-600">
                  Depending on where you live, you may have rights to access, correct, delete, or restrict processing of your personal
                  information. To request help with privacy inquiries, contact us at{' '}
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

