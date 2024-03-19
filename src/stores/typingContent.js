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
                    let utf8Encode = new TextEncoder();
                    let loadedTextBytes = utf8Encode.encode(loadedText);
                    loadedTextBytes.forEach(ltb => {
                        if(ltb > 127) {
                            isText = false;
                            return;
                        }
                    });
                    
                    if(isText) {
                        contentData.value = generateContentData(loadedTextBytes);
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
              let loadedTextBytes = new Uint8Array(txtdata);
              console.log("bb", loadedTextBytes);
              loadedTextBytes.forEach(ltb => {
                if(ltb > 127) {
                    isText = false;
                    return;
                }
              });
              
              if(isText) {
                contentData.value = generateContentData(loadedTextBytes);
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



    const getContentType = (char) => {
        let type = "char";
        if(char === '\r') {
            type = "none";
         };
        if(char === '\n') {
            type = "lf";
        };
        if(char === ' ' || char === '\t') {
            type = "space";
        };

        return type;

    };

    const generateContentData = (loadedTextBytes) => {
        let dataObject = [];
        let lastContentType = null;
        let contentBlock = {};

        loadedTextBytes.forEach((b, i) => {
            let char = String.fromCharCode(b);
            let type = getContentType(char);

            char = type === 'char' ? char
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
                    keypressTimeStamp: null
                });

            } else {
                lastContentType = type;
                contentBlock.chars.push({
                    char: char,
                    failed: null,
                    failedChar: "",
                    keypressTimeStamp: null
                });
            }
        });

        dataObject = dataObject.filter(item => item.type != 'none');
        
        return dataObject;
    };

    const removeProgressDataFromContentData = () => {
        contentData.value.forEach(cd => {
            cd.chars.forEach(ch => {
                ch.failed = null;
                ch.failedChar = "";
                ch.keypressTimeStamp = null;
            });
        });
    };

    return {contentData, loadDemoContent, loadContentFromCustomFile, removeProgressDataFromContentData};
});
