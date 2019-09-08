
// tslint:disable-next-line: import-name
import Config from './config';

// export * from './config';

const config = new Config();

config.cashIn()
  .then((res) => {
    // tslint:disable-next-line: no-console
    console.log(res);
    // tslint:disable-next-line: align
  }, (error) => {
    // tslint:disable-next-line: no-console
    console.log(error);
  });

// // tslint:disable-next-line: no-console
// console.log('Hello Serapay!');

// program
//   .description(description)
//   .version(version, '-v, - version')
//   .parse(process.argv);

// if (!process.argv.slice(2).length) {
//   program.outputHelp();
// }
