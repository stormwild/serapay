#!/usr/bin/env node
'use strict';
const program = require('commander');
const { description, version } = require('../package.json');
const runner = require('../dist/serapaycli').default;

program
  .description(description)
  .version(version)
  .arguments('<path>')
  .action(path => {
    runner(path);
  })
  .option('-i, --input <string>', 'path to json input file', path => {
    runner(path);
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
