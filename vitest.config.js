import { defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Mark Quasar components as custom elements so Vue compiler
          // doesn't complain inside tests
          isCustomElement: (tag) => ['q-btn'].includes(tag),
        },
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    globals: true,
    environment: 'happy-dom',

    // ✅ Modern pattern required for Vitest v4
    include: [
      'tests/**/*.spec.{js,ts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,ts}'
    ],

    // ✅ exclude must be relative and picomatch-compatible
    exclude: [
      ...configDefaults.exclude,
      'dist/**',
      'node_modules/**',
      '.vite/**',
      'tests/e2e/**',      // example
      // your custom excludes:
      /*
      'tests/unit/components/ControlPanel.spec.js',
      'tests/unit/components/StatePanel.spec.js',
      'tests/unit/components/TypingProgressField.spec.js',
      'tests/unit/pages/TrainingPage.spec.js',
      'tests/unit/stores/appController.spec.js',
      'tests/unit/stores/typingContent.spec.js',
      'tests/unit/utilities/content.spec.js',
      'tests/unit/utilities/fileHelper.spec.js',
      */
    ],

    // ✅ Vitest v4 is strict about root; recommended to set explicitly
    root: '.',
  },
});