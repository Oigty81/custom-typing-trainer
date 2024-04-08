import { beforeEach, describe, expect, test } from "vitest";

import { createPinia, setActivePinia } from "pinia";

import { useAppControllerStore } from '@/stores/appController';

describe('test "stores/appController"', () => {
    
    let appControllerStore = null;

    beforeEach(() => {
        setActivePinia(createPinia());
        appControllerStore = useAppControllerStore();
    });

    test('whether dummy', () => {
        expect(true).toBe(true);
    });

});