import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product } from '../types';
import { Button } from '../components/Button';
import { Star, Truck, RotateCcw, Check, ShoppingBag, ShieldCheck, Timer, Users, CreditCard, Lock, ChevronDown, ChevronUp, Flame, BadgeCheck, Smile, Headphones, X, Play, Volume2, VolumeX, MapPin, Box, CircleDollarSign, Activity, Wrench, Tag } from 'lucide-react';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { fetchProductByHandle } from '../utils/productFetcher';
import { useProductMetafields } from '../utils/useProductMetafields';
import { ProductCard } from '../components/ProductCard';
import {
  findVariantBySizeAndColor,
  variantSalePrice,
  variantCompareAt
} from '../utils/shopifyVariantMoney';
import { ProductDescription } from '../components/ProductDescription';
import { ReferralSection } from '../components/ReferralSection';
import { GivingBackSection } from '../components/GivingBackSection';
import { useSocialProof } from '../hooks/useSocialProof';
import { isHeightBoosterProduct } from '../utils/productDetection';
import {
  HEIGHT_BOOSTERS_PDP_COPY,
  HEIGHT_BOOSTERS_STORY_BELOW_TESTIMONIALS,
  HEIGHT_BOOSTER_FAQS,
  HEIGHT_BOOSTER_QUICK_USES,
  HEIGHT_BOOSTER_TESTIMONIALS
} from '../utils/heightBoostersCopy';
import { MASSAGE_GUN_PDP_COPY } from '../utils/productMapping';

const BenefitBullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2">
    <Check className="w-4 h-4 text-brand-dark mt-0.5 flex-shrink-0" strokeWidth={2.5} />
    <span className="text-sm md:text-[15px] leading-relaxed text-slate-600">{children}</span>
  </li>
);

const TOE_CUSHION_PADS_OVERRIDE = {
  tagline: 'Low-profile protection where shoes rub most',
  description:
    'Shoes shouldn’t punish your toes.\n\n' +
    'That sharp rubbing at the front of your shoe can turn a normal day into a painful one—especially when you’re walking, standing, or training. Toe Cushion Pads create a soft barrier between your toes and friction points so you can move without constantly thinking about discomfort.\n\n' +
    'Built for all-day wear, they help cushion pressure, reduce irritation, and keep you comfortable in everything from sneakers to dress shoes.',
  features: [
    'Friction shield: Helps reduce rubbing and pressure on sensitive toe zones',
    'Soft cushioning: Adds comfort without making your shoes feel tight',
    'Invisible profile: Low‑key fit that stays discreet inside most footwear',
    'Skin-friendly feel: Smooth material designed to minimize irritation',
    'Reusable wear: Easy to clean and ready for repeat use'
  ],
};

const HEEL_CUSHIONS_OVERRIDE = {
  tagline: 'Invisible heel protection for long days',
  description:
    'Your heels take a beating every day — it’s time to protect them.\n\n' +
    'Hard floors. Long shifts. Shoes that weren’t designed with your comfort in mind. By the end of the day, your heels feel it — that deep ache that makes every step a reminder.\n\n' +
    'AeroTouch Heel Cushions sit quietly inside your shoe and absorb the punishment so your heels don’t have to.\n\n' +
    'Slip them in before you leave the house and forget they’re there. That’s the point — invisible protection that lets you focus on your day, not your feet.',
  features: [
    'Premium cotton cushioning: Soft, cloud-like layer between your heel and the shoe base',
    'Friction-reducing design: Helps prevent rubbing that can lead to blisters and irritation',
    'Self-adhesive backing: Sticks firmly inside your shoe — no sliding, no repositioning',
    'Non-slip grip: Helps keep your foot stable so your shoe stays where it should',
    'Universal fit: Works in sneakers, dress shoes, boots, heels, and more'
  ],
};

/** Toe Cushion Pads: match Massage Roller detail-card tone/format (headline + 5 scannable benefits). */
const ToeCushionPadsDetailCardBody: React.FC = () => (
  <div className="space-y-8 text-slate-600">
    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">
        Shoes Shouldn&apos;t Hurt Your Toes
      </h3>
      <p className="text-sm md:text-[15px] leading-relaxed">
        That burning, rubbing feeling at the front of your shoe builds fast — on walks, during workouts, or after hours
        on your feet. Toe Cushion Pads add a soft, invisible layer of comfort right where friction hits hardest, so you
        can move through your day without the constant “hot spot” distraction.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Designed for Invisible Comfort</h3>
      <ul className="space-y-2.5">
        <BenefitBullet>
          <span className="font-bold text-slate-900">Friction &amp; pressure relief</span> helps prevent rubbing and
          reduces discomfort on sensitive toe areas
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Soft cushioning that stays slim</span> — comfort without making
          your shoes feel tight
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Low-profile, discreet wear</span> fits easily inside most sneakers,
          flats, and dress shoes
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Smooth, skin-friendly feel</span> designed to minimize irritation
          for all-day use
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Reusable &amp; easy to clean</span> — rinse, air dry, and wear again
        </BenefitBullet>
      </ul>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-black text-slate-900 mb-2">AeroTouch 60-Day Money-Back Guarantee.</p>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Try them for 60 days. If you don&apos;t feel the difference, AeroTouch will refund every penny.
      </p>
    </div>
  </div>
);

