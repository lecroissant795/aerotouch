import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShieldCheck, Zap, Wind, Thermometer, Heart, Leaf, Award, Clock, Users, Star, Truck, BadgeCheck, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { isMassageRollerProduct, isHeightBoosterProduct } from '../utils/productDetection';

type SecondaryReviewProductKey =
  | 'compressionSocks'
  | 'gripSocks'
  | 'heelCushions'
  | 'heightBoosters'
  | 'massageGun'
  | 'massageRoller'
  | 'toeCushionPads'
  | 'toeSpacers'
  | 'default';

type RealResultReview = {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  title: string;
  content: string;
  date: string;
};

const rr = (
  id: number,
  name: string,
  role: string,
  title: string,
  content: string,
  date: string,
  rating: number = 5,
): RealResultReview => ({ id, name, role, image: '', rating, title, content, date });

const REAL_RESULT_REVIEWS: Record<SecondaryReviewProductKey, RealResultReview[]> = {
  compressionSocks: [
    rr(1, 'Harper Ellis', 'Physical Therapist', 'Legs feel lighter after clinic days', "I am on my feet moving between patients all day. These socks give steady compression without squeezing my toes, and my calves do not feel as heavy by dinner.", '2 days ago'),
    rr(2, 'Noah Singh', 'Flight Attendant', 'Perfect for long-haul flights', "I wear them under my uniform on international routes. The swelling I used to get around my ankles is way less noticeable after landing.", '4 days ago'),
    rr(3, 'Lena Brooks', 'Retail Supervisor', 'Helped with end-of-day tightness', "Eight hours on the shop floor used to leave my lower legs buzzing. These feel supportive without being hot or scratchy.", '5 days ago'),
    rr(4, 'Omar Patel', 'Warehouse Picker', 'Support that stays put', "I wanted compression socks that did not slide down halfway through a shift. These stay up and make the constant walking feel easier.", '1 week ago'),
    rr(5, 'Grace Kim', 'Teacher', 'Comfortable enough for school days', "I stand at the board and walk the classroom nonstop. They are snug in the right way, and my ankles do not feel as puffy after work.", '1 week ago'),
    rr(6, 'Anton Reed', 'Chef', 'Kitchen shift approved', "Hot kitchen, hard floors, long hours. I expected to peel them off after lunch, but they stayed comfortable through service.", '2 weeks ago'),
    rr(7, 'Sofia Morales', 'Nurse', 'Reliable for 12-hour shifts', "Compression helps, but only if you can actually wear it all day. These are firm without cutting in behind my knees.", '2 weeks ago'),
    rr(8, 'Caleb Turner', 'Mail Carrier', 'Great for walking routes', "My calves used to feel cooked after long routes. These have become part of my uniform because recovery feels easier at night.", '3 weeks ago'),
    rr(9, 'Iris Chen', 'Hair Stylist', 'Less heaviness after appointments', "Standing behind the chair all day adds up. These give my legs that supported feeling without looking medical or bulky.", '3 weeks ago', 4),
  ],
  gripSocks: [
    rr(1, 'Keira Walsh', 'Pilates Coach', 'No slipping on the reformer', "The grip is exactly where I need it. I can cue clients and demonstrate without adjusting my feet every few minutes.", '2 days ago'),
    rr(2, 'Nathan Quinn', 'Physical Therapist', 'Stable through balance work', "I use them for mobility drills at home. The sole grip makes single-leg work feel controlled without needing shoes.", '3 days ago'),
    rr(3, 'Priyanka Desai', 'Yoga Student', 'Better grounding in class', "My old socks twisted during flows. These stay put and help me feel more planted in lunges and standing poses.", '5 days ago'),
    rr(4, 'Logan Reed', 'Home Gym User', 'Great for mat workouts', "I wanted something between barefoot and trainers. These are comfortable for stretching, core work, and light circuits.", '1 week ago'),
    rr(5, 'Amelia Scott', 'Barre Instructor', 'Grip without bulk', "They are thin enough to feel the floor but grippy enough that my feet are not sliding during pulses.", '1 week ago'),
    rr(6, 'Benji Morales', 'Dance Teacher', 'Secure for studio warmups', "I use them before switching into dance shoes. The fit is snug, and the traction gives me confidence on slick studio floors.", '2 weeks ago'),
    rr(7, 'Clara Evans', 'Reformer Instructor', 'Clients keep asking about them', "They look clean, feel soft, and do not bunch at the toes. I bought a second pair after one week.", '2 weeks ago'),
    rr(8, 'Owen Blake', 'Martial Arts Coach', 'Good for mobility sessions', "For warmups and recovery work, they give enough grip without locking my foot in place like a shoe.", '3 weeks ago'),
    rr(9, 'Suri Park', 'Hospital Physio', 'Comfortable clinic pair', "I keep them in my bag for floor-based demos. They wash well and the grip has held up better than expected.", '3 weeks ago', 4),
  ],
  heelCushions: [
    rr(1, 'Riley Shaw', 'Retail Lead', 'Saved my stiff work shoes', "My heels used to rub raw by closing time. These pads softened the back of the shoe and made the fit feel much more secure.", '2 days ago'),
    rr(2, 'Monica Alvarez', 'Dental Assistant', 'Less heel ache on tile floors', "Clinic floors are unforgiving. The cushions take the sharp edge off every step, especially when I am standing chairside for hours.", '4 days ago'),
    rr(3, 'Peter Lawson', 'Security Officer', 'No more heel slipping', "One pair of boots was just a little loose. These filled the gap neatly and stopped my heel from lifting with every step.", '6 days ago'),
    rr(4, 'Sienna Hart', 'Flight Attendant', 'Great for breaking in flats', "New flats usually destroy the back of my heels. I added these before a trip and got through the day without blisters.", '1 week ago'),
    rr(5, 'Graham Lee', 'Delivery Driver', 'Simple fix for hard shoes', "I am in and out of the van all day. They stay stuck, do not bunch up, and make my work shoes feel less harsh.", '1 week ago'),
    rr(6, 'Hazel Price', 'Bartender', 'Helped during long service', "Standing behind the bar used to leave my heels tender. These cushions are small, but the comfort difference is obvious.", '2 weeks ago'),
    rr(7, 'Andre Brooks', 'Teacher', 'Better fit in dress shoes', "My dress shoes slipped just enough to annoy me all day. The pads made them feel snug without needing thicker socks.", '2 weeks ago'),
    rr(8, 'Naomi Reed', 'Wedding Planner', 'Saved event-day heels', "I added them to a pair I had to wear for a 10-hour event. My heels still felt tired, but not shredded.", '3 weeks ago', 4),
    rr(9, 'Isaac Morgan', 'Chef', 'Stays in place under pressure', "Heat, movement, hard floors, and they still held up. I am surprised something this simple helped so much.", '3 weeks ago'),
  ],
  heightBoosters: [
    rr(1, 'Adrian Cole', 'Sales Representative', 'Subtle confidence in work shoes', "I did not want obvious lifts. These sit inside my Oxfords cleanly and give me a bit more presence without changing how I walk.", '2 days ago'),
    rr(2, 'Mira Weston', 'Event Planner', 'Great for photos and long events', "I use them in boots for client events. They add height without looking like platforms, and I can still move around all day.", '4 days ago'),
    rr(3, 'Theo Banks', 'Graduate Student', 'No awkward stacked feeling', "Cheap inserts felt like standing on blocks. These feel more cushioned and gradual, so I actually kept wearing them.", '5 days ago'),
    rr(4, 'Celeste Yang', 'Photographer', 'Helpful behind the camera', "A little extra height helps when I am shooting groups. They are discreet enough that nobody notices, which is the point.", '1 week ago'),
    rr(5, 'Jonah Price', 'Realtor', 'Works in dress boots', "Showings mean a lot of standing and first impressions. These make me feel sharper without making my shoes uncomfortable.", '1 week ago'),
    rr(6, 'Leila Morgan', 'Office Manager', 'Comfortable for full office days', "I expected to swap them out by lunch. Instead, they stayed comfortable and gave me the subtle lift I wanted.", '2 weeks ago'),
    rr(7, 'Samir Rao', 'Product Designer', 'Discreet and easy to trim', "They fit my sneakers after a small trim. The lift is noticeable to me but not obvious to anyone else.", '2 weeks ago'),
    rr(8, 'Olivia Hayes', 'Recruiter', 'Better posture in meetings', "I stand a little taller and stop thinking about height in every group conversation. That alone makes them worth it.", '3 weeks ago'),
    rr(9, 'Mateo Cruz', 'Musician', 'Stage shoes feel better', "I use them in boots for gigs. They give me a cleaner stance without making my feet ache halfway through the set.", '3 weeks ago', 4),
  ],
  massageGun: [
    rr(1, 'Erin Bell', 'ICU Nurse', 'Fast relief after shifts', "My calves feel locked up after hospital nights. A few minutes on low speed helps loosen everything before I even sit down for dinner.", '2 days ago'),
    rr(2, 'Jason Kerr', 'Cyclist', 'Great for calves and arches', "I use the smaller head around my feet and the round head on calves. It saves my hands compared with manual massage.", '3 days ago'),
    rr(3, 'Aisha Patel', 'Desk Worker', 'Easy evening reset', "Sitting all day still leaves my feet tight after commuting. This gets into the arch without needing a whole stretching routine.", '5 days ago'),
    rr(4, 'Trevor Young', 'Contractor', 'Strong but controllable', "The lower settings are gentle enough for feet, and the higher ones handle calves after site work. Battery life has been solid.", '1 week ago'),
    rr(5, 'Lila Chen', 'Marathon Volunteer', 'Helped after race weekends', "I am standing for hours at events. Using this on my calves afterward makes the next morning much easier.", '1 week ago'),
    rr(6, 'Grant Miller', 'Firefighter', 'Good for heavy boot days', "After training in heavy boots, my lower legs need attention. This is quick, targeted, and easy to keep in my locker.", '2 weeks ago'),
    rr(7, 'Rosa Diaz', 'Massage Therapist', 'Compact recovery tool', "I am picky about tools. For the size, it gives useful pressure and the attachments make it easy to avoid bony areas.", '2 weeks ago'),
    rr(8, 'Henry Cole', 'Warehouse Supervisor', 'Less calf tightness at night', "I use it while watching TV after shift. It is simple, quiet enough, and helps my legs settle down.", '3 weeks ago'),
    rr(9, 'Naomi Fields', 'Chef', 'Helpful after service', "Kitchen floors are brutal. Five minutes on the calves and arches has become part of my closing routine.", '3 weeks ago', 4),
  ],
  massageRoller: [
    rr(1, 'Dana Walsh', 'ER Nurse', 'Finally unwinds my arches', "I use it under my feet after night shifts. The pressure points hit sore spots better than a tennis ball and my arches feel looser by morning.", '2 days ago'),
    rr(2, 'Brett Nolan', 'Marathon Runner', 'Post-run ritual', "After tempo runs my plantar fascia gets tight. Rolling slowly for a few minutes helps me bounce back before the next session.", '4 days ago'),
    rr(3, 'Kira Bennett', 'Retail Associate', 'Small but effective', "Concrete floors leave my heels burning. I keep the roller by the couch and use it after work while I decompress.", '6 days ago'),
    rr(4, 'Luis Romero', 'Barista', 'Great for quick breaks', "I roll each foot before bed and sometimes during split shifts. It is simple, but the relief is real.", '1 week ago'),
    rr(5, 'Tessa Grant', 'PT Aide', 'Better than the cheap roller I had', "The shape fits my arch better and does not slide around as much. It feels targeted without being too aggressive.", '1 week ago'),
    rr(6, 'Malcolm Pierce', 'Consultant', 'Travel-friendly recovery', "It lives in my carry-on. After airport days, two minutes per foot makes hotel room recovery much easier.", '2 weeks ago'),
    rr(7, 'Nina Cooper', 'Yoga Instructor', 'Good pressure control', "I can go gentle or lean in when my arches need more. It is useful after teaching back-to-back classes.", '2 weeks ago'),
    rr(8, 'Victor Hale', 'Mechanic', 'Helps after boot days', "Work boots make my feet feel compressed. Rolling at night loosens the tight feeling along the sole.", '3 weeks ago'),
    rr(9, 'Alana Fox', 'Server', 'End-of-shift staple', "I bought it for sore feet and ended up using it almost every night. Small enough to keep beside the sofa.", '3 weeks ago', 4),
  ],
  toeCushionPads: [
    rr(1, 'Molly Harris', 'Boutique Associate', 'Stopped front-shoe rubbing', "My toes used to feel raw in new flats. These add just enough cushion where the shoe rubs without making the fit tight.", '2 days ago'),
    rr(2, 'Julian Watts', 'Daily Commuter', 'Comfort in narrow sneakers', "I walk to the train every morning. The pads take away that hot spot near the front of my shoe.", '4 days ago'),
    rr(3, 'Hana Mori', 'Server', 'No constant adjusting', "I needed cushioning that stayed put during a dinner rush. These are low profile and I barely notice them once they are in.", '5 days ago'),
    rr(4, 'Felix Grant', 'Sales Associate', 'Helpful for break-in days', "New shoes usually punish my toes. I added these before a full shift and avoided the usual blisters.", '1 week ago'),
    rr(5, 'Renee Foster', 'Flight Attendant', 'Soft barrier for long days', "They help where my work shoes press at the front. I like that they do not feel bulky in dress shoes.", '1 week ago'),
    rr(6, 'Tina Nguyen', 'Nail Technician', 'Gentle cushioning in flats', "I sit and stand all day in flats. These make the toe area feel softer without sliding around.", '2 weeks ago'),
    rr(7, 'Cole Bennett', 'Photographer', 'Saved my event shoes', "I had a wedding shoot in stiff shoes and these kept the toe rubbing manageable for the whole day.", '2 weeks ago', 4),
    rr(8, 'Alina Brooks', 'Violinist', 'Comfort for performance shoes', "Concert shoes are not forgiving. These give a little cushion right where I need it and stay discreet.", '3 weeks ago'),
    rr(9, 'Patrick Mills', 'Hotel Concierge', 'Better for polished work shoes', "I can keep wearing my dress shoes without the front edge digging into my toes by afternoon.", '3 weeks ago'),
  ],
  toeSpacers: [
    rr(1, 'Brianna Cole', 'Yoga Teacher', 'Feet feel more open', "After teaching in bare feet all day, wearing these at night helps my toes relax instead of staying cramped together.", '2 days ago'),
    rr(2, 'Devon Harper', 'Trail Runner', 'Great recovery after runs', "My forefoot gets tight after hills. Twenty minutes with the spacers makes my toes feel less compressed.", '4 days ago'),
    rr(3, 'Elise Warner', 'Ballet Instructor', 'Gentle reset after class', "My feet spend hours inside tight shoes. These are an easy reset when I get home, especially around the big toe.", '6 days ago'),
    rr(4, 'Martin Jensen', 'Office Manager', 'Helpful after dress shoes', "Dress shoes leave my toes squeezed by the end of the day. These help everything spread out again while I watch TV.", '1 week ago'),
    rr(5, 'Paige Lin', 'Nurse', 'Comfortable nightly routine', "I started with ten minutes and worked up slowly. Now they are part of my post-shift recovery routine.", '1 week ago'),
    rr(6, 'Carter Stone', 'Rock Climber', 'Good forefoot relief', "Climbing shoes are brutal. The spacers help my toes stop feeling jammed together after gym sessions.", '2 weeks ago'),
    rr(7, 'Fiona Patel', 'Pilates Instructor', 'Better grounding work', "They make my feet feel more aware during footwork. I use them before bed and sometimes before class.", '2 weeks ago'),
    rr(8, 'Simon Clarke', 'Mechanic', 'Less cramped after boots', "Steel-toe boots are not kind to toes. These help unwind that compressed feeling after long days.", '3 weeks ago', 4),
    rr(9, 'Natalia Reyes', 'Stylist', 'Simple but effective', "I wear fashion shoes for work and my toes pay for it. These are the easiest way to reset at night.", '3 weeks ago'),
  ],
  default: [
    rr(1, 'Maddie Sloan', 'Fitness Enthusiast', 'Simple comfort upgrade', "I added this to my daily routine and noticed the difference quickly. It is easy to use and feels built for regular wear.", '2 days ago'),
    rr(2, 'Elliot Park', 'Office Worker', 'Useful every day', "I wanted something practical, not complicated. This has become one of those small comfort upgrades I actually keep using.", '4 days ago'),
    rr(3, 'Tara Fields', 'Weekend Walker', 'Good quality for the price', "The materials feel better than the generic options I tried before. It does exactly what I needed without fuss.", '5 days ago'),
    rr(4, 'Nolan Pierce', 'Trainer', 'Solid recovery support', "I recommend simple tools people will actually use. This fits that category: easy, portable, and helpful after long days.", '1 week ago'),
    rr(5, 'Vivian Ross', 'Teacher', 'Made workdays easier', "Standing all day is easier when small pressure points are handled. This was a straightforward fix for daily comfort.", '1 week ago'),
    rr(6, 'George Tan', 'Delivery Driver', 'Holds up well', "I use it constantly and it still feels solid. Good value for something that gets daily use.", '2 weeks ago'),
    rr(7, 'Penny Moore', 'Caregiver', 'Comfort I noticed quickly', "Long shifts make little discomforts add up. This helped more than I expected for such a simple product.", '2 weeks ago'),
    rr(8, 'Miles Hunter', 'Weekend Athlete', 'Easy to keep in my bag', "It is lightweight, practical, and useful after training. No complicated setup, which is why I keep using it.", '3 weeks ago', 4),
    rr(9, 'Jade Norton', 'Retail Manager', 'Better than my old option', "The fit and feel are more comfortable than the generic one I had. I would buy it again.", '3 weeks ago'),
  ],
};

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

