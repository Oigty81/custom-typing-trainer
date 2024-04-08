import { describe, test, vi, expect } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import TrainingPage from '@pages/TrainingPage.vue';
import { useAppControllerStore  } from '@/stores/appController';
import { useAppStateStore  } from '@/stores/appState';

import { useQuasar } from 'quasar';
vi.mock('quasar');

describe("pages/TrainingPage.vue", () => {
  let dialogCallArguments = null;

  useQuasar.mockReturnValue({
        dialog: vi.fn().mockImplementation(
            arg => {
                dialogCallArguments = arg;
                return {
                onDismiss: vi.fn()
            };
        })
    });

    test("whether finish dialog will opened with correctly values", async () => {
        const pinia = createTestingPinia();
        const appControllerStore = useAppControllerStore(pinia);
        const appStateStore = useAppStateStore(pinia);
        
        appControllerStore.wordsPerMinute = 92.333;
        appControllerStore.accuracyInPercent = 24.322424;
        appStateStore.isTypingFinished = false;
        
        shallowMount(TrainingPage, {
            global: {
                plugins: [ pinia ],
              },
        });

        expect(useQuasar().dialog).toBeCalledTimes(0);
        expect(dialogCallArguments).toBeNull();

        appStateStore.isTypingFinished = true;
        await new Promise((res) => setTimeout(res, 100));

        expect(useQuasar().dialog).toBeCalledTimes(1);
        expect(dialogCallArguments).not.toBeNull();
        expect(dialogCallArguments.message).not.toBeUndefined();
        expect(dialogCallArguments.message).toContain('<span class="text-red"> 24% </span>');
        expect(dialogCallArguments.message).toContain('at a speed of: 92');
        
        useQuasar().dialog.mockReset();
    });
});