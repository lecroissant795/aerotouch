import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from '../utils/router';
import { Page } from '../types';

export type SmartFooterBannerAnimation = 'slide' | 'fade' | 'both';

export interface SmartFooterBannerProps {
  /** Scroll depth 0–1 at which the banner appears (e.g. 0.82 = 82% of page). */
  revealThreshold?: number;
  animation?: SmartFooterBannerAnimation;
  transitionMs?: number;
  easingCss?: string;
  /** Once revealed, stay visible even when scrolling back up. */
  stickyAfterReveal?: boolean;
  message?: React.ReactNode;
  ctaLabel?: string;
  onCtaClick?: () => void;
  secondaryLinkLabel?: string;
  secondaryHref?: string;
  onSecondaryClick?: () => void;
  background?: string;
  textColor?: string;
  buttonBackground?: string;
  buttonTextColor?: string;
  className?: string;
  innerClassName?: string;
  regionAriaLabel?: string;
  ctaAriaLabel?: string;
  dismissible?: boolean;
  zIndexClass?: string;
  /** CSS box-shadow for the banner strip (e.g. 0 -8px 32px rgba(0,0,0,0.2)). */
  boxShadow?: string;
}

const DEFAULT_THRESHOLD = 0.82;
const DEFAULT_MS = 420;
const DEFAULT_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

function getScrollRatio(): number {
  const el = document.documentElement;
  const scrollTop = window.scrollY ?? el.scrollTop;
  const scrollHeight = el.scrollHeight;
  const clientHeight = window.innerHeight;
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 4) return 1;
  return scrollTop / maxScroll;
}

function isNearBottom(threshold: number): boolean {
  const el = document.documentElement;
  const scrollHeight = el.scrollHeight;
  const clientHeight = window.innerHeight;
  if (scrollHeight <= clientHeight + 4) return true;
  return getScrollRatio() >= threshold;
}

export const SmartFooterBanner: React.FC<SmartFooterBannerProps> = ({
  revealThreshold = DEFAULT_THRESHOLD,
  animation = 'both',
  transitionMs = DEFAULT_MS,
  easingCss = DEFAULT_EASING,
  stickyAfterReveal = false,
  message = (
    <>
      <span aria-hidden="true">🎉</span>{' '}
      Special offer! Get 20% off your first order. Limited time only!
    </>
  ),
  ctaLabel = 'Get Offer',
  onCtaClick,
  secondaryLinkLabel,
  secondaryHref,
  onSecondaryClick,
  background = '#000000',
  textColor = '#ffffff',
  buttonBackground = '#ffffff',
  buttonTextColor = '#000000',
  className = '',
  innerClassName = '',
  regionAriaLabel = 'Promotional offer',
  ctaAriaLabel = 'Get offer: 20% off your first order',
  dismissible = false,
  zIndexClass = 'z-[55]',
  boxShadow,
}) => {
  const { navigate } = useRouter();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  const updateVisibility = useCallback(() => {
    if (dismissed) {
      setVisible(false);
      return;
    }
    const near = isNearBottom(revealThreshold);
    if (stickyAfterReveal) {
      if (near) unlockedRef.current = true;
      setVisible(unlockedRef.current);
    } else {
      setVisible(near);
    }
  }, [dismissed, revealThreshold, stickyAfterReveal]);

  useEffect(() => {
    updateVisibility();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateVisibility();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
    };
  }, [updateVisibility]);

  const effectiveMs = reducedMotion ? 0 : transitionMs;
  const transition = `opacity ${effectiveMs}ms ${easingCss}, transform ${effectiveMs}ms ${easingCss}`;

  let transformHidden = 'translateY(0)';
  let opacityHidden = 1;
  if (animation === 'slide' || animation === 'both') transformHidden = 'translateY(100%)';
  if (animation === 'fade' || animation === 'both') opacityHidden = 0;

  const outerStyle: React.CSSProperties = {
    transition,
    transform: visible ? 'translateY(0)' : transformHidden,
    opacity: visible ? 1 : opacityHidden,
    background,
    color: textColor,
    ...(boxShadow ? { boxShadow } : {}),
    paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
  };

  const defaultCta = () => navigate(Page.SHOP);

  const handleCta = (e: React.MouseEvent) => {
    e.preventDefault();
    (onCtaClick ?? defaultCta)();
  };

  const handleSecondary = (e: React.MouseEvent) => {
    e.preventDefault();
    onSecondaryClick?.();
  };

  return (
    <div
      role="region"
      aria-label={regionAriaLabel}
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 pointer-events-none ${zIndexClass} ${className}`}
      style={{ ...outerStyle, pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div
        className={`mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-6 ${innerClassName}`}
      >
        <p className="text-center text-sm font-medium leading-snug sm:text-left sm:text-base">{message}</p>

        <div className="flex flex-shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          {secondaryLinkLabel && (secondaryHref || onSecondaryClick) && (
            <a
              href={secondaryHref ?? '#'}
              onClick={handleSecondary}
              className="text-center text-sm underline underline-offset-2 opacity-90 hover:opacity-100 sm:text-left"
            >
              {secondaryLinkLabel}
            </a>
          )}
          <button
            type="button"
            onClick={handleCta}
            aria-label={ctaAriaLabel}
            className="rounded-md px-5 py-2.5 text-sm font-semibold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ background: buttonBackground, color: buttonTextColor }}
          >
            {ctaLabel}
          </button>
          {dismissible && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-xs font-medium opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:ml-1"
              aria-label="Dismiss promotion"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
