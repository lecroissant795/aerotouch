import React, { useState } from 'react';
import { Button } from '../components/Button';
import { 
  RefreshCcw,
  Package,
  CheckCircle,
  Mail,
  Calendar,
  AlertCircle,
  Info,
  ArrowRight,
  Truck,
  Shield,
  Clock,
  DollarSign,
  FileText,
  Box
} from 'lucide-react';

type RequestType = 'return' | 'exchange' | null;
type Reason = string;

interface ReturnFormData {
  orderNumber: string;
  email: string;
  requestType: RequestType;
  reason: Reason;
  items: string;
  comments: string;
  exchangeSize?: string;
  exchangeColor?: string;
}

export const ReturnsExchangePage: React.FC = () => {
  const [step, setStep] = useState<'select' | 'form' | 'submitted'>('select');
  const [formData, setFormData] = useState<ReturnFormData>({
    orderNumber: '',
    email: '',
    requestType: null,
    reason: '',
    items: '',
    comments: '',
    exchangeSize: '',
    exchangeColor: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

  const isValidEmailFormat = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidOrderNumber = (orderNumber: string) => /^[A-Za-z0-9-]{4,32}$/.test(orderNumber.trim().replace(/^#/, ''));

  const handleSelectType = (type: RequestType) => {
    setFormData({ ...formData, requestType: type });
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setConfirmationEmailSent(false);

    const normalizedOrderNumber = formData.orderNumber.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();

    // Basic validation
    if (!normalizedOrderNumber || !normalizedEmail || !formData.reason || !formData.items.trim()) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }
    if (!isValidOrderNumber(normalizedOrderNumber)) {
      setError('Please enter a valid order number (letters, numbers, or dashes).');
      setIsLoading(false);
      return;
    }
    if (!isValidEmailFormat(normalizedEmail)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/return-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          orderNumber: normalizedOrderNumber,
          email: normalizedEmail,
          items: formData.items.trim(),
          comments: formData.comments.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setStep('submitted');
      setConfirmationEmailSent(Boolean(data?.confirmationEmailSent));
    } catch (err: any) {
      setError(err.message || 'Failed to submit return request. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const returnReasons = [
    'Product defect or damage',
    'Wrong size ordered',
    'Not as described',
    'Changed my mind',
    'Better price found elsewhere',
    'Arrived too late',
    'Other'
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-lime text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <RefreshCcw className="w-3 h-3" />
            Returns & Exchanges
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-emerald-400">Returns</span> & Exchanges
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Not satisfied? We offer a 60-day risk-free trial. Return or exchange your insoles with ease.
          </p>
        </div>
      </section>

      {/* Policy Highlights */}
      <section className="relative z-20 -mt-12 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Clock className="w-6 h-6" />, title: '60-Day Trial', desc: 'Full money-back guarantee' },
              { icon: <DollarSign className="w-6 h-6" />, title: 'Free Returns', desc: 'We cover return shipping' },
              { icon: <RefreshCcw className="w-6 h-6" />, title: 'Easy Exchange', desc: 'Wrong size? No problem' },
              { icon: <Shield className="w-6 h-6" />, title: 'No Questions', desc: 'Hassle-free process' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
                <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center mb-4">
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
            
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              
              {/* Step 1: Select Type */}
              {step === 'select' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                  <h2 className="text-3xl font-black text-brand-dark mb-3">Start Your Request</h2>
                  <p className="text-slate-600 mb-10">Choose whether you'd like to return or exchange your product.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => handleSelectType('return')}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200 hover:border-brand-orange hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Package className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-brand-dark mb-2 group-hover:text-brand-orange transition-colors">Return</h3>
                      <p className="text-slate-600 mb-4">Get a full refund back to your original payment method</p>
                      <div className="flex items-center gap-2 text-brand-orange font-bold text-sm">
                        Start Return <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectType('exchange')}
                      className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200 hover:border-brand-lime hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-lime group-hover:text-brand-dark transition-colors">
                        <RefreshCcw className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-brand-dark mb-2 group-hover:text-brand-lime transition-colors">Exchange</h3>
                      <p className="text-slate-600 mb-4">Swap for a different size or product at no extra cost</p>
                      <div className="flex items-center gap-2 text-brand-lime font-bold text-sm">
                        Start Exchange <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Form */}
              {step === 'form' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-brand-dark mb-2">
                        {formData.requestType === 'return' ? 'Return Request' : 'Exchange Request'}
                      </h2>
                      <p className="text-slate-600">Fill in the details below to process your request</p>
                    </div>
                    <button
                      onClick={() => setStep('select')}
                      className="text-sm text-slate-500 hover:text-brand-orange font-medium"
                    >
                      ← Back
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-brand-dark flex items-center gap-2">
                        <Box className="w-5 h-5 text-brand-orange" />
                        Order Information
                      </h3>
                      
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
                            pattern="[A-Za-z0-9-]{4,32}"
                            title="Use 4-32 letters, numbers, or dashes"
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
                    </div>

                    {/* Return/Exchange Details */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <h3 className="text-lg font-black text-brand-dark flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-orange" />
                        Request Details
                      </h3>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Reason <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                          required
                        >
                          <option value="">Select a reason</option>
                          {returnReasons.map((reason, i) => (
                            <option key={i} value={reason}>{reason}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Items to {formData.requestType === 'return' ? 'Return' : 'Exchange'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.items}
                          onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                          placeholder="e.g. AeroTouch Performance Insoles - Size M"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                          required
                        />
                      </div>

                      {formData.requestType === 'exchange' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                              New Size (Optional)
                            </label>
                            <select
                              value={formData.exchangeSize}
                              onChange={(e) => setFormData({ ...formData, exchangeSize: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                            >
                              <option value="">Keep same size</option>
                              <option value="XS">XS (Women 4-6)</option>
                              <option value="S">S (Women 6.5-8.5 / Men 5-7)</option>
                              <option value="M">M (Women 9-11 / Men 7.5-9.5)</option>
                              <option value="L">L (Women 11.5+ / Men 10-12)</option>
                              <option value="XL">XL (Men 12.5+)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                              New Color (Optional)
                            </label>
                            <select
                              value={formData.exchangeColor}
                              onChange={(e) => setFormData({ ...formData, exchangeColor: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                            >
                              <option value="">Keep same color</option>
                              <option value="Black">Black</option>
                              <option value="Blue">Blue</option>
                              <option value="Gray">Gray</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Additional Comments
                        </label>
                        <textarea
                          value={formData.comments}
                          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                          placeholder="Any additional details or concerns..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
                        />
                      </div>
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Submit Request
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Request Submitted!</h2>
                  <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    We've received your {formData.requestType} request and will send you a confirmation email with next steps within 24 hours.
                  </p>
                  {!confirmationEmailSent && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm text-left">
                      We received your request, but the confirmation email could not be sent automatically. Our support team will still process it.
                    </div>
                  )}
                  
                  <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-brand-dark mb-4">What happens next?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <p className="text-sm text-slate-700">Check your email for a confirmation and return shipping label</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <p className="text-sm text-slate-700">Package your item securely with all original materials</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <p className="text-sm text-slate-700">Drop off at any USPS location using the prepaid label</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</div>
                        <p className="text-sm text-slate-700">
                          {formData.requestType === 'return' 
                            ? 'Receive your refund within 5-7 business days after we receive your return'
                            : 'Your exchange will ship within 2 business days after we receive your return'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => {
                        setStep('select');
                        setFormData({
                          orderNumber: '',
                          email: '',
                          requestType: null,
                          reason: '',
                          items: '',
                          comments: '',
                          exchangeSize: '',
                          exchangeColor: ''
                        });
                      }}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Submit Another Request
                    </Button>
                    <Button
                      className="rounded-xl"
                      onClick={() => {
                        window.location.href = 'mailto:support@aerotouch.com?subject=' + encodeURIComponent('Return/Exchange Support');
                      }}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              
              {/* Return Policy */}
              <div className="bg-gradient-to-br from-brand-dark to-slate-800 rounded-3xl shadow-sm border border-slate-700 p-8 text-white">
                <div className="w-12 h-12 bg-brand-lime text-brand-dark rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-4">Our Return Policy</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                    <p>60-day money-back guarantee from purchase date</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                    <p>Free return shipping on all orders</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                    <p>Returns accepted even if trimmed or worn</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                    <p>Full refund to original payment method</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-lime shrink-0 mt-0.5" />
                    <p>No restocking fees or hidden charges</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-orange" />
                  Common Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">How long do refunds take?</p>
                    <p className="text-sm text-slate-600">5-7 business days after we receive your return.</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">Do I need the original packaging?</p>
                    <p className="text-sm text-slate-600">Not required, but please package securely.</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">Can I exchange for a different product?</p>
                    <p className="text-sm text-slate-600">Yes! Just note it in the comments section.</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-dark mb-1">What if my item is defective?</p>
                    <p className="text-sm text-slate-600">We'll expedite a replacement at no cost to you.</p>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
                <h3 className="font-bold text-brand-dark mb-4 text-sm">Need Help?</h3>
                <p className="text-sm text-slate-600 mb-4">Our support team is here to assist you.</p>
                <div className="space-y-2">
                  <a href="mailto:support@aerotouch.com" className="flex items-center gap-2 text-sm text-brand-orange hover:text-orange-600 font-medium">
                    <Mail className="w-4 h-4" />
                    support@aerotouch.com
                  </a>
                  <a href="/track-order" className="flex items-center gap-2 text-sm text-brand-orange hover:text-orange-600 font-medium">
                    <Package className="w-4 h-4" />
                    Track My Return
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
