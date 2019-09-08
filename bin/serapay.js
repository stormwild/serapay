#!/usr/bin/env node

const program = require('commander');
const { description, version } = require('../package.json');

program
  .description(description)
  .version(version, '-v, - version')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
