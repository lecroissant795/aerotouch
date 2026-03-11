import React, { useEffect, useRef, useState } from 'react';

type PurchaseNotification = {
  id: number;
  customer: string;
  city: string;
  product: string;
  minutesAgo: number;
};

const CUSTOMER_NAMES = [
  'Emma',
  'Noah',
  'Olivia',
  'Liam',
  'Ava',
  'Mason',
  'Sophia',
  'Ethan',
  'Mia',
  'Lucas'
];

const CITIES = [
  'Austin, TX',
  'Miami, FL',
  'Denver, CO',
  'Seattle, WA',
  'Phoenix, AZ',
  'Nashville, TN',
  'Chicago, IL',
  'San Diego, CA'
];

const MAIN_PRODUCT = 'Massage Insoles';

const BUNDLE_KITS = [
  'Starter Recovery Kit',
  'Runner Essentials Bundle',
  'Athlete Bundle Kit',
  'Daily Comfort Kit'
];

const OTHER_PRODUCTS = [
  'Recovery Gel',
  'Compression Socks',
  'Massage Roller',
  'Massage Ball',
  'Foot Cream'
];

const randomItem = (items: string[]): string => items[Math.floor(Math.random() * items.length)];

const pickWeightedProduct = (): string => {
  const roll = Math.random(); // 0..1

  // 25%: main product
  if (roll < 0.25) {
    return MAIN_PRODUCT;
  }

  // 45%: any bundle kit (0.25 -> 0.70)
  if (roll < 0.7) {
    return randomItem(BUNDLE_KITS);
  }

  // 30%: all other products
  return randomItem(OTHER_PRODUCTS);
};

const createNotification = (): PurchaseNotification => ({
  id: Date.now(),
  customer: randomItem(CUSTOMER_NAMES),
  city: randomItem(CITIES),
  product: pickWeightedProduct(),
  minutesAgo: Math.floor(Math.random() * 8) + 1
});

type LivePurchaseNotificationProps = {
  onCtaClick?: () => void;
};

export const LivePurchaseNotification: React.FC<LivePurchaseNotificationProps> = ({ onCtaClick }) => {
  const [notification, setNotification] = useState<PurchaseNotification | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const firstShowTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const showNotification = () => {
      setNotification(createNotification());
      setVisible(true);

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 6500);
    };

    firstShowTimerRef.current = window.setTimeout(showNotification, 1000);
    intervalRef.current = window.setInterval(showNotification, 30000);

    return () => {
      if (firstShowTimerRef.current) {
        window.clearTimeout(firstShowTimerRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-[70] w-[calc(100vw-2rem)] max-w-[360px] md:bottom-6 md:right-6 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-[0_14px_40px_rgba(15,23,42,0.18)] p-4">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-lime via-emerald-300 to-brand-lime" />
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Live Purchase</p>
            <p className="text-[13px] md:text-sm text-slate-800 leading-snug">
              <span className="font-bold">{notification.customer}</span> in <span className="font-semibold">{notification.city}</span> just bought{' '}
              <span className="font-bold text-brand-orange">{notification.product}</span>.
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold text-slate-500">{notification.minutesAgo} min ago</p>
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center rounded-full bg-brand-lime px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark hover:brightness-95 transition"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
