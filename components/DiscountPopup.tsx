import React, { useState, useEffect } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DUPLICATE_FALLBACK =
  'This email has already received a discount code. Please check your inbox.';

type SubmitOutcome = 'new' | 'duplicate' | null;

export const DiscountPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<
    'idle' | 'sending' | 'sent' | 'failed'
  >('idle');
  const [submitError, setSubmitError] = useState('');
  const [submitOutcome, setSubmitOutcome] = useState<SubmitOutcome>(null);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('discount_popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => {
      if (!(window as any).__activePopup) {
        (window as any).__activePopup = 'discount';
        setVisible(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      (window as any).__activePopup = null;
      sessionStorage.setItem('discount_popup_dismissed', '1');
      sessionStorage.setItem('discount_popup_dismissed_at', String(Date.now()));
      window.dispatchEvent(new CustomEvent('discount_popup_dismissed'));
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();
    if (!trimmedFirstName || !trimmedEmail) return;

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setSubmitError('Please enter a valid email address.');
      setEmailSendStatus('failed');
      return;
    }

    setEmailSendStatus('sending');
    setSubmitError('');

    try {
      const response = await fetch('/api/send-popup-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: trimmedFirstName,
          email: trimmedEmail,
        }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = (await response.json()) as Record<string, unknown>;
      } catch {
        data = {};
      }

      if (!response.ok) {
        const err =
          typeof data.error === 'string' && data.error.trim()
            ? data.error.trim()
            : 'Could not send email right now. Please try again in a moment.';
        console.error('Failed to send popup email:', response.status, err);
        setEmailSendStatus('failed');
        setSubmitError(err);
        return;
      }

      const isDuplicate = data.duplicate === true;
      setSubmitOutcome(isDuplicate ? 'duplicate' : 'new');
      if (isDuplicate) {
        const msg =
          typeof data.message === 'string' && data.message.trim()
            ? data.message.trim()
            : DUPLICATE_FALLBACK;
        setDuplicateMessage(msg);
      } else {
        setDuplicateMessage('');
      }

      setEmailSendStatus('sent');
      setSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (err) {
      console.warn('Popup email endpoint unavailable:', err);
      setEmailSendStatus('failed');
      setSubmitError('Could not connect to email service. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto relative overflow-hidden">
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
                <div className="text-5xl text-center mb-5">🎁</div>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
                  Unlock Your <span className="text-brand-orange">Personal</span> Discount
                </h3>
                <p className="text-slate-500 text-center text-sm leading-relaxed mb-6">
                  Enter your first name and email below. We&apos;ll send you a{' '}
                  <span className="font-bold text-slate-700">unique discount code</span> — only to
                  your inbox.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3"
                  aria-busy={emailSendStatus === 'sending'}
                >
                  <div>
                    <input
                      type="text"
                      placeholder="👤 Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                      required
                      autoComplete="given-name"
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
                      autoComplete="email"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailSendStatus === 'sending'}
                    className="w-full text-brand-dark font-black uppercase tracking-wider text-sm py-4 rounded-xl hover:brightness-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: '#C1F11D',
                      boxShadow: '0 10px 25px -5px rgba(193, 241, 29, 0.4)',
                    }}
                  >
                    {emailSendStatus === 'sending' ? 'Sending…' : '🔓 Get My Personal Code'}
                  </button>
                </form>

                {emailSendStatus === 'failed' && (
                  <p className="text-red-600 text-xs font-semibold text-center mt-3">
                    {submitError ||
                      'Could not send email right now. Please try again in a moment.'}
                  </p>
                )}

                <p className="text-slate-400 text-[10px] text-center mt-4">
                  🔒 No spam, ever. Unsubscribe anytime. By submitting you agree to our terms.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-5">✅</div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {submitOutcome === 'duplicate' ? 'Check your inbox' : `You're In, ${firstName}! 🎉`}
                </h3>
                {submitOutcome === 'duplicate' ? (
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {duplicateMessage || DUPLICATE_FALLBACK}
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    Success! Your discount code has been sent to{' '}
                    <span className="font-bold text-slate-700">{email.trim()}</span>. We never show
                    the code in this window — only in your email.
                  </p>
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
