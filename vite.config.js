import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/search-hotels': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/search-flights': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/search-locations': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});