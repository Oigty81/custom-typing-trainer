import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createPinia, setActivePinia } from 'pinia';

import typingSimulator from '../_helper/typing-simulator';
import { AudioMock } from '../_helper/audio-mock';

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
    
    let appControllerStore = useAppControllerStore(); // placed here (global), because the event listener for 'keypress' should only be initialized once
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

    test('whether progressTypingCheck fill correctly progress data when ignore capitalize is enabled', async () => {
        appStateStore.ignoreCapitalizeEnabled = true;
        await typingSimulator("Abc dxF %1");
        expect(typingContentStore.contentData[0].chars[0].failed).toBe(false);
        expect(typingContentStore.contentData[0].chars[0].failedChar).toBe('');
        expect(typingContentStore.contentData[0].chars[1].failed).toBe(false);
        expect(typingContentStore.contentData[0].chars[1].failedChar).toBe('');
        expect(typingContentStore.contentData[0].chars[2].failed).toBe(false);
        expect(typingContentStore.contentData[0].chars[2].failedChar).toBe('');
        expect(typingContentStore.contentData[1].chars[0].failed).toBe(false);
        expect(typingContentStore.contentData[1].chars[0].failedChar).toBe('');
        expect(typingContentStore.contentData[2].chars[0].failed).toBe(false);
        expect(typingContentStore.contentData[2].chars[0].failedChar).toBe('');
        expect(typingContentStore.contentData[2].chars[1].failed).toBe(true);
        expect(typingContentStore.contentData[2].chars[1].failedChar).toBe('x');
        expect(typingContentStore.contentData[2].chars[2].failed).toBe(false);
        expect(typingContentStore.contentData[2].chars[2].failedChar).toBe('');
    });

    test('whether progressTypingCheck fill correctly progress data when ignore capitalize is disabled', async () => {
        appStateStore.ignoreCapitalizeEnabled = false;
        await typingSimulator("Abc dxF %1");
        expect(typingContentStore.contentData[0].chars[0].failed).toBe(false);
        expect(typingContentStore.contentData[0].chars[0].failedChar).toBe('');
        expect(typingContentStore.contentData[0].chars[1].failed).toBe(true);
        expect(typingContentStore.contentData[0].chars[1].failedChar).toBe('b');
        expect(typingContentStore.contentData[0].chars[2].failed).toBe(true);
        expect(typingContentStore.contentData[0].chars[2].failedChar).toBe('c');
        expect(typingContentStore.contentData[1].chars[0].failed).toBe(false);
        expect(typingContentStore.contentData[1].chars[0].failedChar).toBe('');
        expect(typingContentStore.contentData[2].chars[0].failed).toBe(true);
        expect(typingContentStore.contentData[2].chars[0].failedChar).toBe('d');
        expect(typingContentStore.contentData[2].chars[1].failed).toBe(true);
        expect(typingContentStore.contentData[2].chars[1].failedChar).toBe('x');
        expect(typingContentStore.contentData[2].chars[2].failed).toBe(false);
        expect(typingContentStore.contentData[2].chars[2].failedChar).toBe('');
    });

    test('whether progressTypingCheck correctly set isTypingFinished when typingFinished', async () => {
        await typingSimulator("Abc dxF %1UVW X");
        expect(appStateStore.isTypingFinished).toBe(false);
        await typingSimulator("YZ");
        expect(appStateStore.isTypingFinished).toBe(true);
        expect(true).toBe(true);
    });

    test('whether progressTypingCheck plays current key sound audio when enabled', async () => {
        appStateStore.keySoundEnabled = true;
        const audio = new AudioMock();
        const spy_Audio = vi.spyOn(global, "Audio").mockImplementation(() => audio);
        const spy_AudioPlay = vi.spyOn(audio, "play");

        await typingSimulator("ABD");
        expect(spy_Audio).toHaveBeenCalledTimes(3);
        expect(spy_Audio).toHaveBeenNthCalledWith(1, './good.mp3');
        expect(spy_Audio).toHaveBeenNthCalledWith(2, './good.mp3');
        expect(spy_Audio).toHaveBeenNthCalledWith(3, './bad.mp3');
        
        await typingSimulator(" e");

        appStateStore.keySoundEnabled = false;

        await typingSimulator("EF ");

        appStateStore.keySoundEnabled = true;

        await typingSimulator("%");

        expect(spy_Audio).toHaveBeenCalledTimes(6);
        expect(spy_Audio).toHaveBeenNthCalledWith(4, './good.mp3');
        expect(spy_Audio).toHaveBeenNthCalledWith(5, './bad.mp3');
        expect(spy_Audio).toHaveBeenNthCalledWith(6, './good.mp3');

        expect(spy_AudioPlay).toHaveBeenCalledTimes(6);

        spy_AudioPlay.mockRestore();
        spy_Audio.mockRestore();
    });

    test('whether computed property "accuracyInPercent" returns correctly value', async () => {
        await typingSimulator("ABC XXX %21");
        expect(appControllerStore.accuracyInPercent).toBeGreaterThan(53);
        expect(appControllerStore.accuracyInPercent).toBeLessThan(55);
        await typingSimulator("VW XY");
        expect(appControllerStore.accuracyInPercent).toBeGreaterThan(67);
        expect(appControllerStore.accuracyInPercent).toBeLessThan(69);
    });

    test('whether computed property "wordsPerMinute" returns correctly value', async () => {
        await typingSimulator("AB", 100);
        expect(appControllerStore.wordsPerMinute).toBe(0);
        await typingSimulator("C ", 50);
        expect(appControllerStore.wordsPerMinute).toBeGreaterThan(220);
        expect(appControllerStore.wordsPerMinute).toBeLessThan(300);
        await typingSimulator("DEF %", 250);
        expect(appControllerStore.wordsPerMinute).toBeGreaterThan(150);
        expect(appControllerStore.wordsPerMinute).toBeLessThan(180);
        await typingSimulator("1UV", 50);
        expect(appControllerStore.wordsPerMinute).toBeGreaterThan(150);
        expect(appControllerStore.wordsPerMinute).toBeLessThan(180);
    });
    
    test('whether resetProgress correctly works when argument clear content is false', async () => {
        await typingSimulator("ABC CCF");
        appStateStore.isTypingFinished = true;
        const spy_removeProgressDataFromContentData = vi.spyOn(typingContentStore, "removeProgressDataFromContentData").mockImplementation(() => true);
        
        appControllerStore.resetProgress(false);
        
        expect(typingContentStore.removeProgressDataFromContentData).toHaveBeenCalledTimes(1);
        expect(appControllerStore.currentPositionBlock).toBe(0);
        expect(appControllerStore.currentPositionChar).toBe(0);
        expect(appControllerStore.measurementDataWordPerMinute).toEqual([]);
        expect(appStateStore.isTypingFinished).toBe(false);
        expect(typingContentStore.contentData.length).toBeGreaterThan(0);

        spy_removeProgressDataFromContentData.mockRestore();
    });

    test('whether resetProgress correctly works when argument clear content is true', async () => {
        await typingSimulator("ABC CCF");
        appStateStore.isTypingFinished = true;
        const spy_removeProgressDataFromContentData = vi.spyOn(typingContentStore, "removeProgressDataFromContentData").mockImplementation(() => true);
        
        appControllerStore.resetProgress(true);
        
        expect(typingContentStore.removeProgressDataFromContentData).toHaveBeenCalledTimes(0);
        expect(appControllerStore.currentPositionBlock).toBe(0);
        expect(appControllerStore.currentPositionChar).toBe(0);
        expect(appControllerStore.measurementDataWordPerMinute).toEqual([]);
        expect(appStateStore.isTypingFinished).toBe(false);
        expect(typingContentStore.contentData.length).toBe(0);
        expect(typingContentStore.contentData).toEqual([]);
        
        spy_removeProgressDataFromContentData.mockRestore();
    });
});