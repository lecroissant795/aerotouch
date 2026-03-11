import React, { useState } from 'react';
import { Button } from '../components/Button';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Package, 
  Mail, 
  ArrowRight,
  Info,
  Camera,
  Search,
  Check
} from 'lucide-react';

type RequestType = 'claim' | null;

interface ClaimFormData {
  orderNumber: string;
  email: string;
  issue: string;
  productName: string;
  comments: string;
}

export const WarrantyPage: React.FC = () => {
  const [step, setStep] = useState<'info' | 'form' | 'submitted'>('info');
  const [formData, setFormData] = useState<ClaimFormData>({
    orderNumber: '',
    email: '',
    issue: '',
    productName: '',
    comments: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.orderNumber || !formData.email || !formData.issue || !formData.productName) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('submitted');
    } catch (err: any) {
      setError('Failed to submit warranty claim. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const commonIssues = [
    'Material Delamination',
    'Excessive Compression',
    'Structural Crack',
    'Arrived Damaged',
    'Other Manufacturing Defect'
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-lime text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Shield className="w-3 h-3" />
            Warranty & Claims
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-emerald-400">Guaranteed</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            We stand behind every product we make. Learn about our 1-year limited warranty and file a claim if your performance is compromised.
          </p>
        </div>
      </section>

      {/* Warranty Highlights */}
      <section className="relative z-20 -mt-12 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Clock className="w-6 h-6" />, title: '1-Year Cover', desc: 'From date of purchase' },
              { icon: <Shield className="w-6 h-6" />, title: 'Full Protection', desc: 'Against manufacturing defects' },
              { icon: <CheckCircle className="w-6 h-6" />, title: 'Fast Approval', desc: 'Reviews within 48 hours' },
              { icon: <Package className="w-6 h-6" />, title: 'Free Replace', desc: 'We ship the replacement free' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
                <div className="w-12 h-12 bg-brand-lime/10 text-brand-dark rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black text-brand-dark mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Dynamic Content */}
            <div className="lg:col-span-2">
              
              {/* Step 1: Info/Policy */}
              {step === 'info' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                  <h2 className="text-3xl font-black text-brand-dark mb-6">Our Warranty Policy</h2>
                  
                  <div className="prose prose-slate max-w-none mb-10">
                    <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      AeroTouch provides a <strong>1-Year Limited Warranty</strong> on all performance insoles. This warranty covers manufacturing defects in materials and workmanship under normal use.
                    </p>
                    
                    <h3 className="text-xl font-bold text-brand-dark mb-4">What's Covered:</h3>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Premature material degradation or delamination',
                        'Defects in the structural arch support or heel cradle',
                        'Failed bonding of multi-layer materials',
                        'Structural breakage during intended athletic use'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                          <Check className="w-5 h-5 text-brand-lime mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-bold text-brand-dark mb-4">What's Not Covered:</h3>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Normal wear and tear (compression over 6+ months)',
                        'Damage caused by improper trimming',
                        'Damage from machine washing or heat drying',
                        'Items purchased from unauthorized resellers'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                    <h3 className="text-xl font-bold text-brand-dark mb-2">Ready to file a claim?</h3>
                    <p className="text-slate-500 mb-6">Make sure you have your order number and photos of the defect ready.</p>
                    <Button 
                      onClick={() => setStep('form')}
                      className="rounded-xl px-8 py-4 text-base font-bold shadow-lg shadow-brand-lime/20"
                    >
                      Start Warranty Claim <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Form */}
              {step === 'form' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-brand-dark mb-2">Warranty Claim Form</h2>
                      <p className="text-slate-600">Please provide the details of your claim</p>
                    </div>
                    <button
                      onClick={() => setStep('info')}
                      className="text-sm text-slate-500 hover:text-brand-orange font-medium"
                    >
                      ← Back to Policy
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Order Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.orderNumber}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          placeholder="e.g. #AT12345"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        placeholder="e.g. AeroTouch Performance Insoles"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Nature of Issue <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.issue}
                        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                        required
                      >
                        <option value="">Select the primary issue</option>
                        {commonIssues.map((issue, i) => (
                          <option key={i} value={issue}>{issue}</option>
                        ))}
                      </select>
                    </div>

                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center group hover:border-brand-lime transition-colors">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-slate-400 group-hover:text-brand-lime" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1">Upload Photo of Defect</p>
                      <p className="text-xs text-slate-500">Required: Clear photo showing the issue</p>
                      <input type="file" className="hidden" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Describe the Problem
                      </label>
                      <textarea
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        placeholder="Please provide more context about how and when the issue occurred..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Error</p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-xl py-4 text-base font-bold flex items-center justify-center gap-3"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting Claim...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Submit Warranty Claim
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 3: Submitted */}
              {step === 'submitted' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 text-center">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Claim Received</h2>
                  <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    Your warranty claim has been successfully submitted. Our quality assurance team will review the details and photos within 24-48 business hours.
                  </p>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-brand-dark mb-4">Next Steps</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-dark text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <p className="text-sm text-slate-700">Check your email for a claim confirmation (including the ticket #)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-dark text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <p className="text-sm text-slate-700">Our team will verify the claim against our warranty policy guidelines</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-dark text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <p className="text-sm text-slate-700">If approved, we will ship a replacement pair to your original address free of charge</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setStep('info')}
                      variant="outline"
                      className="rounded-xl border-slate-200"
                    >
                      View Policy Again
                    </Button>
                    <Button className="rounded-xl">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column - FAQ/Info */}
            <div className="space-y-6">
              
              {/* Quick FAQ */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-orange" />
                  Common Questions
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">Do I need to return the defective pair?</p>
                    <p className="text-sm text-slate-600">In most cases, no. Clear photos are usually sufficient for our quality team.</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">What if I trimmed them?</p>
                    <p className="text-sm text-slate-600">Trimming is expected! We cover defects regardless of whether they have been trimmed for fit.</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">Is the shipping free for replacements?</p>
                    <p className="text-sm text-slate-600">Yes, AeroTouch covers domestic shipping for all approved warranty replacements.</p>
                  </div>
                </div>
              </div>

              {/* Tips for Approval */}
              <div className="bg-gradient-to-br from-brand-lime to-emerald-400 rounded-3xl p-8 text-brand-dark">
                <div className="w-12 h-12 bg-brand-dark/10 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-4">Approval Checklist</h3>
                <div className="space-y-3">
                  {[
                    'Clear, well-lit photos',
                    'Order # from website',
                    'Under 1 year old',
                    'Manufacturing related defect'
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-bold">
                      <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
