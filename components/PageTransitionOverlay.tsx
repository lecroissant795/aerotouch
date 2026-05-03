import React from 'react';

interface PageTransitionOverlayProps {
  visible: boolean;
}

/**
 * Full-viewport freeze layer during client-side route changes.
 * Keeps the previous frame stable while the next route (and optional PDP fetch) resolves.
 */
export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/75 backdrop-blur-sm pointer-events-auto touch-none motion-reduce:backdrop-blur-none"
      style={{ WebkitTapHighlightColor: 'transparent' }}
      aria-busy="true"
      role="status"
      aria-label="Loading page"
    >
      <div
        className="h-9 w-9 rounded-full border-[3px] border-slate-200 border-t-brand-lime motion-reduce:animate-none animate-spin"
        aria-hidden
      />
    </div>
  );
};
