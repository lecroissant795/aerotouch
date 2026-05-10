import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Wind, Thermometer, Heart, Leaf, Award, Clock, Users, Star, Truck, X } from 'lucide-react';
import { Product } from '../types';
import { isMassageRollerProduct, isHeightBoosterProduct } from '../utils/productDetection';

function enlargedPhotoUrl(url: string): string {
  if (!url) return url;
  if (/[?&]w=\d+/i.test(url)) {
    return url.replace(/([?&])w=\d+/i, '$1w=1600');
  }
  return url;
}

type CustomerReview = {
  name: string;
  location: string;
  rating: number;
  title: string;
  text: string;
  image: string;
  photos: string[];
};

const DEFAULT_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    name: 'Sarah M.',
    location: 'Austin, TX',
    rating: 5,
    title: 'Finally pain-free after years!',
    text: "I've struggled with plantar fasciitis for 3 years. After just 2 weeks of wearing these insoles, the pain is completely gone. I can finally run again!",
    image: '',
    photos: [
      '',
      ''
    ]
  },
  {
    name: 'Michael T.',
    location: 'Seattle, WA',
    rating: 5,
    title: 'Worth every penny',
    text: "As a nurse working 12-hour shifts, my feet used to kill me. These insoles have been game-changing. No more pain after long days on my feet.",
    image: '',
    photos: ['']
  },
  {
    name: 'Jennifer K.',
    location: 'Denver, CO',
    rating: 5,
    title: 'Best investment for running',
    text: "Training for my first marathon and these insoles have made all the difference. My recovery time has improved dramatically.",
    image: '',
    photos: [
      '',
      ''
    ]
  },
  {
    name: 'David R.',
    location: 'Miami, FL',
    rating: 4,
    title: 'Great for work boots',
    text: "I work in construction and these insoles fit perfectly in my work boots. Much better than the generic ones I was using before.",
    image: '',
    photos: []
  },
  {
    name: 'Amanda L.',
    location: 'Portland, OR',
    rating: 5,
    title: 'Gift that keeps on giving',
    text: "Bought these for my husband who has flat feet. He absolutely loves them! Ordered more for his work shoes and running shoes.",
    image: '',
    photos: ['']
  },
  {
    name: 'Carlos M.',
    location: 'Chicago, IL',
    rating: 5,
    title: 'Amazing support',
    text: "The arch support is perfect for my high arches. I've tried many insoles and this is hands down the best one I've found.",
    image: '',
    photos: [
      '',
      ''
    ]
  }
];

/** Grid reviews for the Foot Massage Roller PDP only */
const MASSAGE_ROLLER_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    name: 'Danielle K.',
    location: 'Phoenix, AZ',
    rating: 5,
    title: 'Finally unwinds my arches after shifts',
    text: "I'm on my feet in the ER all night. Two minutes on the AeroTouch roller before bed hits spots stretching never does. My arches feel noticeably looser by morning.",
    image: '',
    photos: [
      '',
      ''
    ]
  },
  {
    name: 'Marcus T.',
    location: 'Boulder, CO',
    rating: 5,
    title: 'Post-long-run ritual',
    text: "After 15+ mile weeks my plantar fascia and calves get angry. I roll slowly under the arch and up the calf—way more targeted than a lacrosse ball. Lives in my gym bag.",
    image: '',
    photos: [
      '',
      ''
    ]
  },
  {
    name: 'Elena R.',
    location: 'Dallas, TX',
    rating: 5,
    title: 'Retail floors destroyed my heels',
    text: "Concrete all day left my heels burning. I keep this roller by the couch and use it while I watch TV. It's small but the texture really digs into the right spots.",
    image: '',
    photos: ['']
  },
  {
    name: 'James W.',
    location: 'Atlanta, GA',
    rating: 4,
    title: 'Great for desk breaks too',
    text: "I roll my forearms and feet during WFH breaks. Keeps tension from creeping up. Build feels solid—no squeaks after a month of daily use.",
    image: '',
    photos: [
      ''
    ]
  },
  {
    name: 'Priya N.',
    location: 'San Jose, CA',
    rating: 5,
    title: 'Plantar fasciitis maintenance',
    text: "My PT suggested rolling daily. This one matches the contour of my arch better than the cheap wood roller I had. Less slipping, more consistent pressure.",
    image: '',
    photos: [
      '',
      ''
    ]
  },
  {
    name: 'Tomás V.',
    location: 'San Diego, CA',
    rating: 5,
    title: 'Travel-friendly recovery',
    text: "I fly for work and toss it in my carry-on. Hotel floors, airport lounges—anywhere I can sit for two minutes I can get relief. Game changer after long walking days.",
    image: '',
    photos: ['']
  }
];

