import { vi } from 'vitest';

export default vi.fn((filename) => {
    return new Promise((resolve, reject) => {
        switch(filename) {
            case 'wrong_file_type':
                resolve({
                    headers: { get: function() { return '../..'; } },
                    text: function() { return new Promise((resolve) => { resolve('text from wrong file'); } ); }
                });
                break;
            case 'text_file':
                resolve({
                    headers: { get: function() { return 'text/plain'; } },
                    text: function() { return new Promise((resolve) => { resolve('text from file'); } ); }
                });
                break;
            case 'error_fetch_file':
            default:
                reject({ inErrorObject: 0 });
                break;
        }
    });
});