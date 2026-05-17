import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

let cloudflarePlugin;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cloudflare } = require("@cloudflare/vite-plugin");
  cloudflarePlugin = cloudflare();
} catch {
  // Cloudflare plugin not installed, skipping
}

const plugins = [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    scope: '/habits',
    base: '/habits',
    manifest: {
      name: 'Habit Tracker',
      short_name: 'Habits',
      description: 'Track your habits and dopamine menu',
      start_url: '/habits',
      scope: '/habits',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
    },
  }),
  ...(cloudflarePlugin ? [cloudflarePlugin] : []),
];

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        habits: path.resolve(__dirname, 'habits.html'),
      },
    },
  },
})
