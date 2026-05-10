import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export const DiscountPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [issuedCode, setIssuedCode] = useState('');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('discount_popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      sessionStorage.setItem('discount_popup_dismissed', '1');
      sessionStorage.setItem('discount_popup_dismissed_at', String(Date.now()));
      window.dispatchEvent(new CustomEvent('discount_popup_dismissed'));
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setEmailSendStatus('sending');
    setSubmitError('');
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    try {
      const response = await fetch('/api/send-popup-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: trimmedFirstName,
          email: trimmedEmail,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Could not send email right now. Please try again in a moment.';
        try {
          const data = await response.json();
          if (typeof data?.error === 'string' && data.error.trim()) {
            errorMessage = data.error;
          }
        } catch {
          const body = await response.text();
          if (body.trim()) errorMessage = body;
        }
        console.error('Failed to send popup email:', response.status, errorMessage);
        setEmailSendStatus('failed');
        setSubmitError(errorMessage);
      } else {
        try {
          const data = await response.json();
          if (typeof data?.code === 'string' && data.code.trim()) {
            setIssuedCode(data.code.trim());
          }
        } catch {
          // success without code in body — still treat as sent
        }
        setEmailSendStatus('sent');
        setSubmitted(true);

        if (supabase) {
          try {
            const { error } = await supabase.from('leads').insert([
              { first_name: trimmedFirstName, email: trimmedEmail }
            ]);
            if (error) {
              console.error('Error saving lead:', error);
            }
          } catch (err) {
            console.error('Unexpected error saving lead:', err);
          }
        } else {
          console.warn('Supabase client not initialized - lead not saved to DB');
        }

        setTimeout(() => {
          handleClose();
        }, 5000);
      }
    } catch (err) {
      console.warn('Popup email endpoint unavailable:', err);
      setEmailSendStatus('failed');
      setSubmitError('Could not connect to email service. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto relative overflow-hidden">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors text-lg"
            aria-label="Close"
          >
            ✕
          </button>



          <div className="px-6 pt-8 pb-8 md:px-8">
            {!submitted ? (
              <>
                {/* Emoji icon */}
                <div className="text-5xl text-center mb-5">🎁</div>

                {/* Heading */}
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
                  Unlock Your <span className="text-brand-orange">Personal</span> Discount
                </h3>
                <p className="text-slate-500 text-center text-sm leading-relaxed mb-6">
                  Enter your first name and email below. We'll send you a <span className="font-bold text-slate-700">unique discount code just for you</span> — personalized with your name! ✨
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="👤 Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="📧 Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailSendStatus === 'sending'}
                    className="w-full text-brand-dark font-black uppercase tracking-wider text-sm py-4 rounded-xl hover:brightness-95 transition-all shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#C1F11D', boxShadow: '0 10px 25px -5px rgba(193, 241, 29, 0.4)' }}
                  >
                    {emailSendStatus === 'sending' ? 'Sending...' : '🔓 Get My Personal Code'}
                  </button>
                </form>

                {emailSendStatus === 'failed' && (
                  <p className="text-red-600 text-xs font-semibold text-center mt-3">
                    {submitError || 'Could not send email right now. Please try again in a moment.'}
                  </p>
                )}

                <p className="text-slate-400 text-[10px] text-center mt-4">
                  🔒 No spam, ever. Unsubscribe anytime. By submitting you agree to our terms.
                </p>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div className="text-5xl mb-5">✅</div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  You're In, {firstName}! 🎉
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Success! Your discount code has been sent to <span className="font-bold text-slate-700">{email}</span>.
                </p>
                {issuedCode && (
                  <div className="mx-auto inline-block px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 mb-2">
                    <span className="text-2xl font-black tracking-wider text-brand-orange">{issuedCode}</span>
                  </div>
                )}
                <p className="mt-4 text-xs font-semibold text-green-600">
                  Check your inbox (and spam folder) in a moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
