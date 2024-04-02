import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUiStore = defineStore('uiStore', () => {

    const heightViewport = ref(0);
    const heightHeader = ref(56);
    const heightPanel = ref(180);

    const heightTypingField = computed(() => {
        return heightViewport.value - heightHeader.value - heightPanel.value - 40;
    });

    return {
        heightViewport, heightHeader, heightPanel, heightTypingField
    };
});
