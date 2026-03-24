export class FileReaderMockResolve {
  onload = null;
  result = 'unit test resolve';

  readAsArrayBuffer = async function() {
    await new Promise(res => setTimeout(res, 10));
    if (typeof this.onload === 'function') {
      this.onload();
    }
  };
}

export class FileReaderMockReject {
  onerror = null;

  readAsArrayBuffer = async function() {
    await new Promise(res => setTimeout(res, 10));
    if (typeof this.onerror === 'function') {
      // pass a real Error object
      this.onerror(new Error('unit test reject'));
    }
  };
}