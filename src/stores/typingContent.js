import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getTextFile, simpleCheckIsText } from '@utilities/fileHelper';
import { generateContentData, removeProgressData } from '@/utilities/content';

export const useTypingContentStore = defineStore('typingContentStore', () => {

    const contentData = ref([]);

    const loadDemoContent = async (filename) => {
      return new Promise((resolve, reject) => {
          fetch(filename)
          .then((response) => {
            if(!response.headers.get("Content-Type").includes('text/plain')) {
                contentData.value = [];
                reject({error: "'" + filename + "' has wrong content type"});
            }

              response.text().then((loadedText) => {
                  let utf8Encode = new TextEncoder(/*"utf-8"*/);
                  let loadedTextBytes = utf8Encode.encode(loadedText);
                  
                  if(simpleCheckIsText(loadedTextBytes)) {
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
              reject({error: "error fetching file: '" + filename + "'", errorObject: err});
              
          });
      });
    };

    const loadContentFromCustomFile = async (file) => {
        return new Promise((resolve, reject) => {
          if(file.type !== 'text/plain') {
              contentData.value = [];
              reject({error: "'" + file.name + "' has wrong content type"});
          }

          getTextFile(file)
          .then((txtdata) => {
              let loadedTextBytes = new Uint8Array(txtdata);
            
              if(simpleCheckIsText(loadedTextBytes)) {
                contentData.value = generateContentData(new TextDecoder().decode(loadedTextBytes));
                resolve();
              } else {
                  contentData.value = [];
                  reject({error: "'" + file.name + "' is not a text file"});
              }
          }).catch((err) => {
            contentData.value = [];
            reject({error: "error load file", errorObject: err});
          });
        });
    };

    const removeProgressDataFromContentData = () => {
        removeProgressData(contentData.value);
    };

    return {contentData, loadDemoContent, loadContentFromCustomFile, removeProgressDataFromContentData};
});
