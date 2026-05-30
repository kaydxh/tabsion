import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        'tab-manager': resolve(__dirname, 'src/pages/tab-manager/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
