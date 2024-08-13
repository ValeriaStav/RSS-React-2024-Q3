import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitestConfig from './vitest.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/RSS-React-2024-Q3/',
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  ...vitestConfig,
});
