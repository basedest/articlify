import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/shared/test/setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['node_modules', '.next', '**/node_modules/**'],
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
});