/** Heel Cushions: match Toe Cushion Pads detail-card tone/format (headline + scannable benefits + use cases). */
const HeelCushionsDetailCardBody: React.FC = () => (
  <div className="space-y-8 text-slate-600">
    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">
        Your Heels Take a Beating Every Day
      </h3>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Hard floors. Long shifts. Shoes that weren’t built for comfort. By the end of the day, your heels feel it — that
        deep ache that makes every step a reminder.{' '}
        <span className="font-bold text-slate-900">AeroTouch Heel Cushions</span> sit quietly inside your shoe and absorb
        the punishment so your heels don’t have to.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">What Makes Them Work</h3>
      <ul className="space-y-2.5">
        <BenefitBullet>
          <span className="font-bold text-slate-900">Premium cotton cushioning</span> provides a soft, cloud-like layer
          between your heel and the shoe base
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Friction-reducing design</span> helps prevent rubbing that can cause
          blisters, calluses, and irritation
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Self-adhesive backing</span> sticks firmly inside your shoe — no
          sliding, no repositioning
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Non-slip grip</span> helps keep your foot stable so your shoe stays
          where it should
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Universal fit</span> works in sports shoes, leather shoes, boots,
          heels, and more
        </BenefitBullet>
      </ul>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Small Addition. Big Difference.</h3>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Slip them in before you leave the house and forget they’re there. That’s the point — invisible protection that
        lets you focus on your day, not your feet.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Perfect For</p>
      <ul className="mt-3 space-y-2 text-sm md:text-[15px] leading-relaxed">
        {[
          'Anyone breaking in new shoes',
          'People with heel pain, bursitis, or sensitive skin',
          'Shoes that are slightly too big and need a snugger fit',
          'Long days on hard floors where every step counts'
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-dark shrink-0" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-black text-slate-900 mb-2">AeroTouch 60-Day Money-Back Guarantee.</p>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Try them for 60 days. If you don&apos;t feel the difference, AeroTouch will refund every penny.
      </p>
    </div>
  </div>
);

/** Toe Spacers: long-form story (matches attached reference structure, styled to AeroTouch). */
const ToeSpacersBelowTestimonials: React.FC = () => (
  <div className="mt-8 space-y-8 text-slate-600 border-t border-slate-200 pt-8">
    <div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-snug mb-3">
        Give Your Toes the Space They Were Born With.
      </h2>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Modern shoes squeeze toes into narrow shapes. Over time, that constant compression can leave your forefoot
        feeling tight, irritated, and unstable — making every step feel “off.”{' '}
        <span className="font-bold text-slate-900">AeroTouch Toe Spacers</span> provide a gentle reset by encouraging a
        more natural toe splay, helping your feet feel freer, more grounded, and more comfortable with consistent use.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">How They Work</h3>
      <ul className="space-y-2.5">
        <BenefitBullet>
          <span className="font-bold text-slate-900">Soft, medical‑grade silicone</span> rests comfortably between toes
          to encourage separation without harsh pressure
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Releases built-up tension</span> by helping toes and the forefoot
          relax after long days on your feet or restrictive footwear
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Improves toe splay &amp; balance</span> to support a more stable
          base and better “grounding” during low-impact movement
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Low-impact versatility</span> — ideal for lounging, stretching,
          mobility work, or winding down after training
        </BenefitBullet>
        <BenefitBullet>
          <span className="font-bold text-slate-900">Reusable &amp; easy to clean</span> — rinse with mild soap, air dry,
          and wear again
        </BenefitBullet>
      </ul>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">The Recovery Ritual Your Feet Need</h3>
      <p className="text-sm md:text-[15px] leading-relaxed">
        Wear them for 20–30 minutes a day during downtime — watching TV, reading, or after workouts. Many people notice
        less “cramped” forefoot tension within the first few sessions, with longer-term improvements in comfort and toe
        alignment over weeks of consistent use.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Perfect For</h3>
      <ul className="space-y-2.5">
        <BenefitBullet>Bunion-prone feet and overlapping toes — a simple, non-invasive reset routine</BenefitBullet>
        <BenefitBullet>Runners and athletes who feel tight, compressed toes after training</BenefitBullet>
        <BenefitBullet>Long days in narrow shoes (dress shoes, heels, rigid boots)</BenefitBullet>
        <BenefitBullet>Yoga, Pilates, and balance work — to improve toe dexterity and grounding</BenefitBullet>
      </ul>
    </div>
  </div>
);

interface SecondaryProductPageProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  onBack: () => void;
  onProductSelect?: (product: Product) => void;
  isLoading?: boolean;
  error?: string | null;
  /** Optional MSRP / compare-at price (e.g. custom PDPs). Shown struck-through when above the live sale price. */
  compareAtPrice?: number;
  /** When set, replaces the default description / metafield bullets / feature list in the right detail card. */
  detailCardBody?: React.ReactNode;
  /** Optional block rendered below the testimonial card (same column as FAQs / trust grid). */
  belowTestimonials?: React.ReactNode;
  /** Override default accessory FAQs (e.g. Massage Roller–specific copy). */
  faqs?: { question: string; answer: string }[];
  /** Override rotating testimonial card (same shape as default). */
  testimonials?: {
    name: string;
    role: string;
    image: string;
    quote: string;
    result: string;
  }[];
  /** Giving Back “Learn More” — same destination as primary PDP (comfort article). */
  onNavigateToBlog?: () => void;
}

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Fitness Enthusiast',
    image: '',
    quote: 'Great product! Really helps with recovery after my workouts.',
    result: 'Improved recovery time'
  },
  {
    name: 'Mike T.',
    role: 'Office Worker',
    image: '',
    quote: 'Use these daily at work. Makes a huge difference in comfort.',
    result: 'All-day comfort achieved'
  },
  {
    name: 'Emily R.',
    role: 'Athlete',
    image: '',
    quote: 'Excellent quality and durability. Would highly recommend!',
    result: 'Perfect for athletic use'
  }
];

const DEFAULT_FAQS = [
  {
    question: 'How do I use this product?',
    answer: 'Simply follow the included instructions. Most products are designed for easy at-home use.'
  },
  {
    question: 'What is the return policy?',
    answer: 'We offer a 60-day risk-free guarantee. If you\'re not satisfied, contact us for a full refund.'
  },
  {
    question: 'Is this product safe for daily use?',
    answer: 'Yes, all our products are designed for regular use and made with body-safe materials.'
  }
];

const TOE_SPACERS_TESTIMONIALS = [
  {
    name: 'Jordan P.',
    role: 'Runner • Post-training recovery',
    image: '',
    quote:
      'My feet feel “unlocked” after 20 minutes. The tight, cramped feeling after runs is way less noticeable now.',
    result: 'Less post-run tightness'
  },
  {
    name: 'Maya S.',
    role: 'Office & dress shoes',
    image: '',
    quote:
      'I wear heels for work and my toes used to feel smashed by the end of the day. These are a simple reset at night.',
    result: 'Comfortable nightly reset'
  },
  {
    name: 'Ethan R.',
    role: 'Yoga • Balance work',
    image: '',
    quote:
      'Didn’t expect the balance difference. Spacing my toes out makes grounding feel more stable in poses.',
    result: 'Improved stability & grounding'
  }
];

const TOE_SPACERS_FAQS = [
  {
    question: 'How long should I wear toe spacers each day?',
    answer:
      'Start with 10–15 minutes and work up to 20–30 minutes as your feet adapt. Consistency matters more than doing long sessions.'
  },
  {
    question: 'Can I walk or work out in them?',
    answer:
      'They’re best for lounging and low-impact movement (stretching, floor work, light mobility). Avoid intense training or tight shoes unless your podiatrist recommends it.'
  },
  {
    question: 'Will they help with cramped toes or forefoot tension?',
    answer:
      'That’s the goal: gentle separation can reduce the “compressed” sensation and help your toes relax after restrictive footwear. Results improve with steady use over several weeks.'
  },
  {
    question: 'How do I clean them?',
    answer:
      'Wash with mild soap and warm water, then air dry. Keep them away from high heat to preserve the silicone’s flexibility.'
  }
];

