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
  Package,
  TicketPercent,
  ChevronDown
} from 'lucide-react';
import { CartItem, Product } from '../types';
import { Button } from './Button';
import {
  getApplicablePricingTier,
  getApplicablePricingTierIndex,
  getNextPricingTier,
  getPricingProgress,
  PRICING_TIER_POSITIONS,
  PRICING_TIERS
} from '../utils/pricing';
import { getCartLineDisplay, sumCartFinalSubtotals, sumCartLineSavings } from '../utils/cartLineDisplay';
import { BUNDLE_KITS } from '../utils/bundleKits';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, color: string, delta: number) => void;
  onRemoveItem: (id: string, size: string, color: string) => void;
  onCheckout?: () => void;
  /** Called when user taps "Make it a kit" — e.g. close cart and navigate to kits. */
  onMakeItAKit?: () => void;
  isLoading?: boolean;
  /** Live catalog from Shopify — used for rotating cart upsells */
  shopProducts?: Product[];
  onUpsellAdd?: (product: Product) => void;
  onUpsellView?: (product: Product) => void;
  appliedPromoCodes?: string[];
  promoApplyError?: string | null;
  onApplyPromoCode?: (code: string) => void | Promise<void>;
  onRemovePromoCodes?: () => void | Promise<void>;
  onDismissPromoError?: () => void;
  /** When set, cart footer total reflects Shopify checkout subtotal (includes automatic discounts). */
  checkoutSubtotalFromShopify?: number | null;
}

const UPSELL_ROTATE_SECONDS = 10;

const primaryBundleKit = BUNDLE_KITS.find((k) => k.id === 'fascilites-relief')!;

/** Featured kit for "Make it a kit" offer in cart (aligned with Shopify bundle product). */
const MAKE_IT_A_KIT_OFFER = {
  name: primaryBundleKit.name,
  price: primaryBundleKit.price,
  originalPrice: primaryBundleKit.originalPrice,
  image: primaryBundleKit.image,
  blurb: 'Massage Insoles + Massage Roller. Save more when you bundle.'
};

