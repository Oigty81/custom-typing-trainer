import { describe, test, expect } from 'vitest';

import { shallowMount, } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import StatePanel from "@/components/StatePanel.vue";
import { useAppControllerStore  } from '@/stores/appController';

describe("components/StatePanel.vue", () => {
    test("whether displayed 'accuracy' and 'speed of typing' correctly formatted", async () => {
        const pinia = createTestingPinia();
        const appControllerStore = useAppControllerStore(pinia);
        appControllerStore.wordsPerMinute = 68.333;
        appControllerStore.accuracyInPercent = 12.322424;
        
        const wrapper = shallowMount(StatePanel, {
            global: {
                plugins: [ pinia ],
              },
        });

        expect(wrapper.findAll(".text-h5").at(0).text()).toBe("speed of typing: 68");
        expect(wrapper.findAll(".text-h5").at(1).text()).toBe("accuracy: 12.32 %");
    });
});