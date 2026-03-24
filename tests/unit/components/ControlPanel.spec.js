import { describe, test, vi, expect, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import { useUiStore } from '@/stores/ui.js';
import { useAppStateStore } from '@/stores/appState';
import { useAppControllerStore } from '@/stores/appController';
import { useTypingContentStore } from '@/stores/typingContent';

import ControlPanel from '@/components/ControlPanel.vue';
import { useQuasar } from 'quasar';

// -------------------------------------------------------------
// Quasar mock
// -------------------------------------------------------------
vi.mock('quasar', () => ({
  useQuasar: vi.fn()
}));

// -------------------------------------------------------------
// Helper: safely mock document.activeElement.blur()
// -------------------------------------------------------------
function mockActiveElementBlur() {
  const spy = vi.fn();
  Object.defineProperty(document, 'activeElement', {
    configurable: true,
    value: { blur: spy }
  });
  return spy;
}

// -------------------------------------------------------------
// Helper: find g-custom-button instances rendered as <button>
// -------------------------------------------------------------
function getBtn(wrapper, index) {
  const btns = wrapper.findAll('button.g-custom-button');
  return btns[index];
}

// -------------------------------------------------------------
describe('components/ControlPanel.vue', () => {

  beforeEach(() => {
    useQuasar.mockReturnValue({
      notify: vi.fn()
    });
  });

  // -------------------------------------------------------------
  test('height style matches uiStore.heightPanel', async () => {
    const pinia = createTestingPinia();
    const uiStore = useUiStore(pinia);

    uiStore.heightPanel = 250;

    const wrapper = shallowMount(ControlPanel, {
      global: {
        plugins: [pinia],
        stubs: {
          'g-custom-button': {
            template: '<button class="g-custom-button"><slot /></button>'
          }
        }
      }
    });

    expect(wrapper.find('div').attributes().style).toBe('height: 250px;');
  });

  // -------------------------------------------------------------
  test('\'Reset Progress\' button triggers resetProgress()', async () => {
    const pinia = createTestingPinia();
    const appControllerStore = useAppControllerStore(pinia);

    const wrapper = shallowMount(ControlPanel, {
      global: {
        plugins: [pinia],
        stubs: {
          'g-custom-button': {
            template: '<button class="g-custom-button"><slot /></button>'
          }
        }
      }
    });

    const blurSpy = mockActiveElementBlur();

    await getBtn(wrapper, 0).trigger('click'); // Reset Progress

    expect(blurSpy).toHaveBeenCalledTimes(1);
    expect(appControllerStore.resetProgress).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------
  test('\'Clear Content\' button triggers resetProgress(true)', async () => {
    const pinia = createTestingPinia();
    const appControllerStore = useAppControllerStore(pinia);

    const wrapper = shallowMount(ControlPanel, {
      global: {
        plugins: [pinia],
        stubs: {
          'g-custom-button': {
            template: '<button class="g-custom-button"><slot /></button>'
          }
        }
      }
    });

    const blurSpy = mockActiveElementBlur();

    await getBtn(wrapper, 1).trigger('click');

    expect(blurSpy).toHaveBeenCalledTimes(1);
    expect(appControllerStore.resetProgress).toHaveBeenCalledWith(true);
  });

  // -------------------------------------------------------------
  // Shared test helpers for Load Demo buttons
  // -------------------------------------------------------------
  async function loadDemoSuccess(btnIndex, filename) {
    const pinia = createTestingPinia({ stubActions: false });

    const appStateStore = useAppStateStore(pinia);
    const appControllerStore = useAppControllerStore(pinia);
    const typingContentStore = useTypingContentStore(pinia);

    typingContentStore.loadDemoContent.mockResolvedValue('OK');
    appStateStore.typingProgressEnabled = false;

    const wrapper = shallowMount(ControlPanel, {
      global: {
        plugins: [pinia],
        stubs: {
          'g-custom-button': {
            template: '<button class="g-custom-button"><slot /></button>'
          }
        }
      }
    });

    const blurSpy = mockActiveElementBlur();

    await getBtn(wrapper, btnIndex).trigger('click');
    await Promise.resolve();

    expect(blurSpy).toHaveBeenCalledTimes(1);
    expect(typingContentStore.loadDemoContent).toHaveBeenCalledWith(filename);
    expect(appControllerStore.resetProgress).toHaveBeenCalledTimes(1);
    expect(appStateStore.typingProgressEnabled).toBe(true);
  }

  async function loadDemoFailure(btnIndex) {
    const pinia = createTestingPinia({ stubActions: false });

    const appStateStore = useAppStateStore(pinia);
    const typingContentStore = useTypingContentStore(pinia);

    typingContentStore.loadDemoContent.mockRejectedValue('NOPE');
    appStateStore.typingProgressEnabled = true;

    const wrapper = shallowMount(ControlPanel, {
      global: {
        plugins: [pinia],
        stubs: {
          'g-custom-button': {
            template: '<button class="g-custom-button"><slot /></button>'
          }
        }
      }
    });

    await getBtn(wrapper, btnIndex).trigger('click');
    await Promise.resolve();

    const q = useQuasar();
    expect(q.notify).toHaveBeenCalledWith({
      progress: true,
      message: 'no valid text file!',
      color: 'negative',
      position: 'top'
    });

    expect(appStateStore.typingProgressEnabled).toBe(false);
  }

  // -------------------------------------------------------------
  // Load Demo tests (button order: 0 reset, 1 clear, 2 demo1, 3 demo2)
  // -------------------------------------------------------------
  test('\'Load Demo 1\' success', async () => {
    await loadDemoSuccess(2, 'demotext1.txt');
  });

  test('\'Load Demo 1\' failure', async () => {
    await loadDemoFailure(2);
  });

  test('\'Load Demo 2\' success', async () => {
    await loadDemoSuccess(3, 'demotext2.txt');
  });

  test('\'Load Demo 2\' failure', async () => {
    await loadDemoFailure(3);
  });

});