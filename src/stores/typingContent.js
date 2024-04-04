import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTypingContentStore = defineStore('typingContentStore', () => {
    const contentData = ref([]);
    const loadDemoContent = async (filename) => {
        return new Promise((resolve, reject) => {
            fetch(filename)
            .then((response) => {
                
                if(response.headers.get("Content-Type") !== 'text/plain') {
                    contentData.value = [];
                    reject({error: "'" + filename + "' has wrong content type"});
                }

                let isText = true;
               
                response.text().then((loadedText) => {
                    //TODO: refactore to utilities "fileHelper.js ("check is text")
                    let utf8Encode = new TextEncoder(/*"utf-8"*/);
                    let loadedTextBytes = utf8Encode.encode(loadedText);
                    loadedTextBytes.forEach(ltb => {
                        if(ltb === 0) {
                            isText = false;
                            return;
                        }
                    });
                    if(isText) {
                        contentData.value = generateContentData(new TextDecoder().decode(loadedTextBytes));
                        resolve();
                    } else {
                        contentData.value = [];
                        reject({error: "'" + filename + "' is not a text file"});
                    }
                });
            })
            .catch((err)=> {
                contentData.value = [];
                reject({error: "error fetching file: '" + filename + "'", errorObjct: err});
               
            });
        });
    };

    const loadContentFromCustomFile = async (file) => {
        return new Promise((resolve, reject) => {
          if(file.type !== 'text/plain') {
              contentData.value = [];
              reject({error: "'" + file.name + "' has wrong content type"});
          }

          let isText = true;

          getTextFile(file)
          .then((txtdata) => {
            //TODO: refactore to utilities "fileHelper.js" ("check is text")
              let loadedTextBytes = new Uint8Array(txtdata);
              loadedTextBytes.forEach(ltb => {
                if(ltb === 0) {
                    isText = false;
                    return;
                }
              });
              
              if(isText) {

                contentData.value = generateContentData(new TextDecoder().decode(loadedTextBytes));
                resolve();
              } else {
                  contentData.value = [];
                  reject({error: "'" + file.name + "' is not a text file"});
              }
          }).catch((err) => {
            contentData.value = [];
            reject({error: "error load file", errorObjct: err});
          });
        });
    };

    //TODO: remove to utility "fileHelper.js"
    const getTextFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
        });
    };


    //TODO: refactor to utilities "typing.js" OR "content.js"
    function isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    //TODO: refactor to utilities "typing.js" OR "content.js"
    const getContentType = (char) => {
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

    //TODO: refactor to utilities "typing.js" OR "content.js"
    const generateContentData = (contentString) => {
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

    const removeProgressDataFromContentData = () => {
        //TODO: call an utility function "typing.js" OR "content.js"
        contentData.value.forEach(cd => {
            cd.chars.forEach(ch => {
                ch.failed = null;
                ch.failedChar = "";
            });
        });
    };

    return {contentData, loadDemoContent, loadContentFromCustomFile, removeProgressDataFromContentData};
});
