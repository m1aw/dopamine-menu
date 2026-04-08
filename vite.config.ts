import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let plugins = [react()];
try {
  const { cloudflare } = require("@cloudflare/vite-plugin");
  plugins.push(cloudflare());
} catch {
  // Cloudflare plugin not installed, skipping
}

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
