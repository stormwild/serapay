#!/usr/bin/env node

const program = require('commander');
const { description, version } = require('../package.json');
const Serapay = require('../dist/index').default;

let serapay = new Serapay();

program
  .description(description)
  .version(version)
  .arguments('<path>')
  .action(serapay.process)
  .option('-i, --input <string>', 'path to json input file', serapay.process)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
