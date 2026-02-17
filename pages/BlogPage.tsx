import React, { useState, useMemo } from 'react';
import { Clock, User } from 'lucide-react';
import { Button } from '../components/Button';
import type { BlogPost } from '../types';

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Signs You Need To Replace Your Insoles',
    excerpt: 'Running on worn-out gear increases injury risk. Here is how to check your insoles for critical wear patterns before it is too late.',
    category: 'Maintenance',
    author: 'Dr. Sarah K.',
    date: 'Oct 12, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    body: 'Running on worn-out gear increases injury risk. Here is how to check your insoles for critical wear patterns before it is too late.\n\nLook for visible flattening of the arch support, especially in the heel cup. Once the material compresses beyond its design spec, it stops doing its job—and your joints pick up the slack. Another red flag is uneven wear on one side, which often points to gait or alignment issues that may need attention beyond just replacing the insole. Catching these signs early can prevent knee, hip, and lower-back issues that stem from poor foot alignment.\n\nPay attention to how your feet feel during and after runs. Persistent hotspots, blisters in new places, or a general sense that your shoes “don’t feel the same” are often the first clues that your insoles have broken down. The top layer may still look intact while the supportive structure underneath has already collapsed.\n\nWe recommend inspecting your performance insoles every 300–500 miles or every 3–4 months of regular use. If you train year-round, consider a mid-season swap so you always have optimal support when it matters most. Replacing insoles is one of the highest-impact, lowest-cost steps you can take to protect your body and keep your training on track.'
  },
  {
    id: '2',
    title: 'The Psychology of Endurance: Breaking the Wall',
    excerpt: 'Marathon training is 80% mental. We spoke with elite ultra-runners about the strategies they use to keep moving when the body wants to quit.',
    category: 'Performance',
    author: 'Mark Davis',
    date: 'Oct 08, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1552674605-469555942da2?q=80&w=800&auto=format&fit=crop',
    body: 'Marathon training is 80% mental. We spoke with elite ultra-runners about the strategies they use to keep moving when the body wants to quit.\n\nBreaking the wall isn’t about ignoring pain—it’s about recognizing which signals matter. Discomfort from effort is normal; sharp or localized pain is information. The runners we interviewed consistently use small process goals: get to the next aid station, the next mile, or even the next landmark. That keeps the mind from spiraling into “I can’t finish.” One common thread: they rarely think about the full distance. They chunk the race into manageable pieces and focus only on the current segment.\n\nEquipment that reduces unnecessary load—like insoles that return energy instead of absorbing it—lets you save mental bandwidth for pacing and form. When your feet and legs feel supported, you have more capacity to stay present and push through the tough patches. Several athletes mentioned that dialing in gear and biomechanics gave them one less thing to fight; the body could do its job while the mind stayed calm. Finally, they stressed the importance of rehearsing the low moments in training. If you’ve already practiced “what do I do when everything hurts?” you’re far less likely to panic when it happens on race day.'
  },
  {
    id: '3',
    title: 'Plantar Fasciitis: A Recovery Guide',
    excerpt: 'The dreaded heel pain doesn\'t have to end your season. A comprehensive look at stretching, icing, and support strategies.',
    category: 'Recovery',
    author: 'Dr. Sarah K.',
    date: 'Sep 29, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop',
    body: "The dreaded heel pain doesn't have to end your season. A comprehensive look at stretching, icing, and support strategies.\n\nPlantar fasciitis is an overuse injury of the band of tissue that runs from heel to toe. It often flares when load exceeds the tissue's capacity to recover—common in runners who increase volume too quickly or wear shoes with poor support. Stretching the calf and the plantar fascia itself (e.g., rolling a ball under the foot, toe stretches) can provide relief and improve flexibility. Aim for short, frequent sessions rather than one long stretch; consistency matters more than intensity.\n\nSupport matters: insoles with proper arch and heel cupping reduce strain on the fascia by aligning the foot and distributing pressure. Combine that with gradual loading, icing after activity, and avoiding long periods on hard surfaces in bare feet. Night splints can help some people by keeping the fascia gently stretched while you sleep, though they’re not for everyone.\n\nMost athletes see improvement within a few weeks when they're consistent. If pain persists or worsens, see a physio or sports doc to rule out other causes and get a tailored loading program. Returning to running should be gradual—build volume and intensity slowly so the tissue can adapt instead of re-aggravating."
  },
  {
    id: '4',
    title: 'Carbon Fiber vs. Gel: What Is Right For You?',
    excerpt: 'Not all cushioning is created equal. We break down the physics of energy return versus shock absorption.',
    category: 'Gear Tech',
    author: 'James Wilson',
    date: 'Sep 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
    body: 'Not all cushioning is created equal. We break down the physics of energy return versus shock absorption.\n\nGel and soft foams excel at absorbing impact—they dissipate energy as heat and reduce peak force on joints. That can feel comfortable for walking or standing, but in running it often means more work for your muscles to re-accelerate your body with each step. Carbon fiber and responsive foams are built to store and return energy: they deform on impact and spring back, contributing to propulsion. The trade-off is straightforward: cushioning prioritizes comfort and shock absorption; responsive materials prioritize rebound and efficiency.\n\nFor high-mileage or speed work, energy return typically wins: you get support without a “dead” feel. For recovery days or if you prefer maximum cushion, a softer option may suit you. The best choice depends on your goals, injury history, and how you want your legs to feel at the end of a long run. Try both in training if you can—many runners use a responsive insole for key sessions and a plusher option for easy days. There’s no single right answer; it’s about matching the tool to the task and to your body.'
  }
];

