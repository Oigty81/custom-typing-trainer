export class FileReaderMockResolve {
    onload = null;
    result = "unit test resolve";

    readAsArrayBuffer = async function() {
      await new Promise((res) => setTimeout(res, 100));
      if(this.onload != null || this.onload != undefined) {
        this.onload();
      }
    };
  }

  export class FileReaderMockReject {
    onerror = null;
    
    readAsArrayBuffer = async function() {
      await new Promise((res) => setTimeout(res, 100));
      if(this.onerror != null || this.onerror != undefined) {
        this.onerror("unit test reject");
      }
    };
  }