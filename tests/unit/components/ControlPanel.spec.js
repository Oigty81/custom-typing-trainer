import { beforeEach, describe, test, vi, expect } from 'vitest';

import { setActivePinia, createPinia } from 'pinia';

import { shallowMount, } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import ControlPanel from '@components/ControlPanel.vue';

describe("components/ControlPanel.vue", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    test("whether dummy", async () => {
        //TODO:
        expect(true).toBe(true);
    });
});