const INITIAL_REAL_RESULT_REVIEW_COUNT = 6;
const REAL_RESULT_REVIEW_BATCH_SIZE = 3;

const productMatches = (product: Product | undefined, handles: string[], names: string[]): boolean => {
  if (!product) return false;
  const handle = (product.handle || '').toLowerCase();
  const id = String(product.id || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  return handles.some((value) => handle === value || id === value) || names.some((value) => name.includes(value));
};

const getReviewProductKey = (product?: Product): SecondaryReviewProductKey => {
  if (product && isMassageRollerProduct(product)) return 'massageRoller';
  if (product && isHeightBoosterProduct(product)) return 'heightBoosters';
  if (productMatches(product, ['grip-socks'], ['grip socks'])) return 'gripSocks';
  if (productMatches(product, ['heel-cushion-pds', 'heel-cushion-pad'], ['heel cushion'])) return 'heelCushions';
  if (productMatches(product, ['massage-gun'], ['massage gun'])) return 'massageGun';
  if (productMatches(product, ['toe-cushion-pds', 'toe-cushion-pad'], ['toe cushion'])) return 'toeCushionPads';
  if (productMatches(product, ['toe-spacers'], ['toe spacers'])) return 'toeSpacers';
  if (productMatches(product, ['compression-socks'], ['compression socks'])) return 'compressionSocks';
  return 'default';
};

const REVIEW_SECTION_INTROS: Record<SecondaryReviewProductKey, string> = {
  compressionSocks: 'Real stories from people who wear AeroTouch Compression Socks through long shifts, travel days, and everyday recovery.',
  gripSocks: 'Real stories from people using AeroTouch Grip Socks for studio sessions, balance work, and barefoot-style training.',
  heelCushions: 'Real stories from people who use AeroTouch Heel Cushions to reduce rubbing, slipping, and hard-shoe pressure.',
  heightBoosters: 'Real stories from people using discreet AeroTouch Height Boosters for work, events, photos, and everyday confidence.',
  massageGun: 'Real stories from people using the AeroTouch Massage Gun for tight calves, sore arches, and post-shift recovery.',
  massageRoller: 'Real stories from people who use the AeroTouch Foot Massage Roller for tired feet, training, and long days on the move.',
  toeCushionPads: 'Real stories from people who use AeroTouch Toe Cushion Pads to soften rubbing, hot spots, and front-shoe pressure.',
  toeSpacers: 'Real stories from people using AeroTouch Toe Spacers to reset cramped toes after shoes, training, and long days.',
  default: 'Real stories from people using AeroTouch accessories for simple, everyday comfort and recovery.',
};

interface ProductDescriptionProps {
  /** When set, review grid copy matches the active secondary PDP product. */
  product?: Product;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const reviewProductKey = useMemo(() => getReviewProductKey(product), [product]);
  const realResultReviews = REAL_RESULT_REVIEWS[reviewProductKey];
  const [visibleRealResultReviews, setVisibleRealResultReviews] = useState(INITIAL_REAL_RESULT_REVIEW_COUNT);
  const [failedRealResultImageIds, setFailedRealResultImageIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setVisibleRealResultReviews(INITIAL_REAL_RESULT_REVIEW_COUNT);
    setFailedRealResultImageIds(new Set());
  }, [reviewProductKey]);

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

      {/* More Customer Reviews Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
                Real Results from Real People
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                {REVIEW_SECTION_INTROS[reviewProductKey]}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realResultReviews
                .slice(0, visibleRealResultReviews)
                .map((review) => {
                  const showPhoto = Boolean(review.image) && !failedRealResultImageIds.has(review.id);
                  return (
                    <div
                      key={review.id}
                      className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer transition-shadow duration-500"
                      style={{ height: '480px' }}
                    >
                      {showPhoto ? (
                        <img
                          src={review.image}
                          alt={review.name + ' using AeroTouch'}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          onError={() =>
                            setFailedRealResultImageIds((prev) => {
                              const next = new Set(prev);
                              next.add(review.id);
                              return next;
                            })
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" aria-hidden />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                        <h5 className="text-xl font-black text-white mb-2">{review.title}</h5>

                        <div className="flex items-center gap-3 mb-3">
                          <div>
                            <h4 className="font-black text-white text-sm leading-none">{review.name}</h4>
                            <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{review.role}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                            <BadgeCheck className="w-3 h-3 text-brand-lime" />
                            <span className="text-[8px] font-bold text-white/80 uppercase">Verified</span>
                          </div>
                        </div>

                        <div className="flex text-yellow-400 gap-0.5 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-white/30'}`}
                            />
                          ))}
                        </div>

                        <div className="relative">
                          <p className="text-white/80 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                            "{review.content}"
                          </p>
                        </div>

                        <div className="mt-2 flex items-center gap-1.5 opacity-60 group-hover:opacity-0 transition-opacity duration-300">
                          <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                            Hover to read more
                          </span>
                          <ChevronRight className="w-3 h-3 text-white/50" />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {visibleRealResultReviews < realResultReviews.length && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleRealResultReviews((prev) =>
                      Math.min(prev + REAL_RESULT_REVIEW_BATCH_SIZE, realResultReviews.length)
                    )
                  }
                  className="view-more-reviews-button inline-flex items-center gap-2 bg-white border-2 border-slate-200 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-slate-900 shadow-sm"
                >
                  View More Reviews
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};
