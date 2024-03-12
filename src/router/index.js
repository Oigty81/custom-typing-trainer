import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";

import MainPage from "@/pages/MainPage.vue";

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
            name: "home",
            redirect: "/home",
            component: MainPage,
           
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: "/"
        }
    ]
});

export default router;
