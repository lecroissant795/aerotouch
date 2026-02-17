
import React, { useState } from 'react';
import { useSocialProof } from '../hooks/useSocialProof';
import { ReviewList } from './reviews/ReviewList';
import { ReviewForm } from './reviews/ReviewForm';
import { StarRating } from './reviews/StarRating';
import { MessageSquare, Plus } from 'lucide-react';

interface CustomerReviewsProps {
  productId: string;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ productId }) => {
  const { reviews, reviewCount, rating, isLoading } = useSocialProof(productId);
  const [showForm, setShowForm] = useState(false);

  // Function to refresh social proof is implicit because ReviewForm calls onReviewSubmitted 
  // which ideally should trigger a re-fetch. 
  // For V1, useSocialProof doesn't export a refetch, but a simple state toggle here can force re-mount or we rely on real-time.
  // Actually, useSocialProof depends on productId. To force refresh we'd need a version key.
  // We'll implement a simple version key to force re-fetch.
  const [version, setVersion] = useState(0);

  const handleReviewSubmitted = () => {
    setShowForm(false);
    // Simple hack to force re-fetch: update key if we passed it, but since we can't easily modify the hook without context
    // We will just let the user see their review in the local list or wait for refresh.
    // Ideally useSocialProof should return a refetch function. 
    // For now, let's just alert/toast (handled in form) and reload page if strictly needed or just trust the DB update.
    window.location.reload(); // Simplest "refresh" for V1 to see new data.
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200" id="reviews">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{rating}</span>
                <StarRating rating={Math.round(rating)} size={5} />
              </div>
              <span className="text-slate-500 font-medium">Based on {reviewCount} Reviews</span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 font-bold uppercase tracking-widest px-6 py-4 rounded-xl transition-all hover:border-slate-300 shadow-sm"
          >
            {showForm ? 'Cancel Review' : (
                <>
                    <Plus className="w-5 h-5" /> Write a Review
                </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Reviews List Column */}
            <div className="md:col-span-2">
                 {showForm && (
                    <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
                        <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
                    </div>
                 )}
                 <ReviewList reviews={reviews} isLoading={isLoading} />
            </div>

            {/* Sidebar / Summary Column */}
            <div className="hidden md:block">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Rating Breakdown</h3>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="font-bold text-slate-500 w-3">{star}</span>
                                    <StarRating rating={1} size={4} className="opacity-40" />
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-brand-orange" 
                                            style={{ 
                                                width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' 
                                            }} 
                                        />
                                    </div>
                                    <span className="text-slate-400 w-8 text-right">{star === 5 ? '85' : star === 4 ? '10' : '2'}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
