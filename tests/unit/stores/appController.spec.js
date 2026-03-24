import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import typingSimulator from '../_helper/typing-simulator';
import { AudioMock } from '../_helper/audio-mock';

import { useAppControllerStore } from '@/stores/appController';
import { useAppStateStore } from '@/stores/appState';
import { useTypingContentStore } from '@/stores/typingContent';

describe('test "stores/appController"', () => {
  //-------------------------------------------------------------
  // Reference typing content used in all tests
  //-------------------------------------------------------------
  const referenceContentObject = [
    { type: 'letter', chars: [
      { char: 'A', failed: null, failedChar: '' },
      { char: 'B', failed: null, failedChar: '' },
      { char: 'C', failed: null, failedChar: '' }
    ]},
    { type: 'space', chars: [
      { char: '_', failed: null, failedChar: '' }
    ]},
    { type: 'letter', chars: [
      { char: 'D', failed: null, failedChar: '' },
      { char: 'E', failed: null, failedChar: '' },
      { char: 'F', failed: null, failedChar: '' }
    ]},
    { type: 'space', chars: [
      { char: '_', failed: null, failedChar: '' }
    ]},
    { type: 'anychar', chars: [
      { char: '%', failed: null, failedChar: '' },
      { char: '1', failed: null, failedChar: '' }
    ]},
    { type: 'none', chars: [
      { char: '', failed: null, failedChar: '' }
    ]},
    { type: 'lf', chars: [
      { char: '', failed: null, failedChar: '' }
    ]},
    { type: 'letter', chars: [
      { char: 'U', failed: null, failedChar: '' },
      { char: 'V', failed: null, failedChar: '' },
      { char: 'W', failed: null, failedChar: '' }
    ]},
    { type: 'space', chars: [
      { char: '_', failed: null, failedChar: '' }
    ]},
    { type: 'letter', chars: [
      { char: 'X', failed: null, failedChar: '' },
      { char: 'Y', failed: null, failedChar: '' },
      { char: 'Z', failed: null, failedChar: '' }
    ]}
  ];

  //-------------------------------------------------------------
  // Setup fresh store instances before running tests
  //-------------------------------------------------------------
  setActivePinia(createPinia());
  let appControllerStore = useAppControllerStore();
  let appStateStore = useAppStateStore();
  let typingContentStore = useTypingContentStore();

  beforeEach(() => {
    appControllerStore.currentPositionBlock = 0;
    appControllerStore.currentPositionChar = 0;
    appControllerStore.measurementDataWordPerMinute = [];

    appStateStore.typingProgressEnabled = true;
    appStateStore.ignoreCapitalizeEnabled = true;
    appStateStore.isTypingFinished = false;

    // Clone to avoid mutation side-effects
    typingContentStore.contentData = JSON.parse(JSON.stringify(referenceContentObject));
  });

  //-------------------------------------------------------------
  // Helper: Set up Audio interception
  //-------------------------------------------------------------
  function installAudioFactoryMock() {
    const factory = vi.fn((src) => new AudioMock(src));

    // Replace Audio constructor so that every "new Audio()" uses our factory
    window.Audio = function (src) {
      return factory(src);
    };

    return factory;
  }

  //-------------------------------------------------------------
  // PROGRESS CHECK TESTS
  //-------------------------------------------------------------
  test('whether progressTypingCheck fills progress data correctly when ignore-capitalize is enabled', async () => {
    appStateStore.ignoreCapitalizeEnabled = true;

    await typingSimulator('Abc dxF %1');

    expect(typingContentStore.contentData[0].chars[0].failed).toBe(false);
    expect(typingContentStore.contentData[0].chars[1].failed).toBe(false);
    expect(typingContentStore.contentData[0].chars[2].failed).toBe(false);

    expect(typingContentStore.contentData[1].chars[0].failed).toBe(false);

    expect(typingContentStore.contentData[2].chars[0].failed).toBe(false);
    expect(typingContentStore.contentData[2].chars[1].failed).toBe(true);
    expect(typingContentStore.contentData[2].chars[1].failedChar).toBe('x');
    expect(typingContentStore.contentData[2].chars[2].failed).toBe(false);
  });

  test('whether progressTypingCheck fills progress data correctly when ignore-capitalize is disabled', async () => {
    appStateStore.ignoreCapitalizeEnabled = false;

    await typingSimulator('Abc dxF %1');

    expect(typingContentStore.contentData[0].chars[0].failed).toBe(false);
    expect(typingContentStore.contentData[0].chars[1].failed).toBe(true);
    expect(typingContentStore.contentData[0].chars[1].failedChar).toBe('b');
    expect(typingContentStore.contentData[0].chars[2].failed).toBe(true);
    expect(typingContentStore.contentData[0].chars[2].failedChar).toBe('c');

    expect(typingContentStore.contentData[2].chars[0].failed).toBe(true);
    expect(typingContentStore.contentData[2].chars[0].failedChar).toBe('d');
  });

  //-------------------------------------------------------------
  test('whether progressTypingCheck sets isTypingFinished at the right moment', async () => {
    await typingSimulator('Abc dxF %1UVW X');
    expect(appStateStore.isTypingFinished).toBe(false);

    await typingSimulator('YZ');
    expect(appStateStore.isTypingFinished).toBe(true);
  });

  //-------------------------------------------------------------
  // AUDIO TEST (full, correct, stable)
  //-------------------------------------------------------------
  test('whether progressTypingCheck plays correct key sound audio when enabled', async () => {
    appStateStore.keySoundEnabled = true;

    const audioFactory = installAudioFactoryMock();
    const spyPlay = vi.spyOn(AudioMock.prototype, 'play');

    // First sequence: ABD
    await typingSimulator('ABD');

    expect(audioFactory).toHaveBeenCalledTimes(3);
    expect(audioFactory).toHaveBeenNthCalledWith(1, './good.mp3');
    expect(audioFactory).toHaveBeenNthCalledWith(2, './good.mp3');
    expect(audioFactory).toHaveBeenNthCalledWith(3, './bad.mp3');
    expect(spyPlay).toHaveBeenCalledTimes(3);

    // Disable (should not play anything)
    appStateStore.keySoundEnabled = false;
    await typingSimulator(' e');
    expect(spyPlay).toHaveBeenCalledTimes(3);

    // Enable again: GF ➝ (bad, good, good for space)
    appStateStore.keySoundEnabled = true;
    await typingSimulator('GF ');

    expect(audioFactory).toHaveBeenCalledTimes(6);
    expect(audioFactory).toHaveBeenNthCalledWith(4, './bad.mp3');
    expect(audioFactory).toHaveBeenNthCalledWith(5, './good.mp3');
    expect(audioFactory).toHaveBeenNthCalledWith(6, './good.mp3');
    expect(spyPlay).toHaveBeenCalledTimes(6);

    spyPlay.mockRestore();
  });

  //-------------------------------------------------------------
  // ACCURACY TEST
  //-------------------------------------------------------------
  test('whether computed property "accuracyInPercent" returns correct value', async () => {
    await typingSimulator('ABC XXX %21');
    expect(appControllerStore.accuracyInPercent).toBeGreaterThan(53);
    expect(appControllerStore.accuracyInPercent).toBeLessThan(55);

    await typingSimulator('VW XY');
    expect(appControllerStore.accuracyInPercent).toBeGreaterThan(67);
    expect(appControllerStore.accuracyInPercent).toBeLessThan(69);
  });

  //-------------------------------------------------------------
  // WORDS PER MINUTE TEST
  //-------------------------------------------------------------
  test('whether computed property "wordsPerMinute" returns correct value', async () => {
    await typingSimulator('AB', 100);
    expect(appControllerStore.wordsPerMinute).toBe(0);

    await typingSimulator('C ', 50);
    expect(appControllerStore.wordsPerMinute).toBeGreaterThan(220);
    expect(appControllerStore.wordsPerMinute).toBeLessThan(300);

    await typingSimulator('DEF %', 250);
    expect(appControllerStore.wordsPerMinute).toBeGreaterThan(150);
    expect(appControllerStore.wordsPerMinute).toBeLessThan(180);

    await typingSimulator('1UV', 50);
    expect(appControllerStore.wordsPerMinute).toBeGreaterThan(150);
    expect(appControllerStore.wordsPerMinute).toBeLessThan(180);
  });

  //-------------------------------------------------------------
  // RESET PROGRESS TESTS
  //-------------------------------------------------------------
  test('whether resetProgress works correctly when clearContent = false', async () => {
    await typingSimulator('ABC CCF');

    appStateStore.isTypingFinished = true;

    const spyRemove = vi
      .spyOn(typingContentStore, 'removeProgressDataFromContentData')
      .mockImplementation(() => true);

    appControllerStore.resetProgress(false);

    expect(typingContentStore.removeProgressDataFromContentData).toHaveBeenCalledTimes(1);
    expect(appControllerStore.currentPositionBlock).toBe(0);
    expect(appControllerStore.currentPositionChar).toBe(0);
    expect(appControllerStore.measurementDataWordPerMinute).toEqual([]);
    expect(appStateStore.isTypingFinished).toBe(false);
    expect(typingContentStore.contentData.length).toBeGreaterThan(0);

    spyRemove.mockRestore();
  });

  test('whether resetProgress works correctly when clearContent = true', async () => {
    await typingSimulator('ABC CCF');

    appStateStore.isTypingFinished = true;

    const spyRemove = vi
      .spyOn(typingContentStore, 'removeProgressDataFromContentData')
      .mockImplementation(() => true);

    appControllerStore.resetProgress(true);

    expect(typingContentStore.removeProgressDataFromContentData).toHaveBeenCalledTimes(0);
    expect(appControllerStore.currentPositionBlock).toBe(0);
    expect(appControllerStore.currentPositionChar).toBe(0);
    expect(appControllerStore.measurementDataWordPerMinute).toEqual([]);
    expect(appStateStore.isTypingFinished).toBe(false);
    expect(typingContentStore.contentData).toEqual([]);

    spyRemove.mockRestore();
  });
});