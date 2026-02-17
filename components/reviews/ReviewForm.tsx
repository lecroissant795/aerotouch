
import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { supabase } from '../../utils/supabase/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const { error: insertError } = await supabase
        .from('reviews')
        .insert([
          {
            product_id: productId,
            rating,
            author_name: name,
            content,
            is_verified: false // User submissions are unverified by default
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setName('');
      setContent('');
      onReviewSubmitted();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
        <p className="text-slate-600">Your review has been submitted successfully.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-bold text-green-700 hover:underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Write a Review</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
        <StarRating rating={rating} interactive onRate={setRating} size={6} />
      </div>

      <div className="mb-6">
        <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-slate-900 placeholder:text-slate-400"
          placeholder="e.g. John Doe"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Review</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none"
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
};
