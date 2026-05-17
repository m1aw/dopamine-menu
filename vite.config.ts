import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const optionalPlugins: ReturnType<typeof react>[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cloudflare } = require("@cloudflare/vite-plugin");
  optionalPlugins.push(cloudflare());
} catch {
  // Cloudflare plugin not installed, skipping
}
const plugins = [react(), ...optionalPlugins];

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
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
