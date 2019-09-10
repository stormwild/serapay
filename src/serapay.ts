import fs from 'fs';

class Serapay {
  public process(path: string): void {
    // tslint:disable-next-line: no-console tslint:disable-next-line: prefer-template
    console.log('processing path: ' + path);

    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      // tslint:disable-next-line: no-console
      console.log('data:', data);
    });
  }
}

export default Serapay;
