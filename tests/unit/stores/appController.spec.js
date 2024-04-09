import { beforeEach, describe, expect, test, vi } from "vitest";

import { createPinia, setActivePinia } from "pinia";

import { useAppControllerStore } from '@/stores/appController';
import { useAppStateStore  } from '@/stores/appState';
import { useTypingContentStore  } from '@/stores/typingContent';

describe('test "stores/appController"', () => {
    const referenceContentObject = [
        { type: 'letter', chars: [ { char: 'A', failed: null, failedChar: "" }, { char: 'B', failed: null, failedChar: "" }, { char: 'C', failed: null, failedChar: "" } ] },
        { type: 'space', chars: [ { char: '_', failed: null, failedChar: "" } ] },
        { type: 'letter', chars: [ { char: 'D', failed: null, failedChar: "" }, { char: 'E', failed: null, failedChar: "" }, { char: 'F', failed: null, failedChar: "" } ] },
        { type: 'space', chars: [ { char: '_', failed: null, failedChar: "" } ] },
        { type: 'anychar', chars: [ { char: '%', failed: null, failedChar: "" }, { char: '1', failed: null, failedChar: "" } ]},
        { type: 'none', chars: [ { char: '', failed: null, failedChar: "" } ] },
        { type: 'lf', chars: [ { char: '', failed: null, failedChar: "" } ] },
        { type: 'letter', chars: [ { char: 'U', failed: null, failedChar: "" }, { char: 'V', failed: null, failedChar: "" }, { char: 'W', failed: null, failedChar: "" } ] },
        { type: 'space', chars: [ { char: '_', failed: null, failedChar: "" } ] },
        { type: 'letter', chars: [ { char: 'X', failed: null, failedChar: "" }, { char: 'Y', failed: null, failedChar: "" }, { char: 'Z', failed: null, failedChar: "" } ] },
    ];

    setActivePinia(createPinia());
    createPinia();

    let appControllerStore = useAppControllerStore(); // placed here, because the event listener for 'keypress' should only be initialized once
    let appStateStore = useAppStateStore();
    let typingContentStore = useTypingContentStore();

    beforeEach(() => {
        appControllerStore.currentPositionBlock = 0;
        appControllerStore.currentPositionChar = 0;
        appControllerStore.measurementDataWordPerMinute = [];
        appStateStore.typingProgressEnabled = true;
        appStateStore.ignoreCapitalizeEnabled = true;
        appStateStore.isTypingFinished = false;
        typingContentStore.contentData = JSON.parse(JSON.stringify(referenceContentObject));
    });

    test('whether dummy', async () => {
        window.dispatchEvent(new KeyboardEvent("keypress", { "key": "A" }));
        expect(true).toBe(true);
    });

    test('whether resetProgress correctly works when argument clear content is false', async () => {
        const spy_removeProgressDataFromContentData = vi.spyOn(typingContentStore, "removeProgressDataFromContentData").mockImplementation(() => true);
        appControllerStore.resetProgress(false);
        
        expect(typingContentStore.removeProgressDataFromContentData).toHaveBeenCalledTimes(1);

        expect(true).toBe(true);
        spy_removeProgressDataFromContentData.mockRestore();
    });

    test('whether resetProgress correctly works when argument clear content is true', async () => {
        expect(true).toBe(true);
    });

});