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
       let contentString = "abc rt%6\r\nww rr";
       let destObject = generateContentData(contentString);

       expect(destObject.length).toBe(9);

       expect(destObject[0].type).toBe('letter');
       expect(destObject[0].chars.length).toBe(3);
       expect(destObject[0].chars[0].char).toBe('a');
       expect(destObject[0].chars[1].char).toBe('b');
       expect(destObject[0].chars[2].char).toBe('c');
       expect(destObject[0].chars[2].failed).toBe(null);
       expect(destObject[0].chars[2].failedChar).toBe('');

       expect(destObject[3].type).toBe('anychar');
       expect(destObject[3].chars.length).toBe(2);
       expect(destObject[3].chars[0].char).toBe('%');
       expect(destObject[3].chars[1].char).toBe('6');
       expect(destObject[3].chars[1].failed).toBe(null);
       expect(destObject[3].chars[1].failedChar).toBe('');

       expect(destObject[8].type).toBe('space');
       expect(destObject[8].chars.length).toBe(1);
       expect(destObject[8].chars[0].char).toBe('.');
    });

    test('whether function removeProgressData() remove progress data', () => {
        let contentString = "abc rt%6\r\nwww rrr";
        let destObject = generateContentData(contentString);
        
        destObject[2].chars[1].failed = true;
        destObject[2].chars[1].failedChar = 'X';
        destObject[3].chars[1].failed = true;
        destObject[3].chars[1].failedChar = 'P';

        expect(destObject[2].chars[1].failed).toBe(true);
        expect(destObject[2].chars[1].failedChar).toBe('X');
        expect(destObject[3].chars[1].failed).toBe(true);
        expect(destObject[3].chars[1].failedChar).toBe('P');

        removeProgressData(destObject);

        expect(destObject[2].chars[1].failed).toBe(null);
        expect(destObject[2].chars[1].failedChar).toBe('');
        expect(destObject[3].chars[1].failed).toBe(null);
        expect(destObject[3].chars[1].failedChar).toBe('');
     });
});