const MAKE_IT_A_KIT_EXCLUDED_HANDLES = new Set<string>([
  'compression-socks',
  'recovery-gel',
  ...BUNDLE_KITS.map((k) => k.handle)
]);

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
  onMakeItAKit,
  isLoading = false,
  shopProducts = [],
  onUpsellAdd,
  onUpsellView,
  appliedPromoCodes = [],
  promoApplyError = null,
  onApplyPromoCode,
  onRemovePromoCodes,
  onDismissPromoError,
  checkoutSubtotalFromShopify = null
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CART_RESERVE_SECONDS);
  const [currentUpsellIndex, setCurrentUpsellIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const upsellRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const eligibleUpsells = useMemo(() => {
    if (!shopProducts.length) return [];
    const blocked = new Set<string>();
    for (const it of items) {
      if (it.productShopifyId) blocked.add(String(it.productShopifyId));
      if (it.productHandle) blocked.add(String(it.productHandle));
      if (it.name) blocked.add(it.name.trim().toLowerCase());
    }
    return shopProducts.filter(p => {
      if (p.id && blocked.has(String(p.id))) return false;
      if (p.handle && blocked.has(String(p.handle))) return false;
      if (p.name && blocked.has(p.name.trim().toLowerCase())) return false;
      return true;
    });
  }, [shopProducts, items]);

  const upsellBlockerKey = useMemo(
    () =>
      items
        .map(i =>
          [i.productShopifyId, i.productHandle, i.name?.trim().toLowerCase()]
            .filter(Boolean)
            .join(':')
        )
        .sort()
        .join(';'),
    [items]
  );

  useEffect(() => {
    setCurrentUpsellIndex(0);
  }, [upsellBlockerKey, shopProducts.length]);

  useEffect(() => {
    if (!isOpen || items.length === 0 || eligibleUpsells.length <= 1) {
      return () => {
        if (upsellRotateRef.current) {
          clearInterval(upsellRotateRef.current);
          upsellRotateRef.current = null;
        }
      };
    }
    const n = eligibleUpsells.length;
    upsellRotateRef.current = setInterval(() => {
      setCurrentUpsellIndex(prev => (prev + 1) % n);
    }, UPSELL_ROTATE_SECONDS * 1000);
    return () => {
      if (upsellRotateRef.current) {
        clearInterval(upsellRotateRef.current);
        upsellRotateRef.current = null;
      }
    };
  }, [isOpen, items.length, eligibleUpsells]);

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

  const subtotal = useMemo(() => sumCartFinalSubtotals(items), [items]);

  const totalYouSave = useMemo(() => sumCartLineSavings(items), [items]);

  /** Prefer Shopify-reported subtotal when available so totals match automatic discounts at checkout. */
  const displayTotal =
    checkoutSubtotalFromShopify != null && Number.isFinite(checkoutSubtotalFromShopify)
      ? checkoutSubtotalFromShopify
      : subtotal;

  const progressWidth = getPricingProgress(itemCount);
  const nextMilestone = getNextPricingTier(itemCount);
  const currentVolumeTier = useMemo(
    () => getApplicablePricingTier(itemCount),
    [itemCount]
  );
  const activeCheckpointIndex = useMemo(
    () => getApplicablePricingTierIndex(itemCount),
    [itemCount]
  );
  const itemsAway = nextMilestone ? nextMilestone.minQty - itemCount : 0;
  const milestoneMessage = nextMilestone
    ? `Add ${itemsAway} more ${itemsAway === 1 ? 'item' : 'items'} to unlock ${nextMilestone.label}.`
    : `${currentVolumeTier.label} — best discount tier applied to your cart.`;
  const finalCheckpointIndex = PRICING_TIERS.length - 1;

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
        <div className="flex h-full min-h-0 flex-col bg-brand-light text-brand-dark shadow-[-8px_0_40px_rgba(0,0,0,0.12)]">
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

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-4">
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
                  {/* Promotion bar — tags at tier milestones */}
                  <div className="mb-4">
                    <p className="mb-2 text-center text-xs font-bold text-brand-dark">
                      {milestoneMessage}
                    </p>
                    <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-brand-orange">
                      Current tier: {currentVolumeTier.checkpointTitle}
                      {currentVolumeTier.discountPercent > 0
                        ? ` · ${currentVolumeTier.discountPercent}% off order`
                        : ' · standard pricing'}
                    </p>
                    <div className="relative w-full">
                      <div className="relative flex h-6 w-full items-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="h-2.5 w-full rounded-full bg-[#D9D9D9]">
                            <div
                              className="h-full rounded-full transition-all duration-500 animate-bar-stripe-run"
                              style={{
                                width: `${progressWidth}%`,
                                backgroundImage:
                                  'repeating-linear-gradient(-45deg, #C1F11D 0px, #C1F11D 4px, rgba(163, 224, 23, 0.7) 4px, rgba(163, 224, 23, 0.7) 8px)',
                                backgroundSize: '11.31px 11.31px'
                              }}
                            />
                          </div>
                        </div>
                        {PRICING_TIER_POSITIONS.map((leftPct, i) => {
                          const isActive = activeCheckpointIndex === i;
                          const isFinalCheckpoint = i === finalCheckpointIndex && isActive;
                          return (
                            <div
                              key={PRICING_TIERS[i].minQty}
                              className={`absolute z-10 flex items-center justify-center rounded-full border-2 bg-white shadow-sm transition-all duration-300 ${
                                isFinalCheckpoint
                                  ? 'h-8 w-8 border-brand-orange ring-[3px] ring-brand-orange/50 bg-orange-50'
                                  : isActive
                                    ? 'h-7 w-7 border-brand-orange ring-2 ring-brand-orange/40'
                                    : 'h-5 w-5 border-[#C1F11D]'
                              }`}
                              style={{
                                left: `${leftPct}%`,
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}
                              aria-current={isActive ? 'step' : undefined}
                            >
                              <Tag
                                className={`${
                                  isFinalCheckpoint
                                    ? 'h-4 w-4 text-brand-orange'
                                    : isActive
                                      ? 'h-3.5 w-3.5 text-brand-orange'
                                      : 'h-2.5 w-2.5 text-[#C1F11D]'
                                }`}
                                strokeWidth={2.5}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="relative mt-2 min-h-[2.75rem]">
                        {PRICING_TIERS.map((m, i) => {
                          const isActive = activeCheckpointIndex === i;
                          const isFinalCheckpoint = i === finalCheckpointIndex && isActive;
                          return (
                            <div
                              key={m.minQty}
                              className="absolute flex max-w-[5.5rem] flex-col items-center gap-0.5 text-center leading-tight"
                              style={{
                                left: `${PRICING_TIER_POSITIONS[i]}%`,
                                transform: 'translateX(-50%)'
                              }}
                            >
                              <span
                                className={`text-[10px] font-bold ${
                                  isFinalCheckpoint ? 'text-brand-orange' : isActive ? 'text-brand-orange' : 'text-brand-dark'
                                }`}
                              >
                                {m.checkpointTitle}
                              </span>
                              <span className="text-[9px] font-semibold leading-snug text-slate-500">
                                {m.checkpointSubtitle}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Cart items */}
                  <ul className="space-y-3">
                    {items.map(item => {
                      const line = getCartLineDisplay(item, itemCount);
                      const eachFinal =
                        line.quantity > 0
                          ? Math.round((line.finalLineSubtotal / line.quantity) * 100) / 100
                          : 0;
                      const variantBits = [item.selectedColor, item.selectedSize]
                        .map((s) => (typeof s === 'string' ? s.trim() : ''))
                        .filter(Boolean);
                      return (
                        <li
                          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col gap-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                              <div className="min-w-0 flex-1 sm:pr-1">
                                <h3 className="break-words text-sm font-bold leading-tight text-brand-dark">
                                  {item.name}
                                </h3>
                                {variantBits.length > 0 && (
                                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                    {variantBits.join(' · ')}
                                  </p>
                                )}
                              </div>
                              {/* MSRP, sale, per-unit, savings — one right-aligned stack (mobile + desktop) */}
                              <div className="flex w-full shrink-0 flex-col items-end gap-0.5 text-right sm:w-auto sm:pl-2">
                                {line.showStrikethrough && (
                                  <p className="text-sm font-semibold tabular-nums text-slate-400 line-through decoration-2">
                                    {formatCurrency(line.originalSubtotal)}
                                  </p>
                                )}
                                <p className="text-base font-bold tabular-nums text-brand-orange">
                                  {formatCurrency(line.finalLineSubtotal)}
                                </p>
                                {line.quantity > 1 && (
                                  <p className="text-[10px] font-medium tabular-nums text-slate-500">
                                    {formatCurrency(eachFinal)} each
                                  </p>
                                )}
                                {line.lineSavings > 0 && (
                                  <p className="mt-0.5 text-right text-[10px] font-bold uppercase leading-snug tracking-wide text-lime-700">
                                    Save {formatCurrency(line.lineSavings)} on this item
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/80 pt-2">
                              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-200">
                                <button
                                  type="button"
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
                                  type="button"
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
                                type="button"
                                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-500 transition hover:text-red-500"
                                onClick={() =>
                                  onRemoveItem(
                                    item.id,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Make it a kit — bundle offer (hidden when cart already has bundle/kit items) */}
                  {onMakeItAKit &&
                    !items.some(
                      (item) =>
                        item.productHandle != null &&
                        MAKE_IT_A_KIT_EXCLUDED_HANDLES.has(item.productHandle)
                    ) && (
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

                  {/* Add more — real store products; rotates when 2+ eligible */}
                  {eligibleUpsells.length > 0 && onUpsellAdd && (() => {
                    const upsellProduct =
                      eligibleUpsells[currentUpsellIndex % eligibleUpsells.length];
                    const showCompare =
                      upsellProduct.compareAtPrice != null &&
                      upsellProduct.compareAtPrice > upsellProduct.price;
                    return (
                      <div className="mt-5">
                        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          From the shop
                        </p>
                        <div
                          key={upsellProduct.id}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-100 p-3 shadow-sm animate-in fade-in duration-300"
                        >
                          <button
                            type="button"
                            className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FF7F27] text-left transition hover:opacity-90"
                            onClick={() => onUpsellView?.(upsellProduct)}
                            aria-label={`View ${upsellProduct.name}`}
                          >
                            <img
                              src={upsellProduct.image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </button>
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left transition hover:opacity-80"
                            onClick={() => onUpsellView?.(upsellProduct)}
                          >
                            <h4 className="text-sm font-extrabold leading-tight text-black">
                              {upsellProduct.name}
                            </h4>
                          </button>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-[#F77421]">
                              {formatCurrency(upsellProduct.price)}
                            </p>
                            {showCompare && (
                              <p className="text-[11px] text-slate-400 line-through">
                                {formatCurrency(upsellProduct.compareAtPrice!)}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded-xl bg-black px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isLoading}
                            onClick={() => onUpsellAdd(upsellProduct)}
                          >
                            Add
                          </button>
                        </div>
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

            {/* Footer — shrink-0 so scroll area gets remaining height; avoids clipping vs absolute + guessed padding */}
            {items.length > 0 && (
              <footer className="shrink-0 border-t border-slate-200 bg-brand-light px-5 py-4">
                {onApplyPromoCode && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setIsPromoOpen(v => !v)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left text-slate-600 transition hover:bg-slate-50"
                      aria-expanded={isPromoOpen}
                      aria-controls="cart-promo-panel"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <TicketPercent className="h-4 w-4 shrink-0 text-brand-orange" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Promo code
                        </span>
                        {appliedPromoCodes.length > 0 && (
                          <span className="rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-lime-900">
                            {appliedPromoCodes.length} applied
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isPromoOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>

                    <div
                      id="cart-promo-panel"
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                        isPromoOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={e => {
                              setPromoInput(e.target.value);
                              onDismissPromoError?.();
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && promoInput.trim() && !isLoading) {
                                e.preventDefault();
                                void onApplyPromoCode(promoInput);
                                setPromoInput('');
                              }
                            }}
                            placeholder="Enter code"
                            autoComplete="off"
                            autoCapitalize="characters"
                            className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-brand-dark placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:outline-none"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            disabled={isLoading || !promoInput.trim()}
                            onClick={() => {
                              const c = promoInput.trim();
                              if (!c) return;
                              void onApplyPromoCode(c);
                              setPromoInput('');
                            }}
                            className="shrink-0 rounded-xl bg-brand-dark px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Apply
                          </button>
                        </div>
                        {appliedPromoCodes.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                              Applied:
                            </span>
                            {appliedPromoCodes.map(code => (
                              <span
                                key={code}
                                className="rounded-lg bg-lime-100 px-2 py-0.5 text-[11px] font-bold text-lime-900"
                              >
                                {code}
                              </span>
                            ))}
                            {onRemovePromoCodes && (
                              <button
                                type="button"
                                onClick={() => void onRemovePromoCodes()}
                                disabled={isLoading}
                                className="text-[11px] font-bold text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-red-600 disabled:opacity-45"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                        {promoApplyError && (
                          <p className="mt-2 text-xs font-medium text-red-600">{promoApplyError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between text-base">
                  <span className="font-extrabold uppercase tracking-wide text-slate-600">
                    You Save:
                  </span>
                  <span
                    className={`font-extrabold uppercase tabular-nums tracking-wide ${totalYouSave > 0 ? 'text-lime-600' : 'text-slate-400'}`}
                  >
                    {formatCurrency(totalYouSave)}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between text-base">
                  <span className="font-extrabold uppercase tracking-wide text-brand-dark">
                    Total
                  </span>
                  <span className="font-extrabold uppercase tabular-nums tracking-wide text-brand-dark">
                    {formatCurrency(displayTotal)}
                  </span>
                </div>
                {checkoutSubtotalFromShopify != null && (
                  <p className="mt-0.5 text-[9px] font-medium text-lime-700">
                    Subtotal matches Shopify (automatic discounts included).
                  </p>
                )}
                <p className="mt-1 text-[10px] text-slate-500">
                  Shipping & taxes at checkout
                </p>
                <Button
                  fullWidth
                  size="lg"
                  className={`mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-lime font-bold text-brand-dark shadow-lg shadow-brand-lime/25 hover:bg-lime-400 transition ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                  onClick={onCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
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