const TOE_CUSHION_PADS_TESTIMONIALS = [
  {
    name: 'Chloe M.',
    role: 'New shoes • break-in days',
    image: '',
    quote:
      'I used to get hot spots at the front of my sneakers within 20 minutes. These pads made the rubbing basically disappear.',
    result: 'Fewer blisters and less toe irritation'
  },
  {
    name: 'Ryan D.',
    role: 'Long walks • daily errands',
    image: '',
    quote:
      'They feel soft but not bulky. I forget they’re there — which is exactly what I wanted.',
    result: 'Comfort without the “tight shoe” feeling'
  },
  {
    name: 'Ava K.',
    role: 'Work shoes • all-day standing',
    image: '',
    quote:
      'My toes used to feel raw after long shifts. With these, I get cushioning where I need it and no constant adjusting.',
    result: 'All-day comfort for toe pressure points'
  }
];

const TOE_CUSHION_PADS_FAQS = [
  {
    question: 'Where do Toe Cushion Pads sit?',
    answer:
      'Place them where you feel rubbing or pressure at the front of the shoe—typically around the toe area. They’re designed to stay low-profile and comfortable while you move.'
  },
  {
    question: 'Will they fit in tight shoes?',
    answer:
      'They’re made to be slim and discreet, but fit can vary by shoe. If your footwear is very tight, we recommend using them with roomier pairs first for the best comfort.'
  },
  {
    question: 'Do they help prevent blisters and hot spots?',
    answer:
      'Yes—by creating a soft barrier that reduces friction and pressure, they help minimize rubbing that often leads to blisters and irritation.'
  },
  {
    question: 'Can I reuse them?',
    answer:
      'Yes. Rinse with mild soap and warm water, then air dry. With regular care, they’re built for repeat use.'
  }
];

const HEEL_CUSHIONS_TESTIMONIALS = [
  {
    name: 'Danielle R.',
    role: 'Retail • 8-hour shifts',
    image: '',
    quote:
      'Concrete floors used to wreck my heels by closing time. These pads are the first thing I put in my work shoes now — the ache at the back of my foot is way less noticeable.',
    result: 'Less heel fatigue after long shifts'
  },
  {
    name: 'Marcus T.',
    role: 'New leather boots • break-in',
    image: '',
    quote:
      'My boots were rubbing the back of my heels raw. I stuck these in and finally stopped dreading every step during the break-in period.',
    result: 'Fewer heel blisters while breaking in shoes'
  },
  {
    name: 'Priya N.',
    role: 'Slightly loose sneakers',
    image: '',
    quote:
      'Half a size too big and my heel was slipping. These filled the gap without feeling bulky — snugger fit, no sliding up and down.',
    result: 'More stable heel lock-in'
  }
];

const HEEL_CUSHIONS_FAQS = [
  {
    question: 'Where should I place Heel Cushions in my shoes?',
    answer:
      'Peel the backing and press the pad firmly onto the inside heel counter — the part of the shoe that cups the back of your heel. Center it so your heel lands on the cushioning. Let the adhesive set for a minute before wearing.'
  },
  {
    question: 'Will they slip or bunch up while I walk?',
    answer:
      'They’re designed with a self-adhesive backing and grip to stay put in most footwear. For best results, make sure the inside of the shoe is clean and dry before applying. If a pair starts to lift at the edges after heavy use, replace it for a fresh stick.'
  },
  {
    question: 'Can they help with heel rubbing, blisters, or sore heels?',
    answer:
      'Yes — the soft cushioning and friction-reducing design help absorb impact and cut down on rubbing at the heel, which many people notice on hard floors, long shifts, or when breaking in stiff shoes. They’re for comfort, not a substitute for medical care; see a professional for persistent pain.'
  },
  {
    question: 'Are they reusable? How do I remove them?',
    answer:
      'They’re intended as semi-durable wear: you can often move them once or twice while the adhesive is fresh, but repeated removal will weaken the stick. To take them out, peel slowly from one edge; any residue can usually be rolled off or cleaned with a gentle shoe-safe wipe. When adhesion fades, replace with a new pair.'
  }
];

const MASSAGE_GUN_TESTIMONIALS = [
  {
    name: 'Danielle K.',
    role: 'Nurse • 12-hour shifts',
    image: '',
    quote:
      'My arches and calves used to feel cemented after a shift. Five minutes with this on low speed under the arch and up the calf — I can actually relax instead of limping to the car.',
    result: 'Faster post-shift leg and foot relief'
  },
  {
    name: 'Marcus L.',
    role: 'Weekend runner • tight calves',
    image: '',
    quote:
      'I tried lacrosse balls and foam rollers; this is the first thing that hits the spot without wrecking my hands. Quiet enough that I don’t annoy my partner after a long run.',
    result: 'Targeted percussion without the noise'
  },
  {
    name: 'Elena R.',
    role: 'Plantar fasciitis • desk + walking commute',
    image: '',
    quote:
      'Mornings were the worst. I use the fork head along the arch and the ball on the heel — gentle at first, then a bit deeper. It’s part of my routine now.',
    result: 'More manageable morning foot tension'
  }
];

const MASSAGE_GUN_FAQS = [
  {
    question: 'How do I use the massage gun on my feet and calves?',
    answer:
      'Start on the lowest speed and keep the head flat against the muscle — never on bone or the front of the shin. For the foot, glide slowly along the arch and heel pad for 30–60 seconds per area. For calves, work the belly of the muscle in short passes, moving up toward the knee. If anything feels sharp or wrong, stop and ask a clinician — this is for comfort and recovery, not a substitute for medical treatment.'
  },
  {
    question: 'How long does the battery last and how do I charge it?',
    answer:
      'Runtime depends on speed and pressure, but most people get multiple sessions per charge for daily foot and calf use. Recharge with the included USB-C cable — no disposable batteries. Top up before travel or long weeks on your feet so it’s ready when you need it.'
  },
  {
    question: 'Is it safe to use every day? What about intensity?',
    answer:
      'Many customers use it daily for short sessions. Use the six speeds to stay in a comfortable range: lighter for sensitive areas like the arch, firmer only where soft tissue can handle it. Avoid injured, swollen, or numb areas, and don’t use it over varicose veins or if your doctor has advised against percussion massage.'
  },
  {
    question: 'What if I’m not happy with it?',
    answer:
      'You’re covered by AeroTouch’s 60-day money-back guarantee. Try it on your recovery routine — if it’s not right for you, reach out and we’ll help with a full refund.'
  }
];

