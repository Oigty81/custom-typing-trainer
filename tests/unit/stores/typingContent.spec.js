import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createPinia, setActivePinia } from 'pinia';

import { useTypingContentStore } from '@/stores/typingContent';

import fetchMock from '../_helper/fetch-mock';

import { generateContentData, removeProgressData } from '@/utilities/content';
import { getTextFile, simpleCheckIsText } from '@utilities/fileHelper';

vi.mock('@/utilities/content');
vi.mock('@/utilities/fileHelper');

vi.stubGlobal('fetch', fetchMock);

describe('test "stores/typingContent"', () => {
    
    let typingContentStore = null;

    generateContentData.mockReturnValue(
        [
            { type: 'letter', chars: [ { char: 'U', failed: null, failedChar: "" }, { char: 'N', failed: null, failedChar: "" }, { char: 'I', failed: null, failedChar: "" }, { char: 'T', failed: null, failedChar: "" } ] },
            { type: 'space', chars: [ { char: '_', failed: null, failedChar: "" } ] },
            { type: 'letter', chars: [ { char: 'T', failed: null, failedChar: "" }, { char: 'e', failed: null, failedChar: "" }, { char: 's', failed: null, failedChar: "" }, { char: 't', failed: null, failedChar: "" } ] },
        ]
    );

    beforeEach(() => {
        setActivePinia(createPinia());
        typingContentStore = useTypingContentStore();
    });

    test('whether loadDemoContent reject error when fetch() reject error too', async () => {
        let errorObject = null;
        await typingContentStore.loadDemoContent('error_fetch_file').catch((error) => { errorObject = error; });
        expect(errorObject).toHaveProperty('error', "error fetching file: 'error_fetch_file'");
    });

    test('whether loadDemoContent reject error when fetch wrong file type', async () => {
        let errorObject = null;
        await typingContentStore.loadDemoContent('wrong_file_type').catch((error) => { errorObject = error; });
        expect(errorObject).toHaveProperty('error', "'wrong_file_type' has wrong content type");
    });

    test('whether loadDemoContent reject error when fetch file type is text but content is no text', async () => {
        let errorObject = null;
        simpleCheckIsText.mockReturnValue(false);
        await typingContentStore.loadDemoContent('text_file').catch((error) => { errorObject = error; });
        expect(errorObject).toHaveProperty('error', "'text_file' is not a text file");
        simpleCheckIsText.mockReset();
    });

    test('whether loadDemoContent correctly resolve', async () => {
        simpleCheckIsText.mockReturnValue(true);
        await typingContentStore.loadDemoContent('text_file');
        expect(typingContentStore.contentData.length).toBe(3);
        expect(typingContentStore.contentData[0].chars[0].char).toBe('U');
        expect(typingContentStore.contentData[0].chars[1].char).toBe('N');
        expect(typingContentStore.contentData[0].chars[2].char).toBe('I');
        expect(typingContentStore.contentData[0].chars[3].char).toBe('T');
        simpleCheckIsText.mockReset();
    });

    test('whether loadContentFromCustomFile reject error when file has wrong type', async () => {
        let errorObject = null;
        await typingContentStore.loadContentFromCustomFile({name: 'ut.any', type: '??/??'}).catch((error) => { errorObject = error; });
        expect(errorObject).toHaveProperty('error', "'ut.any' has wrong content type");
    });

    test('whether loadContentFromCustomFile reject error when function getTextFile() reject error', async () => {
        let errorObject = null;
        getTextFile.mockReturnValue(new Promise((resolve, reject) => { reject("unit test error getTextFile()"); }));

        await typingContentStore.loadContentFromCustomFile({name: 'ut.any', type: 'text/plain'}).catch((error) => { errorObject = error; });
        expect(errorObject).toHaveProperty('error', "error load file");
        expect(errorObject).toHaveProperty('errorObject', "unit test error getTextFile()");

        getTextFile.mockRestore();
    });

    test('whether loadContentFromCustomFile correctly resolve', async () => {
        getTextFile.mockReturnValue(new Promise((resolve) => { resolve("test text"); }));
        simpleCheckIsText.mockReturnValue(true);

        await typingContentStore.loadContentFromCustomFile({name: 'ut.any', type: 'text/plain'});
        expect(typingContentStore.contentData.length).toBe(3);
        expect(typingContentStore.contentData[0].chars[0].char).toBe('U');
        expect(typingContentStore.contentData[0].chars[1].char).toBe('N');
        expect(typingContentStore.contentData[0].chars[2].char).toBe('I');
        expect(typingContentStore.contentData[0].chars[3].char).toBe('T');
        
        getTextFile.mockRestore();
        simpleCheckIsText.mockReset();
    });

    test('whether loadContentFromCustomFile reject error when file load success but content is no text', async () => {
        let errorObject = null;
        getTextFile.mockReturnValue(new Promise((resolve) => { resolve("test text"); }));
        simpleCheckIsText.mockReturnValue(false);
        await typingContentStore.loadContentFromCustomFile({name: 'ut.any', type: 'text/plain'}).catch((error) => { errorObject = error; });
        expect(errorObject).toHaveProperty('error', "'ut.any' is not a text file");
        expect(true).toBe(true);
        getTextFile.mockRestore();
        simpleCheckIsText.mockReset();
    });

    test('whether removeProgressDataFromContentData calls utilities/removeProgressData', () => {
        typingContentStore.removeProgressDataFromContentData();
        expect(removeProgressData).toHaveBeenCalledTimes(1);
        removeProgressData.mockClear();
    });
});