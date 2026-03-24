import { describe, expect, test, vi } from 'vitest';
import {
  FileReaderMockResolve,
  FileReaderMockReject
} from '../_helper/filereader-mocks';

import { getTextFile, simpleCheckIsText } from '@/utilities/fileHelper.js';

describe('test "utilities/fileHelper"', () => {

  test('getTextFile() resolves correctly', async () => {
    // Replace FileReader with a mock class
    vi.stubGlobal('FileReader', FileReaderMockResolve);

    const result = await getTextFile({ dummy: 'object' });
    expect(result).toBe('unit test resolve');

    vi.unstubAllGlobals();
  });

  test('getTextFile() rejects correctly', async () => {
    // Replace FileReader with a mock class
    vi.stubGlobal('FileReader', FileReaderMockReject);

    await expect(getTextFile({ dummy: 'object' }))
      .rejects
      .toThrow('unit test reject');

    vi.unstubAllGlobals();
  });

  test('simpleCheckIsText() returns true for pure text', () => {
    const testArray = new Uint8Array([65, 66, 67, 68, 69]);
    expect(simpleCheckIsText(testArray)).toBe(true);
  });

  test('simpleCheckIsText() returns false for binary data', () => {
    const testArray = new Uint8Array([65, 0, 67, 68, 69]);
    expect(simpleCheckIsText(testArray)).toBe(false);
  });

});