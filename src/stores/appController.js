import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useAppStateStore  } from '@/stores/appState';
import { useTypingContentStore  } from '@/stores/typingContent';

export const useAppControllerStore = defineStore('appControllerStore', () => {

    const  appState =  useAppStateStore();
    const  typingContentStore =  useTypingContentStore();

    const currentPositionBlock = ref (0);
    const currentPositionChar = ref (0);

    const keypressHandler = (e) => {
        if(appState.typingProgressEnabled) {

            if(typingContentStore.contentData.length === 0) {
                return;
            }

            progressTypingCheck(e.key);
        };
    };

    const progressTypingCheck = (key) => {
        console.log('current key', key); //TODO: remove later

        if(isTypingContentEndPosition()) {
            return;
        }
        while(
            typingContentStore.contentData[currentPositionBlock.value].type === 'lf' ||
            typingContentStore.contentData[currentPositionBlock.value].type === 'none') {
                currentPositionBlock.value++;
                if(isTypingContentEndPosition()) {
                    return;
                }
        }
        
        let currentCharTocheck = "";

        if(appState.ignoreCapitalizeEnabled) {
                        
            currentCharTocheck =  typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].char.toLowerCase();
        } else {
            currentCharTocheck =  typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].char;
        }

        typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].keypressTimeStamp = new Date();
        console.log('curr:',key,':', currentPositionBlock.value, currentPositionChar.value);
        if(currentCharTocheck === key) {
            typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].failed = false;
            if(appState.keySoundEnabled) {
                let audio = new Audio('./good.mp3');
                audio.play();
            }
        } else {
            let failedChar = "";
            if(appState.ignoreCapitalizeEnabled) {
                failedChar = key.toLowerCase();
            } else {
                failedChar = key.value;
            }
            typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].failed = true;
            typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].failedChar = failedChar;
            if(appState.keySoundEnabled) {
                let audio = new Audio('./bad.mp3');
                audio.play();
            }
        }

        if((currentPositionChar.value + 1) === typingContentStore.contentData[currentPositionBlock.value].chars.length) {
            currentPositionBlock.value++;
            currentPositionChar.value = 0;
        } else {
            currentPositionChar.value++;
        }
    };

    const isTypingContentEndPosition = () => {
        let isContentBlockEnding =
            typingContentStore.contentData.length - 1 == currentPositionBlock.value ? true : false;
        let isContentCharEnding =
            typingContentStore.contentData[currentPositionBlock.value].chars.length - 1 == currentPositionChar.value ? true : false;
            
        return isContentBlockEnding && isContentCharEnding;
    };
    
    window.addEventListener('keypress', keypressHandler);

    return { currentPositionBlock, currentPositionChar };
});
