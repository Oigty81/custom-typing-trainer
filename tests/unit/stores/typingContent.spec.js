import { beforeEach, describe, expect, test } from "vitest";

import { createPinia, setActivePinia } from "pinia";

import { useTypingContentStore } from '@/stores/typingContent';

describe('test "stores/appController"', () => {
    
    let typingContentStore = null;

    beforeEach(() => {
        setActivePinia(createPinia());
        typingContentStore = useTypingContentStore();
    });

    test('whether dummy', () => {
        expect(true).toBe(true);
    });

});