export default (typingSequence, timeInterval = 10) => {
    return new Promise((resolve) => {
        const typingSequenceArray = [...typingSequence];
        (async () => {
            for (const char of typingSequenceArray) {
                window.dispatchEvent(new KeyboardEvent("keypress", { "key": char }));
                await new Promise((res) => setTimeout(res, timeInterval));
            };
            resolve();
        })();
    });
};