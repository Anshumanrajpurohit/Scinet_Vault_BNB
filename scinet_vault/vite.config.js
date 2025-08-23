import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Polyfill Node.js core modules/APIs (e.g., Buffer) for the browser
    nodePolyfills({
      // include polyfills during dev and build
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
})
