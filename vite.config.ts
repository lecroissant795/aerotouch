import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { sendPopupEmail } from './api/send-popup-email.shared.js';
import { createWelcomeDiscount } from './api/create-discount-code.shared.js';
import { readShopifyConfig } from './api/shopify-admin.shared.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const readDotEnvValue = (name: string) => {
    try {
      const content = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx <= 0) continue;
        const rawKey = trimmed.slice(0, idx).trim();
        const key = rawKey.startsWith('export ') ? rawKey.slice(7).trim() : rawKey;
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key === name && value) return value;
      }
      return '';
    } catch {
      return '';
    }
  };
  const getConfigEnv = (name: string) => {
    const fromLoaded = env[name];
    if (typeof fromLoaded === 'string' && fromLoaded.trim()) return fromLoaded.trim();
    const fromProcess = process.env[name];
    if (typeof fromProcess === 'string' && fromProcess.trim()) return fromProcess.trim();
    const fromDotEnv = readDotEnvValue(name);
    if (fromDotEnv) return fromDotEnv;
    return '';
  };
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'dev-popup-email-api',
        configureServer(server) {
          server.middlewares.use('/api/send-popup-email', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed.' }));
              return;
            }

            try {
              const body = await new Promise<string>((resolve, reject) => {
                let raw = '';
                req.on('data', (chunk) => {
                  raw += chunk;
                });
                req.on('end', () => resolve(raw));
                req.on('error', reject);
              });

              const parsed = body ? JSON.parse(body) : {};
              const firstName = parsed.firstName;
              const email = parsed.email;

              if (!firstName || !email) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'firstName and email are required.' }));
                return;
              }

              const resendApiKey =
                getConfigEnv('RESEND_API_KEY') || getConfigEnv('VITE_RESEND_API_KEY');
              const fromEmail =
                getConfigEnv('RESEND_FROM_EMAIL') ||
                getConfigEnv('VITE_RESEND_FROM_EMAIL') ||
                'AeroTouch <onboarding@resend.dev>';

              const shopifyConfig = readShopifyConfig(getConfigEnv);

              const discountResult = await createWelcomeDiscount({ firstName, shopifyConfig });
              if (!discountResult.ok) {
                res.statusCode = discountResult.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: discountResult.error }));
                return;
              }

              const result = await sendPopupEmail({
                firstName,
                email,
                discountCode: discountResult.code,
                resendApiKey,
                fromEmail,
              });

              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              if (!result.ok) {
                res.end(JSON.stringify({ error: result.error }));
                return;
              }
              res.end(JSON.stringify({ ok: true, id: result.id || null, code: discountResult.code }));
            } catch (error) {
              console.error('dev-popup-email-api error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Could not process email request.' }));
            }
          });
        },
      },
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    }
  };
});
