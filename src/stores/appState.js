import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStateStore = defineStore('appStateStore', () => {

    const typingProgressEnabled = ref(true);
    const ignoreCapitalizeEnabled = ref(true);
    const keySoundEnabled = ref(true);
    const isTypingFinished = ref(false);

    return {
        typingProgressEnabled , ignoreCapitalizeEnabled, keySoundEnabled, isTypingFinished
    };
});

