import { describe, test, vi, expect } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import { useUiStore } from '@/stores/ui.js';
import { useAppStateStore } from '@/stores/appState';
import { useAppControllerStore } from '@/stores/appController';
import { useTypingContentStore  } from '@/stores/typingContent';

import ControlPanel from '@components/ControlPanel.vue';

import { useQuasar } from 'quasar';

vi.mock('quasar');

describe("components/ControlPanel.vue", () => {
    useQuasar.mockReturnValue({
        notify: vi.fn().mockImplementation()
    });

    test("whether box height style corresponds uiStore.heightPanel", async () => {
        const pinia = createTestingPinia();
        const uiStore = useUiStore(pinia);

        uiStore.heightPanel = 250;

        const wrapper = shallowMount(ControlPanel, {
            global: {
                plugins: [ pinia ],
              },
        });

        expect(wrapper.findAll('div').at(0).attributes().style).toBe('height: 250px;');
    });

    test("whether button 'Reset Progress' blur active element and calls 'appControllerStore.resetProgress()'", async () => {
        const pinia = createTestingPinia();
        const appControllerStore = useAppControllerStore(pinia);
        
        const wrapper = shallowMount(ControlPanel, {
            global: {
                plugins: [ pinia ],
              },
        });
        const spy__blur = (document.activeElement.blur = vi.fn());
        await wrapper.findAll('q-btn').at(0).trigger('click');
        expect(spy__blur).toHaveBeenCalledTimes(1);
        expect(appControllerStore.resetProgress).toHaveBeenCalledTimes(1);
        expect(appControllerStore.resetProgress).toHaveBeenCalledWith();
        spy__blur.mockRestore();
    });

    test("whether button 'Clear Content' blur active element and calls 'appControllerStore.clearContent()'", async () => {
        const pinia = createTestingPinia();
        const appControllerStore = useAppControllerStore(pinia);
        
        const wrapper = shallowMount(ControlPanel, {
            global: {
                plugins: [ pinia ],
              },
        });

        const spy__blur = (document.activeElement.blur = vi.fn());
        await wrapper.findAll('q-btn').at(1).trigger('click');
        expect(spy__blur).toHaveBeenCalledTimes(1);
        expect(appControllerStore.resetProgress).toHaveBeenCalledTimes(1);
        expect(appControllerStore.resetProgress).toHaveBeenCalledWith(true);
        spy__blur.mockRestore();
    });

    async function loadDemoSuccess(btnNumber, filename) {
        const pinia = createTestingPinia();
        const appStateStore =  useAppStateStore(pinia);
        const appControllerStore = useAppControllerStore(pinia);
        const typingContentStore =  useTypingContentStore(pinia);
        
        typingContentStore.loadDemoContent.mockResolvedValue('some value');
        appStateStore.typingProgressEnabled = false;

        const wrapper = shallowMount(ControlPanel, {
            global: {
                plugins: [ pinia ],
              },
        });

        const spy__blur = (document.activeElement.blur = vi.fn());
        await wrapper.findAll('q-btn').at(btnNumber).trigger('click');
        expect(spy__blur).toHaveBeenCalledTimes(1);
        expect(typingContentStore.loadDemoContent).toHaveBeenCalledTimes(1);
        expect(typingContentStore.loadDemoContent).toHaveBeenCalledWith(filename);
        expect(appControllerStore.resetProgress).toHaveBeenCalledTimes(1);
        expect(appControllerStore.resetProgress).toHaveBeenCalledWith();
        expect(appStateStore.typingProgressEnabled).toBe(true);
        spy__blur.mockRestore();
    };

    async function loadDemoNotSuccess(btnNumber) {
        const pinia = createTestingPinia();
        const appStateStore =  useAppStateStore(pinia);
        const typingContentStore =  useTypingContentStore(pinia);
        
        typingContentStore.loadDemoContent.mockRejectedValue('some value');
        appStateStore.typingProgressEnabled = true;

        const wrapper = shallowMount(ControlPanel, {
            global: {
                plugins: [ pinia ],
              },
        });

        await wrapper.findAll('q-btn').at(btnNumber).trigger('click');
        await new Promise((res) => setTimeout(res, 100));
        expect(useQuasar().notify).toBeCalledTimes(1);
        expect(useQuasar().notify).toHaveBeenCalledWith({
            progress: true,
            message: "no valid text file!",
            color: 'negative',
            position: 'top'
        });
        expect(appStateStore.typingProgressEnabled).toBe(false);

        useQuasar().notify.mockReset();
    }

    test("whether button click action 'load Demo 1' and load demo content is success", () => {
        loadDemoSuccess(2, 'demotext1.txt');
    });

    test("whether button click action 'load Demo 1' and load demo content is not success", () => {
        loadDemoNotSuccess(2);
    });

    test("whether button click action 'load Demo 2' and load demo content is success", () => {
        loadDemoSuccess(3, 'demotext2.txt');
    });

    test("whether button click action 'load Demo 2' and load demo content is not success", () => {
        loadDemoNotSuccess(3);
    });
});