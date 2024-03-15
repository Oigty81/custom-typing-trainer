import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStateStore = defineStore('appStateStore', () => {

    const ignoreCapitalize = ref(false);

    return {
        ignoreCapitalize
    };
});