/** Grid reviews for Height Boosters PDP — insecurity → AeroTouch relief (not generic insoles). */
const HEIGHT_BOOSTERS_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    name: 'James L.',
    location: 'Boston, MA',
    rating: 5,
    title: 'I stopped dreading the conference-room lineup',
    text: 'Being shorter than most of my clients genuinely messed with my head — I’d overcompensate with voice or jokes. Height Boosters in my Oxfords gave me a few cm without clown shoes; first week I noticed I wasn’t bracing for every handshake.',
    image: '',
    photos: [
      ''
    ]
  },
  {
    name: 'Priya S.',
    location: 'Chicago, IL',
    rating: 5,
    title: 'Family weddings used to ruin my mood',
    text: 'I’m the shortest cousin — every reunion photo felt like proof. I refused ridiculous platforms. AeroTouch sits inside my actual heels so I’m not on display as “the tiny one” anymore; I can laugh at dinner instead of hovering at the edge.',
    image: '',
    photos: [
      ''
    ]
  },
  {
    name: 'David O.',
    location: 'Charlotte, NC',
    rating: 5,
    title: 'I felt easy to overlook next to taller staff',
    text: 'Hall duty with colleagues who tower over you sounds dumb as a problem until you live it. One thin layer in my sneakers — not magic tall — just enough eye contact with kids and adults that I don’t feel like I’m speaking up from below.',
    image: '',
    photos: []
  },
  {
    name: 'Rachel T.',
    location: 'Denver, CO',
    rating: 5,
    title: 'Dating apps meet reality — I used to panic about it',
    text: 'I spiraled before every first coffee: what if they expected taller? Height Boosters in boots level the walk-in moment so I’m not apologizing with my posture. Still me — just not negotiating my height in my head the whole date.',
    image: '',
    photos: [
      ''
    ]
  },
  {
    name: 'André M.',
    location: 'Montreal, QC',
    rating: 4,
    title: 'Cheaper lifts embarrassed me — these don’t',
    text: 'I tried plastic stacks years ago and felt like everyone could tell. I almost gave up. These took a day to get used to but the cushioning is real; I’m not obsessing in every reflective window anymore.',
    image: '',
    photos: []
  },
  {
    name: 'Mei K.',
    location: 'San Jose, CA',
    rating: 5,
    title: 'Standing meetings made me feel boxed out',
    text: 'Open floor + taller managers = I felt like I was craning or disappearing in the huddle. Slim Height Boosters for days on my feet — I’m not chasing inches for ego; I’m tired of feeling like the shortest voice in the circle.',
    image: '',
    photos: [
      ''
    ]
  }
];

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration, start]);

  return { count, ref };
};

