// ESLint Flat Config for Vue 3 + Vite + Pinia + Stylistic
// -------------------------------------------------------
// ✔ Works with ESLint 9+ AND 10+
// ✔ No Babel required
// ✔ vue-eslint-parser handles .vue template + script
// ✔ Fully supports Composition API and Pinia stores

import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';
import pinia from 'eslint-plugin-pinia';

export default [

  // -------------------------------------------------------
  // 1. Pinia recommended rules
  // -------------------------------------------------------
  pinia.configs['recommended-flat'],

  // -------------------------------------------------------
  // 2. Main ESLint config
  // -------------------------------------------------------
  {
    files: ['**/*.vue', '**/*.js', '**/*.mjs', '**/*.ts'],

    // ✅ vue-eslint-parser handles .vue AND JS inside them
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },

    plugins: {
      vue,
      '@stylistic': stylistic
    },

    rules: {
      // ✅ Vue FlatConfig preset
      ...vue.configs['flat/strongly-recommended'].rules,

      // ✅ JavaScript basics
      'no-unused-vars': 'warn',
      'vue/no-unused-vars': 'warn',

      // ✅ Formatting (Prettier replacement)
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: true }],

      // ✅ Vue template formatting
      'vue/html-indent': ['error', 2],
      'vue/singleline-html-element-content-newline': ['error', {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true
      }],
      'vue/multiline-html-element-content-newline': ['error'],
      'vue/html-self-closing': ['error', {
        html: { void: 'never', normal: 'always', component: 'always' }
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always'
      }],

      // Vue 3 rule change
      'vue/no-multiple-template-root': 'off',

      // ✅ Correct Pinia rules
      'pinia/require-setup-store-properties-export': 'error',
      'pinia/no-store-to-refs-in-store': 'error',
      'pinia/no-duplicate-store-ids': 'error',
      'pinia/no-return-global-properties': 'error'
    }
  }
];