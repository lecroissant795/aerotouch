/**
 * Centralized Supabase Storage media URLs.
 *
 * All media files are hosted in the "media" public bucket on Supabase Storage.
 * This module provides a single source of truth for all media URLs used across
 * the application.
 *
 * Bucket structure:
 *   media/
 *   ├── products/        ← product showcase videos
 *   ├── reviews/         ← customer review photos + videos + avatars
 *   ├── sections/        ← section background / feature images
 *   ├── testimonials/    ← testimonial photos
 *   └── misc/            ← foam-pad, runner bg, alignment diagrams, etc.
 */

const STORAGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media`;

// ── Helper ──────────────────────────────────────────────────────────────────
/** Build a full public URL for a file in the media bucket. */
export function mediaUrl(path: string): string {
    return `${STORAGE_BASE}/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
}

// ── Product showcase videos ─────────────────────────────────────────────────
export const productVideos = {
    video1: `${STORAGE_BASE}/products/1.mov`,
    video2: `${STORAGE_BASE}/products/2.mov`,
    video3: `${STORAGE_BASE}/products/3.mov`,
    video4: `${STORAGE_BASE}/products/4.mov`,
    video5: `${STORAGE_BASE}/products/5.mov`,
    video6: `${STORAGE_BASE}/products/6.mov`,
};

// ── Section images ──────────────────────────────────────────────────────────
export const sectionImages = {
    bestFor: `${STORAGE_BASE}/sections/Best%20For.png`,
    heavyLift: `${STORAGE_BASE}/sections/Heavy%20Lift.png`,
    extremeSport: `${STORAGE_BASE}/sections/Extreme%20Sport.png`,
    standOut: `${STORAGE_BASE}/sections/Stand%20Out.png`,
    running: `${STORAGE_BASE}/sections/Running.png`,
    allDayComfort: `${STORAGE_BASE}/sections/All%20Day%20Comfort.png`,
    drCatherineAris: `${STORAGE_BASE}/sections/Dr.%20Catherine%20Aris.png`,
    section2: `${STORAGE_BASE}/sections/before-aerotouch.png`,
    section3: `${STORAGE_BASE}/sections/after-aerotouch.png`,
};

// ── Review avatars (large PNGs) ─────────────────────────────────────────────
export const reviewAvatars = {
    michaelT: `${STORAGE_BASE}/reviews/Michael%20T.png`,
    sarahJ: `${STORAGE_BASE}/reviews/Sarah%20J.png`,
    emmaW: `${STORAGE_BASE}/reviews/Emma%20W.png`,
    marcusT: `${STORAGE_BASE}/reviews/Marcus%20T.png`,
    nicoleP: `${STORAGE_BASE}/reviews/Nicole%20P.png`,
    davidK: `${STORAGE_BASE}/reviews/David%20K.png`,
};

// ── Review photos (JPGs) ───────────────────────────────────────────────────
export const reviewPhotos = {
    michaelT: `${STORAGE_BASE}/reviews/Michael%20T.jpg`,
    sarahJ: `${STORAGE_BASE}/reviews/Sarah%20J.jpg`,
    emmaW: `${STORAGE_BASE}/reviews/Emma%20W.jpg`,
    marcusT: `${STORAGE_BASE}/reviews/Marcus%20T.jpg`,
    nicoleP: `${STORAGE_BASE}/reviews/Nicole%20P.jpg`,
    davidK: `${STORAGE_BASE}/reviews/David%20K.jpg`,
    sarahJenkins: `${STORAGE_BASE}/reviews/Sarah%20Jenkins.jpg`,
    michaelChen: `${STORAGE_BASE}/reviews/Michael%20Chen.jpg`,
    hungNguyen: `${STORAGE_BASE}/reviews/Hung%20Nguyen.jpg`,
    jamesR: `${STORAGE_BASE}/reviews/James%20R.jpg`,
    lisaThompson: `${STORAGE_BASE}/reviews/Lisa%20Thompson.jpg`,
    davidMiller: `${STORAGE_BASE}/reviews/David%20Miller.jpg`,
    fitnessCoach: `${STORAGE_BASE}/reviews/Fitness%20Coach.png`,
    productClose: '/images/IMG_4813-removebg-preview.png',
};

// ── Review videos ───────────────────────────────────────────────────────────
export const reviewVideos = {
    alexMick: `${STORAGE_BASE}/reviews/Alex%20Mick.mov`,
    danielTasker: `${STORAGE_BASE}/reviews/Daniel%20Tasker.mov`,
    lewis: `${STORAGE_BASE}/reviews/Lewis.mov`,
    victorMon: `${STORAGE_BASE}/reviews/Victor%20Mon.mov`,
    henryTu: `${STORAGE_BASE}/reviews/Henry%20Tu.mov`,
    derek: `${STORAGE_BASE}/reviews/Derek.mov`,
    charlieHart: `${STORAGE_BASE}/reviews/Charlie%20Hart.mov`,
};

// ── Testimonials ────────────────────────────────────────────────────────────
export const testimonialImages = {
    cindy: `${STORAGE_BASE}/testimonials/cindy-review.jpg`,
    james: `${STORAGE_BASE}/testimonials/james-review.jpg`,
};

// ── Misc ────────────────────────────────────────────────────────────────────
export const miscImages = {
    foamPad: `${STORAGE_BASE}/misc/foam-pad.png`,
    runner: `${STORAGE_BASE}/misc/58-runner-jogging-outdoors.jpg`,
    aerotouchAlignment: `${STORAGE_BASE}/misc/aerotouch-alignment.png`,
    genericAlignment: `${STORAGE_BASE}/misc/generic-alignment.png`,
    walkPainFree: `${STORAGE_BASE}/misc/Walk_Pain-Free-2-removebg-preview.png`,
};

/**
 * Stock photos for landing-page bundle cards (“What’s included” thumbnails).
 * Footwear / recovery context — pair with object-contain so products stay fully visible.
 */
export const bundleKitItemStockPhotos = {
    insoleSole: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=max',
    insoleWhiteSneaker: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=600&auto=format&fit=max',
    insoleRedPerformance: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=max',
    massageBall: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600&auto=format&fit=max',
    compressionSocks: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=600&auto=format&fit=max',
    heelCushion: 'https://images.unsplash.com/photo-1576678929414-923222381954?q=80&w=600&auto=format&fit=max',
    archSupport: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=600&auto=format&fit=max',
    toeAccessory: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=max',
    fabricSleeve: 'https://images.unsplash.com/photo-1584467735871-988bb58cb466?q=80&w=600&auto=format&fit=max',
    foamRoller: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=max',
} as const;
