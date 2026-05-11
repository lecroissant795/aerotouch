import React, { useCallback, useEffect, useRef } from 'react';

/** Matches Tailwind `brand-dark` */
const BRAND_DARK = '#1E293B';
const POINTER_OFF = { x: -1e9, y: -1e9 };

/**
 * Full-bleed interactive “+” grid for dark hero sections.
 * Proximity highlight via canvas (no DOM per cell). Pointer events use the parent `<section>` (bubbling).
 */
export const InteractivePlusGridBackground: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef(POINTER_OFF);
  const scheduledRef = useRef(false);
  const reduceMotionRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const parent = wrap.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w < 1 || h < 1) return;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const targetW = Math.floor(w * dpr);
    const targetH = Math.floor(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = BRAND_DARK;
    ctx.fillRect(0, 0, w, h);

    const lowMotion = reduceMotionRef.current;
    const cellSize = w < 480 ? 30 : w < 768 ? 26 : 22;
    const maxR = lowMotion ? 0 : w < 768 ? 100 : 150;
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const half = cellSize / 2;
    for (let gx = half; gx < w; gx += cellSize) {
      for (let gy = half; gy < h; gy += cellSize) {
        let t = 0;
        if (!lowMotion && maxR > 0) {
          const d = Math.hypot(gx - px, gy - py);
          t = Math.max(0, 1 - d / maxR);
          t *= t;
        }
        const alpha = 0.06 + t * 0.42;
        const arm = 2.5 + t * 5.5;
        ctx.strokeStyle = `rgba(226, 232, 240, ${alpha})`;
        ctx.lineWidth = 0.7 + t * 1.8;
        ctx.beginPath();
        ctx.moveTo(gx - arm, gy);
        ctx.lineTo(gx + arm, gy);
        ctx.moveTo(gx, gy - arm);
        ctx.lineTo(gx, gy + arm);
        ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const parent = wrap.parentElement;
    if (!parent) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduce = () => {
      reduceMotionRef.current = mq.matches;
    };
    syncReduce();
    mq.addEventListener('change', syncReduce);

    const scheduleDraw = () => {
      if (scheduledRef.current) return;
      scheduledRef.current = true;
      requestAnimationFrame(() => {
        scheduledRef.current = false;
        draw();
      });
    };

    const onPointerMove = (ev: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      pointerRef.current = {
        x: ev.clientX - r.left,
        y: ev.clientY - r.top,
      };
      scheduleDraw();
    };

    const clearPointer = () => {
      pointerRef.current = POINTER_OFF;
      scheduleDraw();
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (ev.pointerType === 'touch') clearPointer();
    };

    parent.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('pointerleave', clearPointer);
    parent.addEventListener('pointercancel', clearPointer);
    parent.addEventListener('pointerup', onPointerUp, { passive: true });

    const ro = new ResizeObserver(scheduleDraw);
    ro.observe(parent);
    scheduleDraw();

    return () => {
      mq.removeEventListener('change', syncReduce);
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', clearPointer);
      parent.removeEventListener('pointercancel', clearPointer);
      parent.removeEventListener('pointerup', onPointerUp);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      {/* Grain: desktop only — feTurbulence can be costly on low-end phones */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.04] mix-blend-soft-light md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
