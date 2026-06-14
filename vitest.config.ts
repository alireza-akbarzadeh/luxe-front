import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup/vitest.setup.tsx'],
    include: ['__tests__/components/**/*.test.{ts,tsx}', '__tests__/spec/**/*.spec.ts'],
    exclude: ['node_modules', '__tests__/e2e/**']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, '.')
    }
  }
});
