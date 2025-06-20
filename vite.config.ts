import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production'
        ? '/miniMate/'
        : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            try {
              execSync('touch dist/.nojekyll');
            } catch (e) {
              console.error('Failed to create .nojekyll:', e);
            }
          }
          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});