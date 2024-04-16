export class AudioMock {
    constructor(src) {
        this.src = src;
    }

    async play() {
        await new Promise((res) => setTimeout(res, 10));
    };
};