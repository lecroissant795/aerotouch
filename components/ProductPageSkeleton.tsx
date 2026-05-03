import React from 'react';

/** PDP-shaped placeholders while App fetches product by URL handle (no full-screen block). */
export const ProductPageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 pt-6 md:pt-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-4 w-24 rounded bg-slate-200/90 animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-slate-200/80 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-16 shrink-0 rounded-lg bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <div className="h-8 w-full max-w-md rounded bg-slate-200/90 animate-pulse" />
          <div className="h-6 w-32 rounded bg-slate-200/80 animate-pulse" />
          <div className="h-12 w-40 rounded-xl bg-slate-200/80 animate-pulse" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full rounded bg-slate-200/70 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-200/70 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-slate-200/70 animate-pulse" />
          </div>
          <div className="h-14 w-full max-w-sm rounded-xl bg-slate-300/80 animate-pulse mt-8" />
        </div>
      </div>
    </div>
  </div>
);