export const SecondaryProductPage: React.FC<SecondaryProductPageProps> = ({
  product: initialProduct,
  onAddToCart,
  onBack,
  onProductSelect,
  isLoading = false,
  error = null,
  compareAtPrice,
  detailCardBody,
  belowTestimonials,
  faqs: faqsProp,
  testimonials: testimonialsProp,
  onNavigateToBlog,
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const meta = useProductMetafields(product);
  const isGripSocksProduct = useMemo(() => {
    const handle = (product.handle || '').toLowerCase();
    const id = String(product.id || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return handle === 'grip-socks' || id === 'grip-socks' || name.includes('grip socks');
  }, [product.handle, product.id, product.name]);
  const isToeCushionPadsProduct = useMemo(() => {
    const handle = (product.handle || '').toLowerCase();
    const id = String(product.id || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return handle === 'toe-cushion-pds' || id === 'toe-cushion-pds' || name.includes('toe cushion');
  }, [product.handle, product.id, product.name]);
  const isHeelCushionsProduct = useMemo(() => {
    const handle = (product.handle || '').toLowerCase();
    const id = String(product.id || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return (
      handle === 'heel-cushion-pds' ||
      handle === 'heel-cushion-pad' ||
      id === 'heel-cushion-pds' ||
      id === 'heel-cushion-pad' ||
      name.includes('heel cushion')
    );
  }, [product.handle, product.id, product.name]);
  const isToeSpacersProduct = useMemo(() => {
    const handle = (product.handle || '').toLowerCase();
    const id = String(product.id || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return handle === 'toe-spacers' || id === 'toe-spacers' || name.includes('toe spacers');
  }, [product.handle, product.id, product.name]);
  const isMassageGunProduct = useMemo(() => {
    const handle = (product.handle || '').toLowerCase();
    const id = String(product.id || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return handle === 'massage-gun' || id === 'massage-gun' || name.includes('massage gun');
  }, [product.handle, product.id, product.name]);

  const quantityUsesPairs = isToeSpacersProduct || isHeightBoosterProduct(product);

  const testimonialItems = useMemo(() => {
    if (testimonialsProp) return testimonialsProp;
    if (isToeCushionPadsProduct) return TOE_CUSHION_PADS_TESTIMONIALS;
    if (isHeelCushionsProduct) return HEEL_CUSHIONS_TESTIMONIALS;
    if (isToeSpacersProduct) return TOE_SPACERS_TESTIMONIALS;
    if (isMassageGunProduct) return MASSAGE_GUN_TESTIMONIALS;
    if (isHeightBoosterProduct(product)) return HEIGHT_BOOSTER_TESTIMONIALS;
    return DEFAULT_TESTIMONIALS;
  }, [
    testimonialsProp,
    isToeCushionPadsProduct,
    isHeelCushionsProduct,
    isToeSpacersProduct,
    isMassageGunProduct,
    product
  ]);

  const bundleQuantities = useMemo(() => {
    const raw = meta.bundle_options_override;
    if (Array.isArray(raw) && raw.length > 0) {
      const qs = raw
        .map((o) => o.quantity)
        .filter((n): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 1);
      const sorted = Array.from(new Set(qs)).sort((a, b) => a - b);
      if (sorted.length > 0) return sorted;
    }
    if (isToeSpacersProduct) return [1, 2, 3, 5];
    if (isHeelCushionsProduct) return [1, 2, 3, 5];
    if (isHeightBoosterProduct(product)) return [1, 2, 3, 5];
    // Default: 3 options for most secondary items.
    return [1, 2, 3];
  }, [meta.bundle_options_override, isToeSpacersProduct, isHeelCushionsProduct, product]);

  const peakBundleQty = bundleQuantities[bundleQuantities.length - 1] ?? 1;

  const faqItems = useMemo(() => {
    if (faqsProp) return faqsProp;
    if (meta.faq_override && meta.faq_override.length > 0) return meta.faq_override;
    if (isToeCushionPadsProduct) return TOE_CUSHION_PADS_FAQS;
    if (isHeelCushionsProduct) return HEEL_CUSHIONS_FAQS;
    if (isToeSpacersProduct) return TOE_SPACERS_FAQS;
    if (isMassageGunProduct) return MASSAGE_GUN_FAQS;
    if (isHeightBoosterProduct(product)) return HEIGHT_BOOSTER_FAQS;
    return DEFAULT_FAQS;
  }, [
    faqsProp,
    meta.faq_override,
    isToeCushionPadsProduct,
    isHeelCushionsProduct,
    isToeSpacersProduct,
    isMassageGunProduct,
    product
  ]);

  /** Long-form PDP description: rendered below the rotating testimonial card (not above quantity). */
  const productDetailBelowTestimonials = useMemo(() => {
    if (detailCardBody) return detailCardBody;
    if (isToeCushionPadsProduct) return <ToeCushionPadsDetailCardBody />;
    if (isHeelCushionsProduct) return <HeelCushionsDetailCardBody />;
    if (isToeSpacersProduct) return null;
    const descText = (meta.custom_description || product.tagline || product.description || '').trim();
    const hasPoints = Boolean(meta.custom_description_points && meta.custom_description_points.length > 0);
    const hasFeatures = Boolean(product.features && product.features.length > 0);
    if (!descText && !hasPoints && !hasFeatures) return null;
    return (
      <>
        {descText ? (
          <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
            {meta.custom_description || product.tagline || product.description}
          </p>
        ) : null}
        {hasPoints ? (
          <ul className="text-slate-600 leading-relaxed mb-6 space-y-2">
            {meta.custom_description_points!.map((point: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : hasFeatures ? (
          <ul className="text-slate-600 leading-relaxed mb-6 space-y-2">
            {product.features!.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold text-slate-900">{feature.split(':')[0]}:</span>{' '}
                  {feature.split(':').slice(1).join(':')}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }, [
    detailCardBody,
    isToeCushionPadsProduct,
    isHeelCushionsProduct,
    isToeSpacersProduct,
    meta.custom_description,
    meta.custom_description_points,
    product.tagline,
    product.description,
    product.features
  ]);

  const [shopifyProduct, setShopifyProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('One Size');
  const [selectedColor, setSelectedColor] = useState<string>('Black');
  const [bundle, setBundle] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { viewers } = useSocialProof(initialProduct.id, { viewersProfile: 'secondary' });
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 12, seconds: 45 });
  const [paymentMethodsOpen, setPaymentMethodsOpen] = useState(false);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Fetch product from Shopify
  useEffect(() => {
    const fetchShopifyData = async () => {
      // Use handle if available, otherwise fall back to id
      const identifier = initialProduct.handle || initialProduct.id;

      console.log('[SecondaryProductPage] Fetching Shopify data for identifier:', identifier);

      try {
        const fetchedProduct = await fetchProductByHandle(identifier);
        if (fetchedProduct) {
          console.log('[SecondaryProductPage] ✅ Shopify data fetched successfully');
          setShopifyProduct(fetchedProduct);
          const shopifyMapped = mapShopifyProduct(fetchedProduct);
          setProduct((prev: Product) => {
            const merged: Product = {
              ...prev,
              ...shopifyMapped,
              id: prev.id,
              handle: prev.handle
            };
            if (shopifyMapped.compareAtPrice != null && shopifyMapped.compareAtPrice > merged.price) {
              merged.compareAtPrice = shopifyMapped.compareAtPrice;
            } else {
              delete merged.compareAtPrice;
            }
            if (isHeightBoosterProduct(merged)) {
              merged.tagline = HEIGHT_BOOSTERS_PDP_COPY.tagline;
              merged.description = HEIGHT_BOOSTERS_PDP_COPY.description;
              merged.features = [...HEIGHT_BOOSTERS_PDP_COPY.features];
            }
            if ((merged.handle || '').toLowerCase() === 'toe-cushion-pds') {
              merged.tagline = TOE_CUSHION_PADS_OVERRIDE.tagline;
              merged.description = TOE_CUSHION_PADS_OVERRIDE.description;
              merged.features = [...TOE_CUSHION_PADS_OVERRIDE.features];
            }
            {
              const h = (merged.handle || '').toLowerCase();
              if (h === 'heel-cushion-pds' || h === 'heel-cushion-pad') {
                merged.tagline = HEEL_CUSHIONS_OVERRIDE.tagline;
                merged.description = HEEL_CUSHIONS_OVERRIDE.description;
                merged.features = [...HEEL_CUSHIONS_OVERRIDE.features];
              }
              if (h === 'massage-gun') {
                merged.tagline = MASSAGE_GUN_PDP_COPY.tagline;
                merged.description = MASSAGE_GUN_PDP_COPY.description;
                merged.features = [...MASSAGE_GUN_PDP_COPY.features];
                merged.metafields = {
                  ...(merged.metafields || {}),
                  custom_description: MASSAGE_GUN_PDP_COPY.customDescription
                };
              }
            }
            return merged;
          });

          const firstVariant = fetchedProduct.variants?.[0];
          if (firstVariant) {
            const sizeOption = firstVariant.selectedOptions?.find((o: any) => o.name === 'Size');
            const colorOption = firstVariant.selectedOptions?.find((o: any) => o.name === 'Color');
            if (sizeOption) setSelectedSize(sizeOption.value);
            if (colorOption) setSelectedColor(colorOption.value);
          }
        } else {
          console.log('[SecondaryProductPage] ⚠️ fetchProductByHandle returned null, using local data');
        }
      } catch (err) {
        console.warn('[SecondaryProductPage] Could not fetch product from Shopify, using local data:', err);
      }
    };
    fetchShopifyData();
  }, [initialProduct.id, initialProduct.handle]);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
          const filtered = shopifyProducts
            .filter((p: any) => p.id !== initialProduct.id)
            .slice(0, 3)
            .map(mapShopifyProduct);
          if (filtered.length > 0) {
            setRelatedProducts(filtered);
          }
        }
      } catch (err) {
        console.warn('Could not fetch related products', err);
      }
    };
    fetchRelated();
  }, [initialProduct.id]);

  // Timer logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Testimonial auto-scroll
  useEffect(() => {
    if (isTestimonialHovered) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTestimonialHovered, testimonialItems]);

  useEffect(() => {
    setActiveTestimonial(0);
  }, [initialProduct.id]);

  useEffect(() => {
    setBundle(1);
  }, [initialProduct.id]);

  useEffect(() => {
    const maxQ = bundleQuantities[bundleQuantities.length - 1] ?? 1;
    setBundle((b) => (b > maxQ ? maxQ : b));
  }, [bundleQuantities]);

  const sizeOption = shopifyProduct?.options?.find((o: any) => o.name === 'Size');
  const colorOption = shopifyProduct?.options?.find((o: any) => o.name === 'Color');

  const availableSizes = sizeOption?.values?.map((v: any) => v.value) || ['One Size'];
  const availableColors = colorOption?.values?.map((v: any) => ({
    name: v.value,
    value: v.value
  })) || [{ name: 'Black', value: '#1E293B', label: 'Black' }];

  const fallbackImage = product.image || '';
  const images = Array.from(
    new Set([...(product.images || []), fallbackImage].filter((img) => Boolean(img && img.trim())))
  );
  const secondaryImages = images.slice(1, 5);

  const resolvedVariant = useMemo(
    () => findVariantBySizeAndColor(shopifyProduct, selectedSize, selectedColor),
    [shopifyProduct, selectedSize, selectedColor]
  );

  const unitPrice = useMemo(() => {
    if (resolvedVariant) return variantSalePrice(resolvedVariant);
    return product.price;
  }, [resolvedVariant, product.price]);

  const compareAtEach = useMemo(() => {
    const fromVariant = resolvedVariant ? variantCompareAt(resolvedVariant) : null;
    let cap = fromVariant != null && fromVariant > unitPrice ? fromVariant : null;
    if (cap == null && compareAtPrice != null && compareAtPrice > unitPrice) {
      cap = compareAtPrice;
    }
    if (cap == null && product.compareAtPrice != null && product.compareAtPrice > unitPrice) {
      cap = product.compareAtPrice;
    }
    return cap;
  }, [resolvedVariant, unitPrice, compareAtPrice, product.compareAtPrice]);

  const savingsEach = compareAtEach != null ? compareAtEach - unitPrice : 0;
  const savingsPercent =
    compareAtEach != null && compareAtEach > 0
      ? Math.round((Math.max(0, savingsEach) / compareAtEach) * 100)
      : 0;
  const savingsLabelForQty = (qty: number) => {
    const saved = Math.max(0, savingsEach) * qty;
    const fmt = (v: number) => v.toFixed(2);
    if (saved <= 0) return `You save $${fmt(0)}`;
    return `You save $${fmt(saved)}`;
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollRef.current.scrollLeft / width);
      if (newIndex !== activeImgIndex) {
        setActiveImgIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = activeImgIndex * width;
      if (Math.abs(currentScroll - targetScroll) > 20) {
        scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
  }, [activeImgIndex]);

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize, selectedColor, bundle);
    }
  };

  const currentTestimonial =
    testimonialItems[Math.min(activeTestimonial, testimonialItems.length - 1)] ?? testimonialItems[0];

  return (
    <div
      className="min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-24 md:pb-0"
      style={{ paddingTop: 'var(--navbar-height, 72px)' }}
    >
      
      {/* Sticky Promo Bar */}
      <div
        className="bg-brand-dark text-white text-center py-2 text-xs font-bold uppercase tracking-widest sticky z-30"
        style={{ top: 'var(--navbar-height, 72px)' }}
      >
        <span className="animate-pulse text-brand-lime mr-2">●</span> High Demand: {viewers} Sold in the last hour
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-6 md:pt-10 lg:flex lg:gap-12 xl:gap-16 mb-24">
        
        {/* Left Col: Image Gallery - Sticky on Desktop */}
        <div className="lg:w-3/5">
             <div
               className="lg:sticky space-y-4 md:max-w-[550px] lg:max-w-none mx-auto"
               style={{ top: 'calc(var(--navbar-height, 72px) + 32px)' }}
             >
                {/* --- MOBILE: Carousel View --- */}
                <div className="md:hidden">
                    <div className="aspect-[10/9.92] md:aspect-square bg-slate-50 rounded-2xl overflow-hidden shadow-sm relative border border-slate-100">
                        <div 
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
                        >
                            {images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    className="w-full h-full object-cover object-center flex-shrink-0 snap-center" 
                                    alt={`${product.name} view ${idx + 1}`} 
                                />
                            ))}
                        </div>
                        {/* Dots */}
                        {images.length > 1 && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                              {images.map((_, idx) => (
                                  <button
                                      key={idx}
                                      onClick={() => setActiveImgIndex(idx)}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                          activeImgIndex === idx ? 'bg-brand-orange w-4' : 'bg-slate-300'
                                      }`}
                                      aria-label={`Go to image ${idx + 1}`}
                                  />
                              ))}
                          </div>
                        )}
                    </div>
                </div>

                {/* --- DESKTOP: Vertical Thumbnails View --- */}
                <div className="hidden md:flex gap-4">
                    {/* Thumbnails (Left) */}
                    <div className="flex flex-col gap-3 w-20 lg:w-[100px] flex-shrink-0 max-h-[600px] overflow-y-auto scrollbar-hide py-1">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImgIndex(idx)}
                                className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                                    activeImgIndex === idx 
                                    ? 'border-brand-dark shadow-md ring-2 ring-brand-dark/20 ring-offset-1' 
                                    : 'border-transparent hover:border-slate-300 opacity-60 hover:opacity-100'
                                } bg-white`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover object-center mix-blend-multiply"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image (Right) */}
                    <div className="flex-1 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 relative items-center justify-center aspect-[4/5] md:aspect-square object-cover shadow-sm">
                        <img 
                            src={images[activeImgIndex] || images[0]} 
                            alt={product.name} 
                            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
                        />
                    </div>
                </div>
             </div>
        </div>

        {/* Right Col: Product Details */}
        <div className="lg:w-2/5 mt-8 lg:mt-0">
             
             {/* Header Info */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-brand-orange">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span
                      className="text-sm text-slate-500 font-bold underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-brand-orange"
                      onClick={() => testimonialsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    >
                      {product.reviews} Verified Reviews
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">{product.name}</h1>
                
                {/* Price Display — Shopify variant price / compare-at */}
                <div className="flex items-end gap-3 mb-4 flex-wrap">
                   <div className="text-4xl font-black text-brand-orange">${unitPrice.toFixed(2)}</div>
                   {compareAtEach != null && (
                     <div className="text-xl font-bold text-slate-400 line-through decoration-2 mb-1">
                       ${compareAtEach.toFixed(2)}
                     </div>
                   )}
                   <div className="text-sm font-bold text-slate-500 mb-1">each</div>
                   {savingsPercent > 0 && bundle === 1 && (
                     <div className="mb-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                       Sale · Save {savingsPercent}%
                     </div>
                   )}
                </div>
                {bundle > 1 && (
                  <p className="text-sm font-bold text-slate-700 mb-4 -mt-2">
                    {bundle} {quantityUsesPairs ? 'pairs' : 'items'} —{' '}
                    <span className="text-slate-900">${(unitPrice * bundle).toFixed(2)} at checkout</span>
                  </p>
                )}

                {/* Scarcity / Views */}
                <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                   <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-brand-dark" />
                       <span><span className="font-bold text-brand-dark">{viewers} people</span> viewing this</span>
                   </div>
                   <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                       <Flame className="w-4 h-4 fill-current flex-shrink-0" />
                       <span>Selling Fast</span>
                   </div>
                </div>

                {isGripSocksProduct && (
                  <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Ideal For</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 leading-relaxed">
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-dark shrink-0" aria-hidden />
                        <span>Football, basketball, tennis, and training sports</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-dark shrink-0" aria-hidden />
                        <span>Running, hiking, and active recovery</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-dark shrink-0" aria-hidden />
                        <span>Yoga, Pilates, and studio workouts</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-dark shrink-0" aria-hidden />
                        <span>Everyday wear for anyone wanting extra comfort and stability</span>
                      </li>
                    </ul>
                  </div>
                )}

                {isToeSpacersProduct && (
                  <div className="mb-6">
                    <ul className="space-y-2.5">
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Corrective Realignment:</span> They act as a physical
                        &quot;reset&quot; for your feet, gently guiding toes back to their natural, wide-splayed position
                        to counteract the structural damage and narrowing caused by modern footwear.
                      </BenefitBullet>
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Active Tension Relief:</span> By stretching the plantar
                        fascia and toe flexors, they help alleviate the chronic &quot;cramped&quot; sensation often felt
                        after long periods of standing, walking, or wearing restrictive sports boots and dress shoes.
                      </BenefitBullet>
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Effortless Integration:</span> Designed to fit into your
                        existing downtime, they require no extra effort—simply wear them for 20–30 minutes while relaxing,
                        reading, or winding down in the evening to promote long-term foot health.
                      </BenefitBullet>
                    </ul>
                  </div>
                )}

                {isHeelCushionsProduct && (
                  <div className="mb-6 text-slate-600">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">Great uses</h3>
                    <ul className="space-y-2.5">
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Long days on hard floors</span> — extra cushioning at
                        the heel for standing, walking, and busy shifts where every step adds up.
                      </BenefitBullet>
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Breaking in stiff shoes</span> — softens heel rub so
                        new boots, dress shoes, or rigid sneakers are easier on your skin.
                      </BenefitBullet>
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">A slightly loose fit</span> — fills a bit of heel
                        space for a snugger feel and less slipping up and down.
                      </BenefitBullet>
                    </ul>
                  </div>
                )}

                {isMassageGunProduct && (
                  <div className="mb-6 text-slate-600">
                    <ul className="space-y-2.5">
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">After long shifts &amp; standing</span> — loosen
                        tight arches, soles, and calves when you finally get off your feet.
                      </BenefitBullet>
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Warm-up &amp; cool-down</span> — quick percussion
                        before activity or after a run or workout to calm hot spots in your lower legs.
                      </BenefitBullet>
                      <BenefitBullet>
                        <span className="font-bold text-slate-900">Plantar fasciitis &amp; stubborn tension</span> —{' '}
                        targeted relief at home, at work, or before bed without a trip to the spa.
                      </BenefitBullet>
                    </ul>
                  </div>
                )}

                {isHeightBoosterProduct(product) && (
                  <div className="mb-6 text-slate-600">
                    <ul className="space-y-2.5">
                      {HEIGHT_BOOSTER_QUICK_USES.map((u) => (
                        <BenefitBullet key={u.title}>
                          <span className="font-bold text-slate-900">{u.title}</span> — {u.body}
                        </BenefitBullet>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bundle Selector - Dropshipping Style */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Quantity</p>
                    {bundleQuantities.map((qty) => {
                      const highlight = (() => {
                        const raw = meta.bundle_options_override;
                        if (Array.isArray(raw) && raw.length > 0) {
                          const h = raw.find((o) => o.quantity === qty)?.highlight;
                          if (h === 'popular') return 'popular';
                          if (h === 'best-value') return 'best-value';
                        }
                        if (qty === 2) return 'popular';
                        if (qty === peakBundleQty && peakBundleQty >= 3) return 'best-value';
                        return null;
                      })();
                      return (
                      <div 
                          key={qty}
                          onClick={() => setBundle(qty)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${bundle === qty ? 'border-brand-orange bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                          {highlight === 'popular' && (
                             <div className="absolute top-0 right-0 -translate-y-1/2 z-10" style={{ transform: 'translateY(-50%) rotate(-3deg)' }}>
                                <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 shadow-lg">
                                    <span className="text-base leading-none" aria-hidden>🔥</span>
                                    <span className="text-[11px] font-bold text-white">Most Popular</span>
                                </div>
                             </div>
                          )}
                          {highlight === 'best-value' && (
                             <div className="absolute top-0 right-0 -translate-y-1/2 z-10" style={{ transform: 'translateY(-50%) rotate(3deg)' }}>
                                <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 shadow-lg">
                                    <BadgeCheck className="h-4 w-4 shrink-0 text-brand-lime" />
                                    <span className="text-[11px] font-bold text-white">Best Value</span>
                                </div>
                             </div>
                          )}
                          <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-4">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bundle === qty ? 'border-brand-orange' : 'border-slate-300'}`}>
                                      {bundle === qty && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                                  </div>
                                  <div className="flex flex-col">
                                      <div className="flex items-center">
                                          <span className="text-xl font-black text-slate-900 leading-none">
                                            {qty}{' '}
                                            {quantityUsesPairs
                                              ? (qty === 1 ? 'Pair' : 'Pairs')
                                              : (qty === 1 ? 'Item' : 'Items')}
                                          </span>
                                      </div>
                                      <p className="text-sm font-bold text-slate-600 mt-1.5">
                                        {savingsLabelForQty(qty)}
                                      </p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className="font-bold text-brand-orange block text-xl">
                                    ${(unitPrice * qty).toFixed(2)}
                                  </span>
                                  <span className="text-xs text-slate-500 font-bold">
                                    ${unitPrice.toFixed(2)} /{quantityUsesPairs ? 'pair' : 'item'}
                                  </span>
                                  {qty === 1 && compareAtEach != null && compareAtEach > unitPrice && (
                                    <span className="text-xs text-slate-400 line-through font-bold block">
                                      ${compareAtEach.toFixed(2)} MSRP
                                    </span>
                                  )}
                              </div>
                          </div>
                      </div>
                    );
                    })}
                </div>

                {/* Color Selector */}
                {availableColors.length > 1 && (
                  <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Color: <span className="text-brand-orange">{selectedColor}</span></span>
                      </div>
                      <div className="flex gap-3">
                          {availableColors.map((color: any) => (
                              <button
                                  key={color.name}
                                  onClick={() => setSelectedColor(color.name)}
                                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                      selectedColor === color.name 
                                      ? 'border-brand-orange shadow-lg scale-110' 
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                  title={color.name}
                              >
                                  <div 
                                      className="w-8 h-8 rounded-full shadow-inner" 
                                      style={{ backgroundColor: color.value || (color.name === 'White' ? '#fff' : color.name === 'Black' ? '#000' : '#ccc') }}
                                  />
                              </button>
                          ))}
                      </div>
                  </div>
                )}

                {/* Size Selector */}
                {availableSizes.length > 1 && (
                  <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Size</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          {availableSizes.map((size: any) => (
                              <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`h-11 rounded-lg border-2 font-black text-xs sm:text-sm uppercase tracking-tight transition-all ${
                                  selectedSize === size 
                                  ? 'border-black bg-brand-orange text-white shadow-md' 
                                  : 'border-black text-black hover:border-brand-orange bg-white shadow-sm'
                                  }`}
                              >
                                  {size}
                              </button>
                          ))}
                      </div>
                  </div>
                )}

                {/* Offer Ends Soon Section */}
                <div className="mb-6 bg-brand-orange/5 border-2 border-dashed border-brand-orange/30 rounded-2xl p-4 overflow-hidden relative group hover:border-brand-orange/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-brand-orange text-white p-1.5 rounded-lg animate-pulse">
                                <Timer className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-brand-dark uppercase tracking-tighter leading-none text-lg">{meta.timer_title}</h3>
                                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mt-0.5">{meta.timer_subtitle}</p>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            {[
                                { val: timeLeft.hours, label: 'H' },
                                { val: timeLeft.minutes, label: 'M' },
                                { val: timeLeft.seconds, label: 'S' }
                            ].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="bg-brand-dark text-white font-mono font-black w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-brand-dark/20">
                                        {unit.val.toString().padStart(2, '0')}
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 mt-1">{unit.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Main Action - Add to Cart */}
                <Button
                    fullWidth
                    size="lg"
                    className={`h-16 text-xl shadow-xl relative overflow-hidden group bg-black text-white hover:bg-[#C1F11D] hover:text-white transition-all duration-300 ${isLoading ? 'opacity-90 cursor-wait' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isLoading || typeof selectedSize === 'undefined'}
                >
                   <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-tight uppercase">
                       {isLoading && <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                       {isLoading ? 'PROCESSING...' : (selectedSize ? (meta.primary_cta_text || `ADD TO CART - $${(unitPrice * bundle).toFixed(2)}`) : (meta.secondary_cta_text || 'SELECT SIZE'))}
                   </span>
                   {/* Shine effect */}
                   {!isLoading && <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine mix-blend-overlay" />}
                </Button>

                {/* Payment methods under buy button - link opens popup */}
                <div className="mt-4 flex flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPaymentMethodsOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-dark underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 rounded"
                    >
                        <Lock className="w-4 h-4 shrink-0" aria-hidden />
                        <span>Pay securely with these payment methods</span>
                    </button>
                    <p
                        className="w-fit text-center border border-brand-orange bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 text-sm sm:text-base font-black uppercase tracking-wide text-brand-orange"
                        role="status"
                    >
                        Not sold on Amazon/eBay
                    </p>
                </div>

                {/* Payment methods popup */}
                {paymentMethodsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setPaymentMethodsOpen(false)} aria-hidden />
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 id="payment-methods-title" className="text-lg font-bold text-slate-900">Payment methods</h2>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethodsOpen(false)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                                {['visa.svg', 'mastercard.svg', 'amex.svg', 'applepay.svg', 'googlepay.svg', 'shoppay.svg', 'paypal.svg'].map(logo => (
                                  <div key={logo} className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                      <img src={`/payment-logos/${logo}`} alt={logo.split('.')[0]} className="h-5 w-auto object-contain" />
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Trust Badges Grid */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-3 gap-2 mb-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 flex items-center justify-center mb-2">
                                <Truck className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">Tracked Insured Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 flex items-center justify-center mb-2">
                                <Smile className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">Try Risk-Free for 60 Days</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 flex items-center justify-center mb-2">
                                <Headphones className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">24/7 Customer Support</span>
                        </div>
                    </div>

                    <div className="space-y-0 border-t border-slate-100">
                        {faqItems.map((item, idx) => (
                            <div key={idx} className="border-b border-slate-100">
                                <button 
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                    onClick={() => setOpenFaq(openFaq === idx.toString() ? null : idx.toString())}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-sm md:text-base uppercase tracking-tight group-hover:text-brand-orange transition-colors">{item.question}</span>
                                    </div>
                                    {openFaq === idx.toString() ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {openFaq === idx.toString() && (
                                    <div className="pb-4 text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Testimonial Card */}
                    <div
                        ref={testimonialsRef}
                        className="mt-8 rounded-2xl p-5 border border-slate-200 relative bg-gradient-to-br from-slate-50 to-white overflow-hidden"
                        onMouseEnter={() => setIsTestimonialHovered(true)}
                        onMouseLeave={() => setIsTestimonialHovered(false)}
                    >
                        <div className="flex gap-4 items-start relative z-10">
                            <img
                                src={currentTestimonial.image}
                                alt={currentTestimonial.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 leading-none">{currentTestimonial.name}</p>
                                        <p className="text-[11px] text-slate-500 mt-1">{currentTestimonial.role}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Verified</span>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-slate-800 leading-snug mb-3">
                                    "{currentTestimonial.quote}"
                                </p>

                                <div className="mt-3 flex flex-col gap-2">
                                    <div className="flex text-brand-orange gap-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">
                                            {currentTestimonial.result}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-1.5 mt-5 relative z-10">
                            {testimonialItems.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Show review ${i + 1}`}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`transition-all rounded-full ${i === activeTestimonial ? 'w-5 h-1.5 bg-brand-dark' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {productDetailBelowTestimonials != null && (
                      <div className="mt-8 border-t border-slate-200 pt-8">
                        {productDetailBelowTestimonials}
                      </div>
                    )}

                    {isGripSocksProduct && (
                      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                          Stay Grounded. Move With Confidence.
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          Whether you’re training hard, flowing through yoga, or pushing through your daily routine,
                          slipping socks can throw off your balance and focus. Our Grip Socks are designed to stay
                          secure through every movement, helping you feel stable, supported, and comfortable from start
                          to finish.
                        </p>

                        <h4 className="mt-6 text-sm font-black text-slate-900 uppercase tracking-tight">
                          Designed for Comfort. Engineered for Performance.
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600 leading-relaxed">
                          <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" aria-hidden />
                            <span>
                              Dual-grip traction technology helps reduce slipping inside your shoes while keeping your
                              footing secure on smooth surfaces
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" aria-hidden />
                            <span>
                              Soft breathable fabric blend delivers lightweight comfort and helps keep your feet cool
                              and dry during intense sessions
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" aria-hidden />
                            <span>
                              Supportive compression fit hugs the arch and midfoot for a locked-in feel without
                              restricting movement
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" aria-hidden />
                            <span>
                              Smooth seamless toe design minimizes rubbing and irritation for all-day comfort
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" aria-hidden />
                            <span>
                              Flexible stretch construction adapts naturally to different foot shapes and sizes
                            </span>
                          </li>
                        </ul>

                        <h4 className="mt-6 text-sm font-black text-slate-900 uppercase tracking-tight">
                          Made to Move Anywhere
                        </h4>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          From gym workouts to outdoor activities, these grip socks are built to handle movement in
                          every direction. The anti-slip grip supports quick cuts, jumps, balance work, and long
                          sessions without constant adjusting.
                        </p>

                        <h4 className="mt-6 text-sm font-black text-slate-900 uppercase tracking-tight">Ideal For</h4>
                        {/* moved above quantity selector */}

                        <h4 className="mt-6 text-sm font-black text-slate-900 uppercase tracking-tight">
                          Once You Try Them, Regular Socks Won’t Feel the Same.
                        </h4>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          Experience a more secure fit, better comfort, and confidence in every step.
                        </p>
                      </div>
                    )}

                    {isHeightBoosterProduct(product) && (
                      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {HEIGHT_BOOSTERS_STORY_BELOW_TESTIMONIALS}
                        </p>
                      </div>
                    )}

                    {/* Toe Spacers: no long-form description block */}

                    {isToeSpacersProduct && <ToeSpacersBelowTestimonials />}

                    {belowTestimonials}

                </div>
             </div>
        </div>
      </div>

      {/* Running banner - trust strip */}
      <section className="py-4 overflow-hidden border-y border-[#a5c918]" style={{ backgroundColor: '#C1F11D' }}>
        <div className="flex animate-marquee whitespace-nowrap w-max" style={{ willChange: 'transform' }}>
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="flex items-center gap-8 md:gap-12 px-8 md:px-12">
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>🛡️</span>
                60-day money-back guarantee
              </span>
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>🌍</span>
                Global shipping
              </span>
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>✈️</span>
                Tracked insured shipping
              </span>
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>😊</span>
                10,000+ Happy Customer
              </span>
            </div>
          ))}
        </div>
      </section>

      <ProductDescription product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && onProductSelect && (
        <div className="container mx-auto px-4 md:px-6 mb-24 max-w-7xl pt-16">
          <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight text-center md:text-left">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onClick={onProductSelect}
                compactOnMobile
              />
            ))}
          </div>
        </div>
      )}

      <ReferralSection />
      {onNavigateToBlog ? <GivingBackSection onLearnMore={onNavigateToBlog} /> : null}
    </div>
  );
};
