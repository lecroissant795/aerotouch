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
      <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 backdrop-blur-2xl shadow-[0_15px_35px_rgba(15,23,42,0.1)] p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100/50">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Purchase</p>
               <div className="h-1 w-1 rounded-full bg-slate-200" />
               <p className="text-[10px] font-bold text-emerald-600">Verified</p>
            </div>
            <p className="text-[13px] md:text-sm text-slate-800 leading-snug">
              <span className="font-extrabold text-slate-900">{notification.customer}</span> <span className="text-slate-600">in</span> <span className="font-semibold text-slate-700">{notification.city}</span> <span className="text-slate-600">just bought</span>{' '}
              <span className="font-extrabold text-brand-orange">{notification.product}</span>.
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium text-slate-400">{notification.minutesAgo} min ago</p>
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center rounded-lg bg-slate-900/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-900/10 border border-slate-200/50 transition backdrop-blur-md"
              >
                View Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
