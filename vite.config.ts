import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3002',
            changeOrigin: true,
          },
        }
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
            name: 'Ryplify Administrace',
            short_name: 'RyplifyAdmin',
            description: 'Administrační panel pro Ryplify',
            theme_color: '#0a0f1f',
            background_color: '#0a0f1f',
            display: 'standalone',
            scope: '/admin/',
            start_url: '/admin/',
            icons: [
              {
                src: 'icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,ts}'],
            runtimeCaching: [
              {
                urlPattern: ({ url }) => url.pathname.startsWith('/admin') || url.pathname.startsWith('/projekt'),
                handler: 'NetworkFirst' as const,
                options: {
                  cacheName: 'admin-projekt-cache',
                  networkTimeoutSeconds: 10,
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 1 // 1 day
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ],
            navigateFallbackDenylist: [/^\/admin/, /^\/projekt/],
          },
          devOptions: {
            enabled: true,
          },
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