// Main featured article: same as first post, with role for the hero block
const FEATURED_POST: BlogPost = {
  ...BLOG_POSTS[0],
  id: '1',
  authorRole: 'Sports Medicine',
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'
};

const CATEGORIES = ['All Stories', 'Performance', 'Recovery', 'Gear Tech', 'Maintenance', 'Innovation'];

interface BlogPageProps {
  onPostSelect: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onPostSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Stories');

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All Stories') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="animate-in fade-in duration-500 bg-white">
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
           <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-slate-200 bg-white mb-6">
              <span className="text-slate-500 font-mono text-xs font-bold tracking-widest uppercase">The AeroTouch Journal</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-6">
             The Edge
           </h1>
           <p className="text-xl text-slate-600 max-w-2xl mx-auto">
             Insights on performance, recovery, and gear technology from the world's leading biomechanics experts and athletes.
           </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
           <div
             role="button"
             tabIndex={0}
             onClick={() => onPostSelect(FEATURED_POST)}
             onKeyDown={(e) => e.key === 'Enter' && onPostSelect(FEATURED_POST)}
             className="group grid md:grid-cols-2 gap-12 items-center cursor-pointer"
           >
              <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                 <img 
                   src={FEATURED_POST.image} 
                   alt={FEATURED_POST.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
              </div>
              <div className="flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{FEATURED_POST.category}</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight group-hover:text-brand-orange transition-colors">
                    {FEATURED_POST.title}
                 </h2>
                 <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {FEATURED_POST.excerpt}
                 </p>
                 <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" alt={FEATURED_POST.author} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">{FEATURED_POST.author}</p>
                          <p className="text-xs text-slate-500">{FEATURED_POST.authorRole ?? 'Author'}</p>
                       </div>
                    </div>
                    <span className="text-sm font-medium text-slate-400">{FEATURED_POST.readTime}</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 overflow-x-auto">
         <div className="container mx-auto px-4 md:px-6 flex gap-2 md:gap-4">
            {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-brand-dark text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                   {cat}
                </button>
            ))}
         </div>
      </div>

      {/* Latest Stories Grid */}
      <section className="py-24">
         <div className="container mx-auto px-4 md:px-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-12 flex items-center">
               <span className="w-2 h-8 bg-brand-orange mr-4 rounded-full"></span>
               Latest Stories
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
               {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onPostSelect(post)}
                    onKeyDown={(e) => e.key === 'Enter' && onPostSelect(post)}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                     <div className="aspect-[3/2] overflow-hidden rounded-xl bg-slate-100 mb-6 relative">
                        <img 
                           src={post.image} 
                           alt={post.title} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded shadow-sm">
                           {post.category}
                        </div>
                     </div>
                     
                     <div className="flex-1 flex flex-col">
                        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-orange transition-colors leading-tight">
                           {post.title}
                        </h4>
                        <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3">
                           {post.excerpt}
                        </p>
                        
                        <div className="mt-auto flex items-center text-xs text-slate-500 font-medium pt-4 border-t border-slate-100">
                           <span className="flex items-center mr-4">
                              <User className="w-3 h-3 mr-1" />
                              {post.author}
                           </span>
                           <span className="flex items-center mr-4">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.readTime}
                           </span>
                        </div>
                     </div>
                  </article>
               ))}
            </div>

            {filteredPosts.length === 0 && (
              <p className="text-center text-slate-500 py-12">No stories in this category yet.</p>
            )}
            
            <div className="mt-20 text-center">
               <Button variant="outline" size="lg" disabled>Load More Articles</Button>
            </div>
         </div>
      </section>

      {/* Newsletter Slim */}
      <section className="py-16 bg-brand-lime">
         <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4 uppercase tracking-tight">Stay in the Loop</h2>
            <p className="text-brand-dark/80 mb-8 max-w-xl mx-auto font-medium">
               Get the latest training tips and gear drops sent straight to your inbox. No spam, just performance.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
               <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-brand-dark/10 bg-white/50 backdrop-blur placeholder:text-brand-dark/50 focus:outline-none focus:border-brand-dark font-medium"
               />
               <Button variant="secondary">Subscribe</Button>
            </div>
         </div>
      </section>

    </div>
  );
};