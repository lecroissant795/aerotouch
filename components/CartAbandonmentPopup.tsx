import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CartItem } from '../types';
import { useCurrency } from '../utils/CurrencyContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CROSS_SESSION_KEY = 'cart_abandon_last_shown';
const CROSS_SESSION_COOLDOWN_DAYS = 7;
const SESSION_KEY = 'cart_abandon_popup_dismissed';
const IDLE_TIMEOUT_MS = 90_000;

interface CartAbandonmentPopupProps {
  cartItems: CartItem[];
  checkoutUrl: string | null;
}

export const CartAbandonmentPopup: React.FC<CartAbandonmentPopupProps> = ({
  cartItems,
  checkoutUrl,
}) => {
  const { formatMoney, currency } = useCurrency();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  const shownRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canShow = useCallback((): boolean => {
    if (shownRef.current) return false;
    if (cartItems.length === 0) return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    if ((window as any).__activePopup) return false;

    const lastShown = localStorage.getItem(CROSS_SESSION_KEY);
    if (lastShown) {
      const elapsed = Date.now() - Number(lastShown);
      if (elapsed < CROSS_SESSION_COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return false;
    }

    return true;
  }, [cartItems.length]);

  const show = useCallback(() => {
    if (!canShow()) return;
    shownRef.current = true;
    (window as any).__activePopup = 'cart_abandon';
    setVisible(true);
  }, [canShow]);

  // Desktop exit intent: mouse leaves viewport toward top
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [show]);

  // Mobile: tab/app switch (visibility change)
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'hidden') show();
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [show]);

  // Idle timer: no interaction for 90s with cart items
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (cartItems.length > 0) {
        idleTimerRef.current = setTimeout(() => show(), IDLE_TIMEOUT_MS);
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetIdle));
    };
  }, [cartItems.length, show]);

  // Cart drawer close detection: listen for custom event from App.tsx
  useEffect(() => {
    const handler = () => {
      setTimeout(() => show(), 0);
    };
    window.addEventListener('cart_drawer_closed_with_items', handler);
    return () => window.removeEventListener('cart_drawer_closed_with_items', handler);
  }, [show]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      sessionStorage.setItem(SESSION_KEY, '1');
      localStorage.setItem(CROSS_SESSION_KEY, String(Date.now()));
      (window as any).__activePopup = null;
    }, 300);
  }, []);

  // Escape key closes
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setSendStatus('failed');
      return;
    }

    setSendStatus('sending');
    setErrorMsg('');

    try {
      const response = await fetch('/api/cart-abandonment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          cartItems: cartItems.map((item) => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            handle: item.handle || item.productHandle,
          })),
          cartTotal: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
          checkoutUrl,
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
            : 'Something went wrong. Please try again.';
        setSendStatus('failed');
        setErrorMsg(err);
        return;
      }

      setIsDuplicate(data.duplicate === true);
      setSendStatus('sent');
      setSubmitted(true);
      setTimeout(() => handleClose(), 5000);
    } catch {
      setSendStatus('failed');
      setErrorMsg('Could not connect. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
        aria-hidden
      />

      {/* Dialog */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto relative overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Cart recovery offer"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors text-lg"
            aria-label="Close"
          >
            &#10005;
          </button>

          <div className="px-6 pt-8 pb-8 md:px-8">
            {!submitted ? (
              <>
                <div className="text-5xl text-center mb-4">&#128722;</div>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
                  Wait — you forgot something!
                </h3>
                <p className="text-slate-500 text-center text-sm leading-relaxed mb-2">
                  Get <span className="font-bold text-brand-orange">15% off</span> your cart
                  right now.
                </p>

                {/* Mini cart preview */}
                {cartItems.length > 0 && (
                  <div className="flex flex-col gap-2 bg-slate-50 rounded-xl p-3 mb-5">
                    {cartItems.slice(0, 3).map((item, i) => {
                      const itemCurrency = (item.currencyCode || currency) as any;
                      const hasCompare = item.compareAtPrice != null && item.compareAtPrice > item.price;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-slate-200">
                            {item.image && (
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-700 font-medium truncate">{item.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-slate-900">
                                {formatMoney(item.price, itemCurrency)}
                              </span>
                              {hasCompare && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  {formatMoney(item.compareAtPrice!, (item.compareAtCurrencyCode || itemCurrency) as any)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {cartItems.length > 3 && (
                      <p className="text-[10px] text-slate-400 text-center">
                        +{cartItems.length - 3} more item{cartItems.length > 4 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-slate-500 text-center text-xs leading-relaxed mb-5">
                  Enter your email and we'll send you an exclusive{' '}
                  <span className="font-bold text-slate-700">15% off code</span> for your
                  cart.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3" aria-busy={sendStatus === 'sending'}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={sendStatus === 'sending'}
                    className="w-full text-brand-dark font-black uppercase tracking-wider text-sm py-4 rounded-xl hover:brightness-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: '#C1F11D',
                      boxShadow: '0 10px 25px -5px rgba(193, 241, 29, 0.4)',
                    }}
                  >
                    {sendStatus === 'sending' ? 'Sending...' : 'Get My 15% Off Code'}
                  </button>
                </form>

                {sendStatus === 'failed' && (
                  <p className="text-red-600 text-xs font-semibold text-center mt-3">
                    {errorMsg || 'Something went wrong. Please try again.'}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="block mx-auto mt-4 text-slate-400 text-xs hover:text-slate-600 transition-colors"
                >
                  No thanks, I'll pay full price
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-5">&#9989;</div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {isDuplicate ? 'Check your inbox' : 'Your code is on the way!'}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {isDuplicate
                    ? 'You already have a cart recovery code. Check your inbox.'
                    : `We've sent your 15% off code to ${email.trim()}. Use it at checkout before it expires!`}
                </p>
                <p className="mt-4 text-xs font-semibold text-green-600">
                  Check your inbox (and spam folder).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
