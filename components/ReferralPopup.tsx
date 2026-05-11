import React, { useState, useEffect, useRef } from 'react';
import { Users, Gift, Share2, Copy, Check, X } from 'lucide-react';

const REFERRAL_CODE = 'FRIEND15';
const SHARE_URL = 'https://aerotouch.com';
const SHARE_TEXT = `Use my code ${REFERRAL_CODE} to get 15% off your first AeroTouch order! ${SHARE_URL}`;
const DELAY_AFTER_FIRST_POPUP_MS = 6 * 60 * 1000; // 6 minute

export const ReferralPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('referral_popup_dismissed')) return;

    const scheduleShow = (delayMs: number) => {
      timerRef.current = setTimeout(() => setVisible(true), delayMs);
    };

    // Case 1: First popup was already dismissed earlier (e.g. previous session or just now)
    const dismissedAt = sessionStorage.getItem('discount_popup_dismissed_at');
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      scheduleShow(Math.max(0, DELAY_AFTER_FIRST_POPUP_MS - elapsed));
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    // Case 2: Listen for first popup dismiss – then show referral after 1 minute
    const onFirstPopupDismissed = () => {
      scheduleShow(DELAY_AFTER_FIRST_POPUP_MS);
    };
    window.addEventListener('discount_popup_dismissed', onFirstPopupDismissed);
    return () => {
      window.removeEventListener('discount_popup_dismissed', onFirstPopupDismissed);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      sessionStorage.setItem('referral_popup_dismissed', '1');
    }, 300);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = REFERRAL_CODE;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AeroTouch — Give 15%, Get 15%',
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy the full share message
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto relative overflow-hidden">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>



          <div className="px-6 pt-8 pb-8 md:px-8">
            <div className="flex items-center justify-center gap-2 text-brand-orange mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
              Give 15%. Get 15%.
            </h3>
            <p className="text-slate-600 text-center text-sm leading-relaxed mb-6">
              Share your code with friends and family — <strong>you both get 15% off</strong> your next order.
            </p>

            <div className="mb-6">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center mb-2">Your referral code</p>
              <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3">
                <span className="flex-1 font-mono text-xl md:text-2xl font-black tracking-widest text-center text-slate-900">
                  {REFERRAL_CODE}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-shrink-0 p-2.5 rounded-lg bg-brand-orange text-white hover:bg-orange-600 transition-colors"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className={`mt-2 text-xs font-bold text-brand-orange text-center transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                Copied to clipboard!
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full bg-brand-orange text-white font-black uppercase tracking-wider text-sm py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg mb-4"
            >
              {shared ? (
                <>
                  <Check className="w-5 h-5" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Share with Friends
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Gift className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>You & your friend each get 15% off. New customers only.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
