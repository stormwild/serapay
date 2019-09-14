import fs from 'fs';
// tslint:disable-next-line: import-name
import Config, { IConfig } from './config';
// tslint:disable-next-line: import-name
import Serapay from './serapay';

const runner = (path: string) => {
  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) throw err;
    const config: IConfig = await new Config().getConfig();
    const serapay: Serapay = new Serapay();
    const commissions: number[] = serapay.getCommissions(data, config);
    // tslint:disable-next-line: no-console
    commissions.forEach(c => console.log(c.toFixed(2)));
  });
};

if (!module.parent) {
  // Called from the commandline
  const path = process.argv.slice(2);
  if (!path.length) {
    // tslint:disable-next-line: no-console
    console.log('Please provide a path to an input file!');
  } else {
    runner(path[0]);
  }
}

export default runner;
