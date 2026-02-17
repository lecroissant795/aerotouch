import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Truck,
  Clock3,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Tag,
  Package
} from 'lucide-react';
import { CartItem } from '../types';
import { Button } from './Button';
import {
  getLinePricing,
  getNextPricingTier,
  getPricingProgress,
  PRICING_TIER_POSITIONS,
  PRICING_TIERS
} from '../utils/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, color: string, delta: number) => void;
  onRemoveItem: (id: string, size: string, color: string) => void;
  onCheckout?: () => void;
  /** Called when user taps "Make it a kit" — e.g. close cart and navigate to kits. */
  onMakeItAKit?: () => void;
}

const UPSELL_PRODUCTS = [
  {
    name: 'Massage Roller',
    price: 29,
    compareAt: 45,
    image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=400&auto=format&fit=crop',
    blurb: 'Add deep tissue relief in seconds with our pro-grade roller.'
  },
  {
    name: 'Recovery Band',
    price: 19,
    compareAt: 32,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop',
    blurb: 'Targeted resistance for calves and arches.'
  },
  {
    name: 'Travel Case',
    price: 15,
    compareAt: 24,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
    blurb: 'Keep your insoles clean and ready on the go.'
  }
];

const UPSELL_ROTATE_SECONDS = 10;

/** Featured kit for "Make it a kit" offer in cart. */
const MAKE_IT_A_KIT_OFFER = {
  name: 'Fascilites Relief Kit',
  price: 48,
  originalPrice: 75,
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  blurb: 'Pro insole + massage ball + compression sock. Save more when you bundle.'
};

const PAYMENT_METHODS = ['Amex', 'Apple Pay', 'Google Pay', 'PayPal', 'Shop Pay', 'VISA'];

