#!/usr/bin/env node
/**
 * Upload all AeroTouch media files to Supabase Storage.
 *
 * Prerequisites:
 *   1. Create a PUBLIC bucket named "media" in Supabase Dashboard → Storage
 *   2. Set SUPABASE_SERVICE_ROLE_KEY in your .env or pass it as an env var
 *
 * Usage:
 *   node scripts/upload-media.mjs
 *   # or with explicit key:
 *   SUPABASE_SERVICE_ROLE_KEY=ey... node scripts/upload-media.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ── Load .env file ──────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config({ path: path.join(ROOT, '.env') });

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mhecgxhcmohbmeimrfud.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'media';

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY is required.\n');
  console.error('   Set it in your environment or .env file:');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=ey... node scripts/upload-media.mjs\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── File manifest ───────────────────────────────────────────────────────────
// Maps: local path (relative to project root) → remote path in bucket
const UPLOADS = [
  // ── Product showcase videos ─────────────────────────────────────────────
  { local: 'public/media/1.mov', remote: 'products/1.mov' },
  { local: 'public/media/2.mov', remote: 'products/2.mov' },
  { local: 'public/media/3.mov', remote: 'products/3.mov' },
  { local: 'resources/media/4.mov', remote: 'products/4.mov' },
  { local: 'public/media/5.mov', remote: 'products/5.mov' },
  { local: 'resources/media/6.mov', remote: 'products/6.mov' },

  // ── Section images (from resources/) ────────────────────────────────────
  { local: 'resources/Best For.png', remote: 'sections/Best For.png' },
  { local: 'resources/Heavy Lift.png', remote: 'sections/Heavy Lift.png' },
  { local: 'resources/Extreme Sport.png', remote: 'sections/Extreme Sport.png' },
  { local: 'resources/Stand Out.png', remote: 'sections/Stand Out.png' },
  { local: 'resources/Running.png', remote: 'sections/Running.png' },
  { local: 'resources/All Day Comfort.png', remote: 'sections/All Day Comfort.png' },
  { local: 'resources/Dr. Catherine Aris.png', remote: 'sections/Dr. Catherine Aris.png' },
  { local: 'resources/2.png', remote: 'sections/2.png' },
  { local: 'resources/3.png', remote: 'sections/3.png' },
  { local: 'resources/foam-pad.png', remote: 'misc/foam-pad.png' },
  { local: 'resources/58-runner-jogging-outdoors.jpg', remote: 'misc/58-runner-jogging-outdoors.jpg' },

  // ── Customer review avatar PNGs (large, from resources/) ────────────────
  { local: 'resources/Michael T.png', remote: 'reviews/Michael T.png' },
  { local: 'resources/Sarah J.png', remote: 'reviews/Sarah J.png' },
  { local: 'resources/Emma W.png', remote: 'reviews/Emma W.png' },
  { local: 'resources/Marcus T.png', remote: 'reviews/Marcus T.png' },
  { local: 'resources/Nicole P.png', remote: 'reviews/Nicole P.png' },
  { local: 'resources/David K.png', remote: 'reviews/David K.png' },

  // ── Customer review photos (from resources/media/) ──────────────────────
  { local: 'resources/media/Michael T.jpg', remote: 'reviews/Michael T.jpg' },
  { local: 'resources/media/Sarah J.jpg', remote: 'reviews/Sarah J.jpg' },
  { local: 'resources/media/Emma W.jpg', remote: 'reviews/Emma W.jpg' },
  { local: 'resources/media/Marcus T.jpg', remote: 'reviews/Marcus T.jpg' },
  { local: 'resources/media/Nicole P.jpg', remote: 'reviews/Nicole P.jpg' },
  { local: 'resources/media/David K.jpg', remote: 'reviews/David K.jpg' },
  { local: 'resources/media/Sarah Jenkins.jpg', remote: 'reviews/Sarah Jenkins.jpg' },
  { local: 'resources/media/Michael Chen.jpg', remote: 'reviews/Michael Chen.jpg' },
  { local: 'resources/media/Hung Nguyen.jpg', remote: 'reviews/Hung Nguyen.jpg' },
  { local: 'resources/media/James R.jpg', remote: 'reviews/James R.jpg' },
  { local: 'resources/media/Lisa Thompson.jpg', remote: 'reviews/Lisa Thompson.jpg' },
  { local: 'resources/media/David Miller.jpg', remote: 'reviews/David Miller.jpg' },
  { local: 'resources/media/Fitness Coach.png', remote: 'reviews/Fitness Coach.png' },
  { local: 'resources/media/IMG_4813 copy.JPG', remote: 'reviews/IMG_4813 copy.JPG' },

  // ── Customer review videos (from resources/media/) ──────────────────────
  { local: 'resources/media/Alex Mick.mov', remote: 'reviews/Alex Mick.mov' },
  { local: 'resources/media/Daniel Tasker.mov', remote: 'reviews/Daniel Tasker.mov' },
  { local: 'resources/media/Lewis.mov', remote: 'reviews/Lewis.mov' },
  { local: 'resources/media/Victor Mon.mov', remote: 'reviews/Victor Mon.mov' },
  { local: 'resources/media/Henry Tu.mov', remote: 'reviews/Henry Tu.mov' },
  { local: 'resources/media/Derek.mov', remote: 'reviews/Derek.mov' },
  { local: 'resources/media/Charlie Hart.mov', remote: 'reviews/Charlie Hart.mov' },

  // ── Testimonials (from assets/) ─────────────────────────────────────────
  { local: 'assets/cindy-review.jpg', remote: 'testimonials/cindy-review.jpg' },
  { local: 'assets/james-review.jpg', remote: 'testimonials/james-review.jpg' },
  { local: 'assets/aerotouch-alignment.png', remote: 'misc/aerotouch-alignment.png' },
  { local: 'assets/generic-alignment.png', remote: 'misc/generic-alignment.png' },

  // ── Other (public/resources/) ───────────────────────────────────────────
  { local: 'public/resources/media/Walk_Pain-Free-2-removebg-preview.png', remote: 'misc/Walk_Pain-Free-2-removebg-preview.png' },

  // ── TikTok / other video ────────────────────────────────────────────────
  { local: 'resources/media/v24044gl0000d085ipnog65vcss8ohf0.MP4', remote: 'reviews/v24044gl0000d085ipnog65vcss8ohf0.MP4' },
];

// ── MIME type lookup ────────────────────────────────────────────────────────
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
  };
  return types[ext] || 'application/octet-stream';
}

// ── Upload logic ────────────────────────────────────────────────────────────
async function uploadFile({ local, remote }) {
  const localPath = path.join(ROOT, local);

  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️  SKIP (not found): ${local}`);
    return { status: 'skipped', local, remote };
  }

  const fileBuffer = fs.readFileSync(localPath);
  const contentType = getMimeType(localPath);
  const sizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(1);

  console.log(`⬆️  Uploading ${local} (${sizeMB} MB) → ${BUCKET}/${remote}`);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(remote, fileBuffer, {
      contentType,
      cacheControl: '31536000', // 1 year cache
      upsert: true, // overwrite if already exists
    });

  if (error) {
    console.error(`❌  FAILED: ${local} → ${error.message}`);
    return { status: 'failed', local, remote, error: error.message };
  }

  console.log(`✅  ${remote}`);
  return { status: 'success', local, remote };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Uploading ${UPLOADS.length} files to Supabase Storage bucket "${BUCKET}"\n`);
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
  console.log(`   Bucket: ${BUCKET}\n`);
  console.log('─'.repeat(70) + '\n');

  const results = { success: 0, failed: 0, skipped: 0 };

  // Upload sequentially to avoid rate limits with large files
  for (const entry of UPLOADS) {
    const result = await uploadFile(entry);
    results[result.status]++;
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`\n📊 Results: ${results.success} uploaded, ${results.failed} failed, ${results.skipped} skipped\n`);

  if (results.failed > 0) {
    console.log('⚠️  Some uploads failed. Re-run the script to retry (upsert mode).\n');
    process.exit(1);
  }

  console.log('🎉 All files uploaded successfully!\n');
  console.log(`📌 Public URL pattern:`);
  console.log(`   ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/<remote-path>\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
