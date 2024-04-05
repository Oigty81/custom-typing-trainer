export const getTextFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const simpleCheckIsText = (textBytes) => {
    let isText = true;
    
    textBytes.forEach(ltb => {
        if(ltb === 0) {
            isText = false;
        }
      });
      
    return isText;
};