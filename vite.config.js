import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: use './' for relative paths (works on any repo name)
  // Or set to '/your-repo-name/' if you prefer absolute paths
  base: './',
});
