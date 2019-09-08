
class Serapay {
  public process(path: string): void {
    // tslint:disable-next-line: no-console tslint:disable-next-line: prefer-template
    console.log('processing path: ' + path);
  }
}

if (!module.parent) {
  // Called from the commandline
  const path = process.argv.slice(2);
  if (!path.length) {
    // tslint:disable-next-line: no-console
    console.log('Please provide a path to an input file!');
  } else {
    const serapay = new Serapay();
    serapay.process(path[0]);
  }
}

export default Serapay;