const BENEFITS = [
  { icon: Truck, title: 'Tracked & Insured', subtitle: 'Ships in 24h' },
  { icon: ShieldCheck, title: '60-Day Comfort', subtitle: 'Money-back' },
  { icon: Clock3, title: 'Priority Support', subtitle: '24/7 experts' }
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const CART_RESERVE_SECONDS = 5 * 60;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onMakeItAKit
}) => {
  const [secondsLeft, setSecondsLeft] = useState(CART_RESERVE_SECONDS);
  const [currentUpsellIndex, setCurrentUpsellIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const upsellRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setCurrentUpsellIndex(0);
      upsellRotateRef.current = setInterval(() => {
        setCurrentUpsellIndex(prev => (prev + 1) % UPSELL_PRODUCTS.length);
      }, UPSELL_ROTATE_SECONDS * 1000);
    }
    return () => {
      if (upsellRotateRef.current) {
        clearInterval(upsellRotateRef.current);
        upsellRotateRef.current = null;
      }
    };
  }, [isOpen, items.length]);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setSecondsLeft(CART_RESERVE_SECONDS);
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, items.length]);

  const timerMinutes = Math.floor(secondsLeft / 60);
  const timerSecs = secondsLeft % 60;
  const timerDisplay = `${timerMinutes.toString().padStart(2, '0')}:${timerSecs.toString().padStart(2, '0')}`;

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getLinePricing(item.price, item.quantity).total, 0),
    [items]
  );

  const compareAtSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const savings = Math.max(compareAtSubtotal - subtotal, 0);
  const progressWidth = getPricingProgress(itemCount);
  const nextMilestone = getNextPricingTier(itemCount);

  const itemsAway = nextMilestone ? nextMilestone.minQty - itemCount : 0;
  const milestoneMessage = nextMilestone
    ? `You're ${itemsAway} ${itemsAway === 1 ? 'item' : 'items'} away from a ${nextMilestone.label.replace(' OFF', '')} discount!`
    : "🎉 Congrats, you've unlocked our best pricing!";

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden
      />

      <aside
        className="fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] animate-in slide-in-from-right duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col bg-brand-light text-brand-dark shadow-[-8px_0_40px_rgba(0,0,0,0.12)]">
          {/* Top accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-brand-orange via-brand-orange/80 to-transparent" />

          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
                <ShoppingBag className="h-4 w-4 text-brand-dark" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-brand-dark">
                  Cart
                </h2>
                <p className="text-xs text-slate-500">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-brand-dark"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-4 pb-32">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange/15">
                    <Sparkles className="h-8 w-8 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 max-w-[240px] text-sm text-slate-500">
                    Add AeroTouch gear to unlock savings and free shipping.
                  </p>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="mt-6"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  {/* Promotion bar — tags centered on bar, equidistant at 0%, 50%, 100% */}
                  <div className="mb-4">
                    <p className="text-center text-xs font-bold text-brand-dark mb-3">
                      {milestoneMessage}
                    </p>
                    <div className="relative w-full">
                      {/* Bar + tag circles */}
                      <div className="relative flex h-6 w-full items-center">
                        {/* Track bg */}
                        <div className="absolute inset-0 flex items-center">
                          <div className="h-2.5 w-full rounded-full bg-[#D9D9D9]">
                            <div
                              className="h-full rounded-full transition-all duration-500 animate-bar-stripe-run"
                              style={{
                                width: `${progressWidth}%`,
                                backgroundImage: 'repeating-linear-gradient(-45deg, #C1F11D 0px, #C1F11D 4px, rgba(163, 224, 23, 0.7) 4px, rgba(163, 224, 23, 0.7) 8px)',
                                backgroundSize: '11.31px 11.31px'
                              }}
                            />
                          </div>
                        </div>
                        {/* Tag circles at pricing milestones */}
                        {PRICING_TIER_POSITIONS.map((leftPct, i) => (
                          <div
                            key={i}
                            className="absolute z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#C1F11D] bg-white"
                            style={{
                              left: `${leftPct}%`,
                              top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <Tag className="h-2.5 w-2.5 text-[#C1F11D]" strokeWidth={2.5} />
                          </div>
                        ))}
                      </div>
                      {/* Labels pinned under each tag circle */}
                      <div className="relative mt-1.5 h-4">
                        {PRICING_TIERS.map((m, i) => (
                          <span
                            key={m.minQty}
                            className="absolute text-[10px] font-semibold text-brand-dark"
                            style={{
                              left: `${PRICING_TIER_POSITIONS[i]}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cart items */}
                  <ul className="space-y-3">
                    {items.map(item => {
                      const linePricing = getLinePricing(item.price, item.quantity);
                      const compareAtPrice = item.price;
                      const discountPercent = linePricing.discountPercent;
                      return (
                        <li
                          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="flex gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3"
                        >
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-brand-dark leading-tight">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-[11px] text-slate-500 uppercase tracking-wider">
                              {item.selectedColor} · {item.selectedSize}
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 rounded-lg bg-slate-200">
                                <button
                                  className="p-1.5 text-slate-600 hover:text-brand-orange disabled:opacity-40"
                                  disabled={item.quantity <= 1}
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.id,
                                      item.selectedSize,
                                      item.selectedColor,
                                      -1
                                    )
                                  }
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-[1.25rem] text-center text-sm font-medium text-brand-dark">
                                  {item.quantity}
                                </span>
                                <button
                                  className="p-1.5 text-slate-600 hover:text-brand-orange"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.id,
                                      item.selectedSize,
                                      item.selectedColor,
                                      1
                                    )
                                  }
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <button
                                className="inline-flex items-center gap-1 text-[11px] text-slate-500 transition hover:text-red-500"
                                onClick={() =>
                                  onRemoveItem(
                                    item.id,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(compareAtPrice)}
                            </p>
                            <p className="text-base font-bold text-brand-orange">
                              {formatCurrency(linePricing.unitPrice)}
                            </p>
                            <p className="text-[10px] font-medium text-brand-orange">
                              Save {discountPercent}%
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Make it a kit — bundle offer (hidden when cart already has bundle/kit items) */}
                  {onMakeItAKit && !items.some(item => ['compression-socks', 'recovery-gel', 'fascilites-relief', 'complete-recovery-kit', 'heel-relief', 'toe-relief'].includes(item.id)) && (
                    <div className="mt-5 rounded-2xl border-2 border-brand-orange/30 bg-gradient-to-br from-orange-50/80 to-slate-50 p-3 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                          Make it a kit
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                          <img
                            src={MAKE_IT_A_KIT_OFFER.image}
                            alt={MAKE_IT_A_KIT_OFFER.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold leading-tight text-brand-dark">
                            {MAKE_IT_A_KIT_OFFER.name}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-slate-600">
                            {MAKE_IT_A_KIT_OFFER.blurb}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-sm font-bold text-brand-orange">
                              {formatCurrency(MAKE_IT_A_KIT_OFFER.price)}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(MAKE_IT_A_KIT_OFFER.originalPrice)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={onMakeItAKit}
                          className="shrink-0 rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-brand-orange/25 transition hover:bg-orange-600"
                        >
                          View kits
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add more — rotates to next product every 10s so customer can discover other add-ons */}
                  {(() => {
                    const upsellProduct = UPSELL_PRODUCTS[currentUpsellIndex];
                    return (
                      <div
                        key={upsellProduct.name}
                        className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-100 border border-slate-200/80 p-3 shadow-sm animate-in fade-in duration-300"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FF7F27]">
                          <img
                            src={upsellProduct.image}
                            alt={upsellProduct.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold leading-tight text-black">
                            {upsellProduct.name}
                          </h4>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-[#F77421]">
                            {formatCurrency(upsellProduct.price)}
                          </p>
                          <p className="text-[11px] text-slate-400 line-through">
                            {formatCurrency(upsellProduct.compareAt)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 rounded-xl bg-black px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800"
                        >
                          ADD
                        </button>
                      </div>
                    );
                  })()}

                  {/* Trust row */}
                  <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-100 px-5 py-4">
                    {BENEFITS.map(({ icon: Icon, title, subtitle }) => (
                      <div
                        key={title}
                        className="flex flex-col items-center gap-2 text-center"
                      >
                        <Icon className="h-7 w-7 text-black" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-black">
                          {title}
                        </span>
                        <span className="text-[11px] font-bold text-black">
                          {subtitle}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Timer */}
                  <div
                    className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 ${
                      secondsLeft <= 60
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-lime-50 text-lime-800 border border-lime-200'
                    }`}
                  >
                    <Clock3
                      className={`h-4 w-4 ${secondsLeft <= 60 ? 'animate-pulse' : ''}`}
                    />
                    <span className="text-xs font-semibold">
                      Reserved {timerDisplay}
                      {secondsLeft <= 60 && secondsLeft > 0 && (
                        <span className="ml-1 text-red-600">— Hurry!</span>
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-brand-light px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">You save</span>
                  <span className="font-bold text-lime-600">
                    {formatCurrency(Number.isFinite(savings) ? savings : 0)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-semibold text-brand-dark">
                    Total
                  </span>
                  <span className="text-xl font-bold text-brand-dark">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Shipping & taxes at checkout
                </p>
                <Button
                  fullWidth
                  size="lg"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-lime font-bold text-brand-dark shadow-lg shadow-brand-lime/25 hover:bg-lime-400 transition"
                  onClick={onCheckout}
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                  {PAYMENT_METHODS.map(m => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </footer>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
