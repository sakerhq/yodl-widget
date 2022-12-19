import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  define: {
    'process.env': {}
  },
  build: {
    lib: {
      name: 'yodlwidget',
      entry: resolve(__dirname, 'src/main.js'),
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        globals: {
          vue: 'Vue'
        },
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  },
  plugins: [
    vue(),
    visualizer({
      open: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
