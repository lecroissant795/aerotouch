import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handlePopupDiscountRequest } from './api/send-popup-email.handler.shared.js';
import { handleReturnRequest } from './api/return-request.shared.js';

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

              let parsed: Record<string, unknown> = {};
              try {
                parsed = body.trim() ? JSON.parse(body) : {};
              } catch {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
                return;
              }
              const result = await handlePopupDiscountRequest(parsed, getConfigEnv);

              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.body));
            } catch (error) {
              console.error('dev-popup-email-api error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Could not process email request.' }));
            }
          });
          server.middlewares.use('/api/return-request', async (req, res) => {
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

              let parsed: Record<string, unknown> = {};
              try {
                parsed = body.trim() ? JSON.parse(body) : {};
              } catch {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
                return;
              }

              const result = await handleReturnRequest(parsed, getConfigEnv);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.body));
            } catch (error) {
              console.error('dev-return-request-api error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Could not process return request.' }));
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
