import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: false,
      },
      manifest: {
        id: '/',
        name: 'Love Luxury',
        short_name: 'Love Luxury',
        description: 'The private gallery for rare handbags, watches and jewellery.',
        theme_color: '#f1e9dd',
        background_color: '#f4efe7',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'any',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
