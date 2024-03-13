import { createApp } from 'vue';
import { createPinia } from 'pinia';
//import router from './router';

import { Quasar, Notify, Loading, Dialog  } from 'quasar';
import lang from 'quasar/lang/de.js';

import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';

import './styles/main.scss';
import 'quasar/src/css/index.sass';

import App from './App.vue';

const store = createPinia();
const app = createApp(App);

app.use(store);
//app.use(router);
app.use(Quasar, {
    plugins: {
        Notify,
        Loading,
        Dialog
    },
    lang: lang
});

app.mount('#app');