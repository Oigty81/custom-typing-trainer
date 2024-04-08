import { describe, expect, test} from "vitest";

import { isLetter, getContentType, generateContentData, removeProgressData } from '@/utilities/content.js';

describe('test "utilities/content"', () => {
        
    test('whether function istLetter returns correct values', () => {
        expect(isLetter('1')).toBeNull();
        expect(isLetter('-')).toBeNull();
        expect(isLetter('§')).toBeNull();
        expect(isLetter('&')).toBeNull();
        expect(isLetter('A')[0]).toEqual("A");
        expect(isLetter('a')[0]).toEqual("a");
    });

    test('whether function getContentType() returns correct values', () => {
        expect(getContentType('-')).toBe('anychar');
        expect(getContentType('%')).toBe('anychar');
        expect(getContentType('&')).toBe('anychar');
        expect(getContentType('a')).toBe('letter');
        expect(getContentType('A')).toBe('letter');
        expect(getContentType('\r')).toBe('none');
        expect(getContentType('\n')).toBe('lf');
        expect(getContentType(' ')).toBe('space');
    });

    test('whether function generateContentData() returns correct object', () => {
       //let contentString = "abc rt%6\r\nwww rrr";
       let contentString = "ww rr";
       let destObject = generateContentData(contentString);
       expect(destObject).toBe('space');
    });
});