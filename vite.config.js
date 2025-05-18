import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/provider': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/messages': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/projects': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/bids': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});