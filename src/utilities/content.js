export const isLetter = (str) => {
    return str.length === 1 && str.match(/[a-z]/i);
};

export const getContentType = (char) => {
    let type = "anychar";
    if(isLetter(char) !== null) {
        type = "letter";
    }
    if(char === '\r') {
        type = "none";
    }
    if(char === '\n') {
        type = "lf";
    };
    if(char === ' ' || char === '\t') {
        type = "space";
    };
    return type;
};

export const generateContentData = (contentString) => {
    let dataObject = [];
    let lastContentType = null;
    let contentBlock = {};
   
    for(let i = 0; i<contentString.length;i++) {
        let char = contentString[i];
        let type = getContentType(char);

        char = type === 'anychar' ? char
            :  type === 'letter' ? char
            : type === 'space' ? '_' : '';
            
        if(i === 0 || lastContentType !== type) {
            if(i !== 0) {
                dataObject.push(contentBlock);
            }
            lastContentType = type;

            contentBlock = {
                type: type,
                chars: []
            };

            contentBlock.chars.push({
                char: char,
                failed: null,
                failedChar: "",
            });

        } else {
            lastContentType = type;
            contentBlock.chars.push({
                char: char,
                failed: null,
                failedChar: "",
            });
        }
    }

    // add possibly last block
    if(contentBlock.chars !== undefined && contentBlock.chars.length > 0) {
        dataObject.push(contentBlock);
    }

    dataObject = dataObject.filter(item => item.type != 'none');
    
    //TODO: find better solution for last char to trigger finish typing
    let lastObject = {
        type: 'space',
        chars: []
    };

    lastObject.chars.push({
        char: ".",
        failed: null,
        failedChar: "",
    });

    dataObject.push(lastObject);

    return dataObject;
};

export const removeProgressData = (contentData) => {
    contentData.forEach(cd => {
        cd.chars.forEach(ch => {
            ch.failed = null;
            ch.failedChar = "";
        });
    });
};