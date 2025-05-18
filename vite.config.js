import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are served from root
  server: {
    port: 5173,
    host: 'localhost',
    open: true,
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/projects': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/messages': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/providers': {
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
    hmr: {
      clientPort: 5173,
      host: 'localhost',
      onError: (error) => console.error('HMR Error:', error),
    },
  },
});