import { defineStore } from 'pinia';
import { ref } from 'vue';

import { generateContentData, removeProgressData } from '@/utilities/content';

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

    const removeProgressDataFromContentData = () => {
        removeProgressData(contentData.value);
    };

    return {contentData, loadDemoContent, loadContentFromCustomFile, removeProgressDataFromContentData};
});
