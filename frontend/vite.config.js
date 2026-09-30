import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev proxy forwards /api/* to the Express backend so the browser stays
// same-origin during development (no CORS). In production the frontend is
// typically served from the same host or a configured API base URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://quizlab-api-am-cvg9bndpf2f0cxhj.centralindia-01.azurewebsites.net',
        changeOrigin: true,
      },
    },
  },
})
