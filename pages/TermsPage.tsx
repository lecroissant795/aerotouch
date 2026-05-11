import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-lime text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <FileText className="w-3 h-3" aria-hidden />
            Terms
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Terms &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-emerald-400">Conditions</span>
          </h1>
          <p className="text-lg text-slate-400 mb-2 max-w-2xl mx-auto">
            Please review these terms carefully before using our website or placing an order.
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
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Use of Website</h2>
                <p className="text-slate-600">
                  By accessing or using the AeroTouch website, you agree to comply with these Terms &amp; Conditions.
                  You may not use the site for unlawful purposes, attempt to disrupt site functionality, or misuse
                  content, trademarks, or intellectual property.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Orders &amp; Payments</h2>
                <p className="text-slate-600">
                  When you place an order, you represent that the information you provide is accurate and that you are
                  authorized to use the selected payment method. Orders are subject to acceptance and availability. We
                  may refuse or cancel an order in cases such as suspected fraud, pricing errors, or inventory issues.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Shipping &amp; Returns</h2>
                <p className="text-slate-600">
                  Shipping timelines shown on the site are estimates and may vary. For returns and exchanges, eligibility,
                  timelines, and processing steps are described in our returns experience and support pages. Refunds, when
                  approved, are issued back to the original payment method.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Promotions &amp; Discount Codes</h2>
                <p className="text-slate-600">
                  Promotions and discount codes may have restrictions, expiration dates, and usage limits. Unless otherwise
                  stated, codes cannot be combined and have no cash value. We may modify or end promotions at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Limitation of Liability</h2>
                <p className="text-slate-600">
                  To the maximum extent permitted by law, AeroTouch is not liable for indirect, incidental, special, or
                  consequential damages arising out of or related to your use of the website or products. Our total
                  liability for any claim is limited to the amount paid for the relevant order.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Privacy / Reference Policies</h2>
                <p className="text-slate-600">
                  Our handling of personal data is governed by our Privacy Policy. By using this site, you acknowledge
                  that you have reviewed our privacy practices. Where available, additional reference policies (such as
                  cookie disclosures) may apply.
                </p>
              </section>

              <section className="pt-8 border-t border-slate-100">
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Contact</h2>
                <p className="text-slate-600">
                  If you have questions about these Terms &amp; Conditions, please contact us at{' '}
                  <a
                    className="text-brand-orange hover:text-orange-600 font-bold"
                    href="mailto:support@aerotouch.com"
                  >
                    team@aerotuch.shop
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

