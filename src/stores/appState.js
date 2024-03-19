import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStateStore = defineStore('appStateStore', () => {

    const typingProgressEnabled = ref(true);
    const ignoreCapitalizeEnabled = ref(true);
    const keySoundEnabled = ref(true);

    return {
        typingProgressEnabled , ignoreCapitalizeEnabled, keySoundEnabled
    };
});

