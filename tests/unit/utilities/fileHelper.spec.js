import { describe, expect, test, vi} from "vitest";
import { FileReaderMockResolve, FileReaderMockReject } from "../_helper/filereader-mocks";

import { getTextFile, simpleCheckIsText  } from '@/utilities/fileHelper.js';

describe('test "utilities/fileHelper"', () => {

    test('whether getTextFile() correctly works when Promise resolve', async () => {
        const fileReader = new FileReaderMockResolve();
        const spy_FileReader = vi.spyOn(window, "FileReader").mockImplementation(() => fileReader);

        let result = await getTextFile({dummy: 'object'});
        expect(spy_FileReader).toBeCalledTimes(1);
        expect(result).toBe('unit test resolve');
        spy_FileReader.mockRestore();
    });

    test('whether getTextFile() correctly works when Promise reject', async () => {
        const fileReader = new FileReaderMockReject();
        const spy_FileReader = vi.spyOn(window, "FileReader").mockImplementation(() => fileReader);
        
        await expect(() => getTextFile({dummy: 'object'})).rejects.toThrowError('unit test reject');
        spy_FileReader.mockRestore();
    });

    test('whether simpleCheckIsText() correctly works when Uint8Array contains just text', () => {
        let testArray = new Uint8Array(5);
        testArray[0] = 65;
        testArray[1] = 66;
        testArray[2] = 67;
        testArray[3] = 68;
        testArray[4] = 69;
        expect(simpleCheckIsText(testArray)).toBe(true);
    });

    test('whether simpleCheckIsText() correctly works when Uint8Array contains binary data', () => {
        let testArray = new Uint8Array(5);
        testArray[0] = 65;
        testArray[1] = 0;
        testArray[2] = 67;
        testArray[3] = 68;
        testArray[4] = 69;
        expect(simpleCheckIsText(testArray)).toBe(false);
    });
});