import { defineStore, storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';

import { useKeyboardStore  } from '@/stores/keyboard';

export const useAppControllerStore = defineStore('appControllerStore', () => {

    const keyboardStore = storeToRefs(useKeyboardStore());

    watch(keyboardStore.lastPressedKey, () => {
        console.log('runs', keyboardStore.lastPressedKey.value);
        
    }, {immediate: true, deep: false});

    return {};
});
