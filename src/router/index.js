import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";

import MainView from '@/layouts/MainView.vue';
import TrainingPage from "@/pages/TrainingPage.vue";

let historyMode = undefined;

if(import.meta.env.VITE_LOCAL_HISTORY_MODE === 'true') {
  historyMode = createWebHistory();
} else {
  historyMode = createWebHashHistory();
}

const router = createRouter({
    history: historyMode,
    routes: [
        {
            path: "/",
            name: "root",
            component: MainView,
            children: [
              {
                  path: "",
                  redirect: "/home/",
              },
              {
                  path: "home",
                  name: "Training",
                  component: TrainingPage
              },
          ],
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: "/"
        }
    ]
});

export default router;
