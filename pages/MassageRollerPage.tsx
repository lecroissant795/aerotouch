import React from 'react';
import { Check } from 'lucide-react';
import { Product } from '../types';
import { SecondaryProductPage } from './SecondaryProductPage';
import { reviewAvatars } from '../utils/mediaUrls';

/** Display-only compare-at (MSRP) for the Massage Roller custom PDP. Live price comes from Shopify / product state. */
export const MASSAGE_ROLLER_COMPARE_AT_PRICE = 68;

const MASSAGE_ROLLER_TESTIMONIALS = [
  {
    name: 'Danielle K.',
    role: 'RN, 12-hour shifts',
    image: reviewAvatars.nicoleP,
    quote:
      'After long hospital shifts my arches used to ache nonstop. A few minutes on this roller before bed and the tightness actually melts away.',
    result: 'Daily foot relief without a spa visit'
  },
  {
    name: 'Marcus T.',
    role: 'Half marathon runner',
    image: reviewAvatars.marcusT,
    quote:
      'I use it on my plantar fascia and calves after tempo runs. Small enough for my gym bag but it hits the sore spots better than a tennis ball.',
    result: 'Faster bounce-back between training days'
  },
  {
    name: 'Elena R.',
    role: 'Retail manager',
    image: reviewAvatars.sarahJ,
    quote:
      'I am on concrete floors all day. Rolling for two minutes when I get home is the only thing that quiets the burning in my heels.',
    result: 'Less heel fatigue after long shifts'
  }
];

const MASSAGE_ROLLER_FAQS = [
  {
    question: 'How do I use the massage roller?',
    answer:
      'Sit on a stable chair and place the AeroTouch Foot Massage Roller on the floor. Rest your foot on top, apply comfortable pressure, and roll slowly from the heel through the arch toward the ball of the foot. Spend about 1–2 minutes per foot, once or twice a day or whenever feet feel tight. You can also roll calves or forearms using the same slow, controlled motion—avoid aggressive pressure or rolling over painful injuries.'
  },
  {
    question: 'What is the return policy?',
    answer:
      'Try the AeroTouch Foot Massage Roller for 30 days risk-free. If you are not satisfied, contact us for a full refund—we will make it right.'
  },
  {
    question: 'Is the massage roller safe for daily use?',
    answer:
      'Yes. For most people it is intended for daily tension relief when used with moderate, comfortable pressure. Start gently if your feet are very sore or sensitive. If you have a medical condition (such as severe neuropathy, open sores, or a recent foot injury), ask your doctor before use.'
  }
];

interface MassageRollerPageProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  onBack: () => void;
  onProductSelect?: (product: Product) => void;
  isLoading?: boolean;
  error?: string | null;
}

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2">
    <Check className="w-4 h-4 text-brand-dark mt-0.5 flex-shrink-0" strokeWidth={2.5} />
    <span className="text-sm md:text-[15px] leading-relaxed text-slate-600">{children}</span>
  </li>
);

/** Right detail card: specs + guarantee only */
const MassageRollerDetailCardBody: React.FC = () => (
  <div className="space-y-8 text-slate-600">
    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Deep Relief, Engineered In</h3>
      <ul className="space-y-2.5">
        <Bullet>
          <span className="font-bold text-slate-900">Trigger point massage nodes</span> penetrate deep into the plantar
          fascia, breaking up tension and stimulating blood flow where it&apos;s needed most
        </Bullet>
        <Bullet>
          <span className="font-bold text-slate-900">Ergonomic arch-contoured design</span> cradles the natural curve of
          your foot for maximum contact and pressure
        </Bullet>
        <Bullet>
          <span className="font-bold text-slate-900">Multi-zone use</span> — works on the arch, heel, ball of foot,
          calves, and even forearms
        </Bullet>
        <Bullet>
          <span className="font-bold text-slate-900">Compact and portable</span> — fits in a gym bag, desk drawer, or
          beside your bed for on-demand relief
        </Bullet>
        <Bullet>
          <span className="font-bold text-slate-900">Durable, premium-grade materials</span> built to last through daily
          use
        </Bullet>
      </ul>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-black text-slate-900 mb-2">AeroTouch 100% Money-Back Guarantee.</p>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Try it for 30 days. If you don&apos;t feel the difference, AeroTouch will refund every penny.
      </p>
    </div>
  </div>
);

/** Below testimonial card: hero story + usage + audience */
const MassageRollerBelowTestimonials: React.FC = () => (
  <div className="mt-8 space-y-8 text-slate-600 border-t border-slate-200 pt-8">
    <div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-snug mb-3">
        Roll Away the Pain. Anywhere. Anytime.
      </h2>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Your feet carry you through everything — long shifts, hard workouts, hours of standing. By the end of the day,
        the tension builds up in your arches, your calves, your heels. Stretching helps a little. Rest helps a little
        more. But nothing targets that deep, knotted soreness like the{' '}
        <span className="font-bold text-slate-900">AeroTouch Foot Massage Roller</span>.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Two Minutes. Real Results.</h3>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Sit down, place the roller under your foot, and apply gentle pressure as you roll. Within minutes, you&apos;ll
        feel the tension release — that satisfying, almost-painful relief that tells you it&apos;s working. Do it morning
        and evening and your feet will feel transformed within a week.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Who It&apos;s For</h3>
      <ul className="space-y-2.5">
        <Bullet>Plantar fasciitis sufferers looking for daily relief without a clinic visit</Bullet>
        <Bullet>Runners, hikers, and athletes managing foot and calf soreness</Bullet>
        <Bullet>Healthcare workers, teachers, and retail staff on their feet all day</Bullet>
        <Bullet>Anyone who wants a spa-quality foot massage at home</Bullet>
      </ul>
    </div>
  </div>
);

/**
 * Dedicated product page for the Massage Roller (compare-at sale merchandising).
 * Reuses the accessory layout from SecondaryProductPage with a fixed MSRP anchor.
 */
export const MassageRollerPage: React.FC<MassageRollerPageProps> = (props) => (
  <SecondaryProductPage
    {...props}
    compareAtPrice={MASSAGE_ROLLER_COMPARE_AT_PRICE}
    detailCardBody={<MassageRollerDetailCardBody />}
    belowTestimonials={<MassageRollerBelowTestimonials />}
    faqs={MASSAGE_ROLLER_FAQS}
    testimonials={MASSAGE_ROLLER_TESTIMONIALS}
  />
);
