import { describe, test, expect } from 'vitest';

import { shallowMount, } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import TypingProgressField from '@components/TypingProgressField.vue';

import { useAppControllerStore  } from '@/stores/appController';
import { useTypingContentStore  } from '@/stores/typingContent';

import { generateContentData } from '@/utilities/content.js';

describe("components/TypingProgressField.vue", () => {
    test("whether the view is rendered correctly according to the content data", async () => {
        const pinia = createTestingPinia();
        const typingContentStore =  useTypingContentStore(pinia);
        useAppControllerStore(pinia);

        let contentString = "abc rt%6\r\nww rr";
        typingContentStore.contentData = generateContentData(contentString);

        const wrapper = shallowMount(TypingProgressField, {
            global: {
                plugins: [ pinia ],
            },
        });

        expect(wrapper.findAll(".block-div").length).toBe(8);
        expect(wrapper.findAll(".line-break-div").length).toBe(1);

        const charDivsBlock1 = wrapper.findAll(".block-div:nth-of-type(1) .char-div");
        const charDivsBlock2 = wrapper.findAll(".block-div:nth-of-type(2) .char-div");
        const charDivsBlock3 = wrapper.findAll(".block-div:nth-of-type(3) .char-div");
        const charDivsBlock4 = wrapper.findAll(".block-div:nth-of-type(4) .char-div");
        const charDivsBlock5 = wrapper.findAll(".block-div:nth-of-type(5) .char-div");
        const charDivsBlock6 = wrapper.findAll(".block-div:nth-of-type(6) .char-div");
        const charDivsBlock7 = wrapper.findAll(".block-div:nth-of-type(7) .char-div");
        const charDivsBlock8 = wrapper.findAll(".block-div:nth-of-type(8) .char-div");
      
        expect(charDivsBlock1.length).toBe(3);
        expect(charDivsBlock2.length).toBe(1);
        expect(charDivsBlock3.length).toBe(2);
        expect(charDivsBlock4.length).toBe(2);
        expect(charDivsBlock5.length).toBe(0);
        expect(charDivsBlock6.length).toBe(2);
        expect(charDivsBlock7.length).toBe(1);
        expect(charDivsBlock8.length).toBe(2);

        expect(charDivsBlock1.at(0).text()).toBe("a");
        expect(charDivsBlock1.at(1).text()).toBe("b");
        expect(charDivsBlock1.at(2).text()).toBe("c");
        expect(charDivsBlock2.at(0).text()).toBe("_");
        expect(charDivsBlock3.at(0).text()).toBe("r");
        expect(charDivsBlock3.at(1).text()).toBe("t");
        expect(charDivsBlock4.at(0).text()).toBe("%");
        expect(charDivsBlock4.at(1).text()).toBe("6");
        expect(charDivsBlock6.at(0).text()).toBe("w");
        expect(charDivsBlock6.at(1).text()).toBe("w");
        expect(charDivsBlock7.at(0).text()).toBe("_");
        expect(charDivsBlock8.at(0).text()).toBe("r");
        expect(charDivsBlock8.at(1).text()).toBe("r");
        
        expect(charDivsBlock1.at(0).classes()).toContain('char-current');
        await wrapper.setProps({ typingFinished: true });
        expect(charDivsBlock1.at(0).classes()).not.toContain('char-current');
    });

    test("whether the view is rendered correctly while typing (good / bad)", async () => {
        const pinia = createTestingPinia();

        const appControllerStore = useAppControllerStore(pinia);
        const typingContentStore =  useTypingContentStore(pinia);

        let contentString = "abc rtxw";
        let contentData = generateContentData(contentString);
        contentData[0].chars[0].failed = false;
        contentData[0].chars[1].failed = false;
        contentData[0].chars[2].failed = true;
        contentData[0].chars[2].failedChar = "m";
        contentData[1].chars[0].failed = false;
        contentData[2].chars[0].failed = false;
        contentData[2].chars[1].failed = true;
        contentData[2].chars[1].failedChar = "n";
        contentData[2].chars[2].failed = false;

        typingContentStore.contentData = contentData;
        appControllerStore.currentPositionBlock = 2;
        appControllerStore.currentPositionChar = 2;

        const wrapper = shallowMount(TypingProgressField, {
            global: {
                plugins: [ pinia ],
            },
            propsData: {
                typingFinished: false,
            }
        });

        const charDivsBlock1 = wrapper.findAll(".block-div:nth-of-type(1) .char-div");
        const charDivsBlock2 = wrapper.findAll(".block-div:nth-of-type(2) .char-div");
        const charDivsBlock3 = wrapper.findAll(".block-div:nth-of-type(3) .char-div");

        expect(charDivsBlock1.at(0).classes()).toContain("char-good").not.toContain("char-bad").not.toContain("char-content-space");
        expect(charDivsBlock1.at(1).classes()).toContain("char-good").not.toContain("char-bad").not.toContain("char-content-space");
        expect(charDivsBlock1.at(2).classes()).toContain("char-bad").not.toContain("char-good").toContain("char-content-space");
        
        expect(charDivsBlock2.at(0).classes()).toContain("char-good").toContain("char-content-space").not.toContain("char-bad");
        
        expect(charDivsBlock3.at(0).classes()).toContain("char-good").not.toContain("char-bad").toContain("char-content-space");
        expect(charDivsBlock3.at(1).classes()).toContain("char-bad").not.toContain("char-good").toContain("char-content-space");
        expect(charDivsBlock3.at(2).classes()).toContain("char-good").toContain("char-current").not.toContain("char-bad").toContain("char-content-space");
        expect(charDivsBlock3.at(3).classes()).not.toContain("char-good").toContain("char-bad").toContain("char-content-space");
       
        await wrapper.setProps({ typingFinished: true });
        expect(charDivsBlock3.at(2).classes()).toContain("char-good").not.toContain("char-current").toContain("char-bad").toContain("char-content-space");

        expect(charDivsBlock1.at(0).findAll("div.char-failure-div").length).toBe(0);
        expect(charDivsBlock1.at(1).findAll("div.char-failure-div").length).toBe(0);
        expect(charDivsBlock1.at(2).findAll("div.char-failure-div").length).toBe(1);
        expect(charDivsBlock2.at(0).findAll("div.char-failure-div").length).toBe(0);
        expect(charDivsBlock3.at(0).findAll("div.char-failure-div").length).toBe(0);
        expect(charDivsBlock3.at(1).findAll("div.char-failure-div").length).toBe(1);
        expect(charDivsBlock3.at(2).findAll("div.char-failure-div").length).toBe(0);
        expect(charDivsBlock3.at(3).findAll("div.char-failure-div").length).toBe(0);

        expect(charDivsBlock1.at(2).findAll("div.char-failure-div").at(0).text()).toBe("m");
        expect(charDivsBlock3.at(1).findAll("div.char-failure-div").at(0).text()).toBe("n");

        expect(charDivsBlock1.at(2).findAll("div.char-failure-div").at(0).classes()).toContain("char-failure-div");
        expect(charDivsBlock3.at(1).findAll("div.char-failure-div").at(0).classes()).toContain("char-failure-div");
    });
});