// tslint:disable-next-line: import-name
import Config from './config';
// tslint:disable-next-line: import-name
import Serapay from './serapay';

if (!module.parent) {
  // Called from the commandline
  const path = process.argv.slice(2);
  if (!path.length) {
    // tslint:disable-next-line: no-console
    console.log('Please provide a path to an input file!');
  } else {
    const serapay = new Serapay(new Config());
    serapay.start(path[0]);
  }
}
