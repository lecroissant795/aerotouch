/**
 * PDP copy for Height Boosters (secondary template).
 * Single source of truth — used by productMapping fallbacks and SecondaryProductPage after Shopify merge.
 */

/** Renders below the rotating testimonial card on SecondaryProductPage. */
export const HEIGHT_BOOSTERS_STORY_BELOW_TESTIMONIALS = `There's something that shifts when you gain a little height — your posture opens up, your stride feels longer, and you carry yourself with a bit more presence. AeroTouch Height Boosters give you that lift discreetly, comfortably, and almost invisibly inside your shoes.

More Than Just Height

A slightly elevated heel position can encourage better alignment through your ankles, knees, and lower back — especially after long days on your feet. Many customers tell us they don't just feel taller; they stand straighter and feel less fatigued by the end of the day.

Perfect for job interviews, dates, and any occasion where confidence matters — plus everyday wear when you want a subtle boost with real comfort, not a gimmicky insert.

Discreet. Comfortable. Confidence-boosting. Order today and feel the difference from your first step.`;

export const HEIGHT_BOOSTERS_PDP_COPY = {
  tagline: 'Stand Taller. Feel More Confident. Instantly.',
  /** Long story lives below testimonials (`HEIGHT_BOOSTERS_STORY_BELOW_TESTIMONIALS`). */
  description: '',
  features: [
    'Add 2–6cm of lift: Invisibly inside your footwear — no obvious platform shoes or bulky lifts peeking out.',
    'Engineered cushioning: Contoured support zones that follow your arch so you stay comfortable, not just taller.',
    'All-day comfort: Cushioning and structure that keep working from your morning commute to a night out.',
    'Breathable, skin-friendly materials: Designed for long wear without irritation.',
    'Removable & adjustable: Stack or remove layers to fine-tune your lift (where your variant allows).',
    'Fits most shoes: Trainers, dress shoes, boots, loafers — slip in and go.'
  ]
} as const;

/** Three bullets above quantity on SecondaryProductPage. */
export const HEIGHT_BOOSTER_QUICK_USES: readonly { title: string; body: string }[] = [
  {
    title: 'Work & first impressions',
    body: 'Add a subtle lift for interviews, client meetings, and presentations — stand straighter and feel less “looked past” in the room.'
  },
  {
    title: 'Nights out & photos',
    body: 'Natural-looking height inside your own shoes for dates, weddings, and group shots — no obvious platform or bulky external lift.'
  },
  {
    title: 'Daily comfort, not a gimmick',
    body: 'Cushioned support zones and breathable materials so you can wear them from your commute through a full day on your feet.'
  }
];

/** Rotating testimonial cards on SecondaryProductPage (unless overridden by props). */
export const HEIGHT_BOOSTER_TESTIMONIALS = [
  {
    name: 'James L.',
    role: 'Sales & client meetings',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    quote:
      'I used to fixate on being the shorter guy in the room — handshakes, stage photos, all of it. AeroTouch Height Boosters sit invisibly in my Oxfords; I finally stop scanning who is taller and focus on the pitch.',
    result: 'Stopped sizing myself up before every meeting'
  },
  {
    name: 'Priya S.',
    role: 'Wedding & event season',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    quote:
      'Group photos wrecked me — I’d shrink or stand on tiptoe and still feel awkward next to cousins in heels. These give me a natural bump inside my shoes so I’m not clock-watching the photographer anymore.',
    result: 'Photos without that “why am I shortest?” spiral'
  },
  {
    name: 'David O.',
    role: 'Teacher, on feet all day',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    quote:
      'Kids don’t care, but I felt looked past next to taller coworkers in the hallway. One slim layer in my sneakers — not theatrical tall — just enough that I stand eye-level more often. Nobody’s guessed what changed.',
    result: 'Less invisible in the crowd'
  }
];

/** FAQ accordion for Height Boosters on SecondaryProductPage (unless overridden by props / metafields). */
export const HEIGHT_BOOSTER_FAQS: { question: string; answer: string }[] = [
  {
    question: 'What are AeroTouch Height Boosters and what do they do?',
    answer:
      'They are discreet in-shoe lifts that add between roughly 2cm and 6cm of height (depending on how you stack or adjust layers), while cushioning your arch and heel like our other AeroTouch inserts. Most people notice a straighter posture and a bit more confidence — without bulky external lifts.'
  },
  {
    question: 'How do I use them for the best fit?',
    answer:
      'Slide them under your existing insole or sock liner if there is room, or replace a thin factory liner. Start with fewer layers or a lower setting if your shoe is shallow, then add lift until it feels natural. They are designed for all-day wear; break them in over a few hours if you are new to height inserts.'
  },
  {
    question: 'How do sizing and fit work in my shoes?',
    answer:
      'Choose the size option that matches your usual footwear size on this page (the same chart we use for our other insoles). Trim-to-fit guidance is included where applicable. They work best in shoes with a removable insole and a little vertical space — trainers, boots, dress shoes, and most loafers. If your shoe runs very tight, try one layer first.'
  },
  {
    question: 'How much lift can I add? Are they adjustable?',
    answer:
      'Yes. Many variants use removable layers so you can stack or remove height to hit your sweet spot within the product range. Exact range depends on the variant you select at checkout — product imagery and details reflect your specific option.'
  },
  {
    question: 'How fast do you ship and where?',
    answer:
      'We ship tracked to most regions we serve; delivery time depends on your location and carrier at checkout. You will receive tracking by email as soon as your order ships. For the latest cut-offs and regions, see checkout or our Support page.'
  },
  {
    question: 'What is your return policy and guarantee?',
    answer:
      'We want you to love your AeroTouch gear. If Height Boosters are not right for you, use our 60-day risk-free window: reach out through Support with your order details and we will help with a return or exchange per policy. That gives you time to try them in real shoes, not just the box.'
  },
  {
    question: 'Are they discreet and comfortable for daily wear?',
    answer:
      'Yes — that is the point. The insert sits inside the shoe, not on the outside of your footwear. Materials are chosen for breathability and skin comfort on long days. If anything rubs or feels too tall, reduce layers or try them in a slightly roomier shoe.'
  }
];
