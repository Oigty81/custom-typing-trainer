import { defineConfig, configDefaults  } from "vitest/config";
import Vue from "@vitejs/plugin-vue";
import { ViteAliases } from 'vite-aliases';

export default defineConfig({
    plugins: [
        Vue({
            template: {
                //transformAssetUrls
              compilerOptions: {
                isCustomElement: (tag) => ['q-btn'].includes(tag),
              }
            }
        }),
        ViteAliases({
            dir: 'src',
            prefix: '@',
        }),
    ],
    test: {
        globals: true,
        environment: "happy-dom",
        ////include: ['./test/**/*.spec.ts'],
        exclude:[
            ...configDefaults.exclude,
            'dist',
            //'tests/unit/components/ControlPanel.spec.js',
            //'tests/unit/components/StatePanel.spec.js',
            //'tests/unit/components/TypingProgressField.spec.js',
            //'tests/unit/pages/TrainingPage.spec.js',
            //'tests/unit/stores/appController.spec.js',
            //'tests/unit/stores/typingContent.spec.js',
            //'tests/unit/utilities/content.spec.js',
            //'tests/unit/utilities/fileHelper.spec.js'
        ]
    },
    root: ".",
});
