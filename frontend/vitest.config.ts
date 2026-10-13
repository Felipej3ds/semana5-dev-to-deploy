import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    env: { NEXT_PUBLIC_DATA_SOURCE: 'firestore' },
  },
});