import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
const apiTarget = `http://127.0.0.1:${process.env.QR8_API_PORT || 3001}`;

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', proxy: { '/api': apiTarget } },
  preview: { host: '127.0.0.1', proxy: { '/api': apiTarget } },
  // For GitHub Pages: use './' for relative paths (works on any repo name)
  // Or set to '/your-repo-name/' if you prefer absolute paths
  base: './',
});
