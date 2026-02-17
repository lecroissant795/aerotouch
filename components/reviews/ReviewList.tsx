
import React from 'react';
import { StarRating } from './StarRating';
import { Review } from '../../utils/supabase/client';
import { BadgeCheck, ThumbsUp } from 'lucide-react';

// Hardcoded "Sticky" Top Reviews to ensure social proof quality
const FEATURED_REVIEWS = [
  {
    id: 'static-1',
    author: 'James R.',
    rating: 5,
    date: '3 days ago',
    title: 'My knees stopped clicking',
    content: "I didn't realize my knee pain was coming from my flat feet until I tried these. The arch support is aggressive but comfortable. Total game changer for leg day.",
    verified: true,
    likes: 56
  },
  {
    id: 'static-2',
    author: 'Sarah K.',
    rating: 5,
    date: '1 week ago',
    title: 'Better than my customs',
    content: "My podiatrist recommended these as a cheaper alternative to a second pair of customs. Honestly? I prefer these. They have more 'pop' and energy return.",
    verified: true,
    likes: 142
  }
];

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-100 rounded-2xl h-48 w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Reviews (Static) */}
      {FEATURED_REVIEWS.map((review) => (
        <div key={review.id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                {review.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{review.author}</span>
                  {review.verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                </div>
                <span className="text-xs text-slate-400">Verified Buyer · {review.date}</span>
              </div>
            </div>
            <StarRating rating={review.rating} size={4} />
          </div>
          
          <h4 className="font-bold text-slate-900 mb-2">{review.title}</h4>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.content}"</p>
          
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium cursor-pointer hover:text-slate-600">
            <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.likes})
          </div>
        </div>
      ))}

      {/* Real Reviews (Supabase) */}
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center font-bold text-brand-orange">
                {review.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{review.author_name}</span>
                  {review.is_verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                </div>
                <span className="text-xs text-slate-400">
                    {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <StarRating rating={review.rating} size={4} />
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-0">"{review.content}"</p>
        </div>
      ))}
      
      {reviews.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
              Be the first to write a new review!
          </div>
      )}
    </div>
  );
};
