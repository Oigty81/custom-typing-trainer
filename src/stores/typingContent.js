import { defineStore } from 'pinia';
import { ref, computed } from 'vue';


export const useTypingContentStore = defineStore('typingContentStore', () => {

    const foo = ref("");

    const data = ref("");

    const getFoo = computed(() => foo.value);

    const setFoo = async () => { foo.value = 1; };

    const loadDemoContent = async (filename) => {
        return new Promise((resolve, reject) => {
            fetch(filename)
            .then((response) => {
                console.log('response text:', response.headers.get("Content-Type"));
                //console.log('response text2:', response.text());
                response.text().then((out) => {
                    console.log('textout: ', out); foo.value = out;
                    let utf8Encode = new TextEncoder();
                    let out2 = utf8Encode.encode(out);
                    console.log('bytes', out2);

                    console.log('byte: ', out2[0]);
                    let isText = true;
                    out2.forEach(b => {
                        if(b > 127) {
                            console.log('no text file');
                            isText = false;
                            return;
                        }
                    });
                    
                    //13 10 is Enter
                    //32 is space
                    //9 is tab

                    let obj = [];
                    if(isText) {
                        out2.forEach((b,i) => {
                            let char = String.fromCharCode(b);
                            let type = "char";
                            if(char === '\r') { return; };
                            if(char === '\n') { type = "lf"; char = ""; };
                            if(char === '\t') { type = "tab"; char = ""; };
                            if(char === ' ') { type = "spaces"; char = ""; };

                            obj.push({
                                id: i,
                                char: char,
                                type: type
                            });
                        });
                        
                    }

                    console.log('obj', obj);
                    data.value = obj;
                    

                    
            } );
                
            
                resolve();
            })
            .catch((err)=> {
                console.log('err fetch');
                reject(err);
            });
        });
    };

    return {foo, data, getFoo, setFoo, loadDemoContent};
});
