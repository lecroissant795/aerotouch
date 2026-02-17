
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 5, 
  interactive = false, 
  onRate,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "button"} // Always button to keep alignment but disable if not interactive
          disabled={!interactive}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(null)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star 
            className={`
              ${size === 4 ? 'w-4 h-4' : size === 6 ? 'w-6 h-6' : 'w-5 h-5'} 
              ${star <= displayRating ? 'fill-brand-orange text-brand-orange' : 'text-slate-300 fill-slate-100'}
            `} 
          />
        </button>
      ))}
    </div>
  );
};
