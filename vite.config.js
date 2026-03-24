import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';
import path from 'path';

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
        sassVariables: fileURLToPath(
          new URL('./src/styles/quasar/quasar.variables.scss', import.meta.url)
        )
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });

};


