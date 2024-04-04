import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { useAppStateStore  } from '@/stores/appState';
import { useTypingContentStore  } from '@/stores/typingContent';

export const useAppControllerStore = defineStore('appControllerStore', () => {

    const  appStateStore =  useAppStateStore();
    const  typingContentStore =  useTypingContentStore();

    const currentPositionBlock = ref (0);
    const currentPositionChar = ref (0);

    const measurementDataWordPerMinute = ref([]);

    const keypressHandler = (e) => {
        if(appStateStore.typingProgressEnabled) {

            if(typingContentStore.contentData.length === 0) {
                return;
            }

            progressTypingCheck(e.key);
        };
    };

    const progressTypingCheck = (key) => {
        if(isTypingContentEndPosition()) {
            if(appStateStore.isTypingFinished !== true) {
                appStateStore.isTypingFinished = true;
            }
            handleCloseCurrentMeasurementDataWordPerMinute();
            return;
        }
        
        handleMeasurementDataWordPerMinute(typingContentStore.contentData[currentPositionBlock.value]);

        let currentCharTocheck = "";

        if(appStateStore.ignoreCapitalizeEnabled) {
                        
            currentCharTocheck =  typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].char.toLowerCase();
        } else {
            currentCharTocheck =  typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].char;
        }

        if(
            currentCharTocheck === key ||
            (typingContentStore.contentData[currentPositionBlock.value].type === "space" && ' ' === key )
            ) {
            typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].failed = false;
            if(appStateStore.keySoundEnabled) {
                let audio = new Audio('./good.mp3');
                audio.play();
            }
        } else {
            let failedChar = "";
            if(appStateStore.ignoreCapitalizeEnabled) {
                failedChar = key.toLowerCase();
            } else {
                failedChar = key;
            }
            typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].failed = true;
            typingContentStore.contentData[currentPositionBlock.value].chars[currentPositionChar.value].failedChar = failedChar;
            if(appStateStore.keySoundEnabled) {
                let audio = new Audio('./bad.mp3');
                audio.play();
            }
        }

        if((currentPositionChar.value + 1) === typingContentStore.contentData[currentPositionBlock.value].chars.length) {
            currentPositionBlock.value++;
            currentPositionChar.value = 0;
            handleCloseCurrentMeasurementDataWordPerMinute();
        } else {
            currentPositionChar.value++;
        }

        while(
            typingContentStore.contentData[currentPositionBlock.value].type === 'lf' ||
            typingContentStore.contentData[currentPositionBlock.value].type === 'none') {
                currentPositionBlock.value++;
                currentPositionChar.value = 0;
                
                if(isTypingContentEndPosition()) {
                    return;
                }
        }
    };

    const isTypingContentEndPosition = () => {
        let isContentBlockEnding =
            typingContentStore.contentData.length - 1 == currentPositionBlock.value ? true : false;
        let isContentCharEnding =
            typingContentStore.contentData[currentPositionBlock.value].chars.length - 1 == currentPositionChar.value ? true : false;
            
        return isContentBlockEnding && isContentCharEnding;
    };

    const handleMeasurementDataWordPerMinute = (currentBlock) => {
        if(measurementDataWordPerMinute.value.length === 0 && currentBlock.type === 'letter') {
            measurementDataWordPerMinute.value.push({
                startWord: new Date(),
                endWord: null
            });
            return;
        }

        if(measurementDataWordPerMinute.value.length > 0) {
            let isWordMeasurementActive = measurementDataWordPerMinute.value[measurementDataWordPerMinute.value.length - 1].endWord === null;
            if(isWordMeasurementActive && currentBlock.type !== 'letter') {
                measurementDataWordPerMinute.value[measurementDataWordPerMinute.value.length - 1].endWord = new Date();
                return;
            }

            if(!isWordMeasurementActive && currentBlock.type === 'letter') {
                measurementDataWordPerMinute.value.push({
                    startWord: new Date(),
                    endWord: null
                });
                return;
            }
        }
    };

    const handleCloseCurrentMeasurementDataWordPerMinute = () => {
        if(measurementDataWordPerMinute.value.length > 0) {
            if(measurementDataWordPerMinute.value[measurementDataWordPerMinute.value.length - 1].endWord === null) {
                measurementDataWordPerMinute.value[measurementDataWordPerMinute.value.length - 1].endWord = new Date();
            }
        }
    };

    window.addEventListener('keypress', keypressHandler);

    const accuracyInPercent = computed(()=> {
        let total = 0;
        let failed = 0;
        typingContentStore.contentData.forEach(cd => {
            if(cd.type === 'space' || cd.type === 'anychar' || cd.type === 'letter') {
                cd.chars.forEach(ch => {
                    if(ch.failed !== null) {
                        total++;
                        if(ch.failed === true) {
                            failed++;
                        }
                    }
                });
            }
        });
        
        if(total !== 0) {
            return 100 - ((failed / total) * 100.0);
        } else {
            return 0;
        }
        
    });

    const wordsPerMinute = computed(() => {
        let totalTimeForWords = 0;
        let finishedWord = 0;

        measurementDataWordPerMinute.value.forEach(word => {
            if(word.endWord !== null) {
                totalTimeForWords += word.endWord.getTime() - word.startWord.getTime();
                finishedWord++;
            }
        });
        
        if(totalTimeForWords !== 0) {
            return finishedWord / (totalTimeForWords / 60000);
        } else {
            return 0;
        }
        
    });

    const resetProgress = (clearContent = false) => {
        currentPositionBlock.value = 0;
        currentPositionChar.value = 0;
        measurementDataWordPerMinute.value = [];
        appStateStore.isTypingFinished = false;

        if(clearContent) {
            typingContentStore.contentData = [];
        } else {
            typingContentStore.removeProgressDataFromContentData();
        }
    };

    return {
        currentPositionBlock, currentPositionChar, measurementDataWordPerMinute,
        accuracyInPercent, wordsPerMinute,
        resetProgress

    };
});