const StatCard = ({ icon: Icon, value, suffix, label, delay }: { icon: any; value: number; suffix?: string; label: string; delay: number }) => {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div
      ref={ref}
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-center shadow-2xl overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/10 transition-colors duration-500" />
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-lime/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
          <Icon className="w-6 h-6 text-brand-lime" strokeWidth={1.5} />
        </div>
        <div className="text-4xl font-black text-white leading-none mb-1">
          {count.toLocaleString()}{suffix}
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-brand-orange/30 overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-orange/5 to-transparent rounded-bl-full" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-300">
        <Icon className="w-7 h-7 text-brand-orange group-hover:text-white transition-colors" strokeWidth={1.5} />
      </div>
      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

interface ProductDescriptionProps {
  /** When set, review grid copy matches the PDP product (Massage Roller / Height Boosters). */
  product?: Product;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const customerReviews =
    product && isMassageRollerProduct(product)
      ? MASSAGE_ROLLER_CUSTOMER_REVIEWS
      : product && isHeightBoosterProduct(product)
        ? HEIGHT_BOOSTERS_CUSTOMER_REVIEWS
        : DEFAULT_CUSTOMER_REVIEWS;

  useEffect(() => {
    if (!lightboxUrl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxUrl(null);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxUrl]);

  const features = [
    {
      icon: Zap,
      title: 'Instant Relief',
      description: 'Magnetic therapy targets pressure points to reduce foot pain within minutes of wear.'
    },
    {
      icon: Wind,
      title: 'Breathable Design',
      description: 'Advanced airflow technology keeps feet cool and dry, even in closed shoes.'
    },
    {
      icon: Thermometer,
      title: 'Temperature Regulating',
      description: 'Adapts to your body temperature for consistent comfort in any climate.'
    },
    {
      icon: Heart,
      title: 'Heart-Healthy',
      description: 'Improved circulation from acupressure points supports overall foot health.'
    },
    {
      icon: Leaf,
      title: 'Eco Materials',
      description: 'Made with sustainable, non-toxic materials that are safe for you and the planet.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Engineered with aerospace-grade components for unmatched durability.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
            Why Choose AeroTouch
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">
            Engineered for <span className="text-brand-orange">Performance</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Every pair is designed with precision technology to deliver maximum comfort and support.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} value={50000} suffix="+" label="Happy Customers" delay={0} />
          <StatCard icon={Star} value={4000} suffix="+" label="5-Star Reviews" delay={100} />
          <StatCard icon={Clock} value={98} suffix="%" label="Pain Relief Rate" delay={200} />
          <StatCard icon={Award} value={60} suffix="-Day" label="Guarantee" delay={300} />
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="mt-16 md:mt-20 py-8 bg-brand-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { icon: ShieldCheck, label: '60-Day Guarantee' },
              { icon: Truck, label: 'Free Shipping' },
              { icon: Heart, label: 'Doctor Recommended' },
              { icon: Leaf, label: 'Eco-Friendly' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white">
                <item.icon className="w-6 h-6 text-brand-lime" strokeWidth={1.5} />
                <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews with Photos */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
              <Star className="w-3 h-3 fill-current" />
              Real Results
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
              What Our <span className="text-brand-orange">Customers Say</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {product && isMassageRollerProduct(product)
                ? 'Real stories from people who use the AeroTouch Foot Massage Roller for tired feet, training, and long days on the move.'
                : product && isHeightBoosterProduct(product)
                  ? 'Real people on feeling shorter in rooms, photos, and dating — and how discreet AeroTouch Height Boosters helped them show up without the mental spiral.'
                  : 'See what real customers are saying about their experience with AeroTouch.'}
            </p>
          </div>

          {/* Reviews with Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerReviews.map((review, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-black text-slate-900">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-brand-orange fill-current' : 'text-slate-300'}`}
                    />
                  ))}
                </div>

                {/* Title */}
                <h5 className="font-bold text-slate-900 mb-2">{review.title}</h5>

                {/* Text */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{review.text}</p>

                {/* Customer Photos */}
                {review.photos.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {review.photos.map((photo, photoIdx) => (
                      <button
                        key={photoIdx}
                        type="button"
                        className="relative w-28 h-28 rounded-xl overflow-hidden cursor-zoom-in group border-0 p-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                        onClick={() => setLightboxUrl(photo)}
                        aria-label={`Enlarge photo ${photoIdx + 1} from ${review.name}`}
                      >
                        <img
                          src={photo}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Verified Badge */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Verified Purchase</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-black text-brand-orange mb-1">4.9</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-orange fill-current" />
                ))}
              </div>
              <div className="text-sm font-bold text-slate-600">Average Rating</div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-black text-brand-orange mb-1">4,000+</div>
              <div className="text-sm font-bold text-slate-600">Reviews</div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-black text-brand-orange mb-1">98%</div>
              <div className="text-sm font-bold text-slate-600">Would Recommend</div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl font-black text-brand-orange mb-1">50,000+</div>
              <div className="text-sm font-bold text-slate-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged customer photo"
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-[101] rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close enlarged image"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
          <img
            src={enlargedPhotoUrl(lightboxUrl)}
            alt="Customer photo enlarged"
            className="max-h-[min(90vh,900px)] max-w-full w-auto object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};
