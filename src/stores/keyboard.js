import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKeyboardStore = defineStore('keyboardStore', () => {

    const lastPressedKey = ref(null);

    const keypressHandler = (e) => {
        lastPressedKey.value = e.key;
    };
    
    window.addEventListener('keypress', keypressHandler);

    return { lastPressedKey };
});

