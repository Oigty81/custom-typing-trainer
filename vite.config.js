import { defineConfig, loadEnv } from 'vite';

import eslintPlugin from "vite-plugin-eslint";

import vue from '@vitejs/plugin-vue';

import { ViteAliases } from 'vite-aliases';

import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    base: '' + process.env.VITE_LOCAL_WEBAPP_BASE,
    build: {
      emptyOutDir: false,
    },
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: 'src/styles/quasar/quasar.variables.scss'
      }),
      eslintPlugin(),
      ViteAliases({
        dir: 'src',
        prefix: '@',
      }),
    ],
  });

};


