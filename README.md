# serapay

Sample project or task for a job application for an online money transfer provider.

## Pre-requisites

- Git
- Node v10+
- Visual Studio Code

## Setup

Clone repository

```bash
git clone git@github.com:stormwild/serapay.git
cd serapay
```

Install dependencies and compile TypeScript files

```bash
npm i
npm run build
```

Run tests

```bash
npm test
```

Sample test output

```bash
$ npm run test

> serapay@1.0.0 test /path/to/serapay
> nyc mocha -r ts-node/register src/**/*.spec.ts



  Config class
    ✓ should make successful api calls (1599ms)
    ✓ should return ICashIn when cashIn is invoked
    ✓ should return ICashOutNatural when cashOutNatural is invoked
    ✓ should return ICashOutJuridical when cashOutJuridical is invoked


  4 passing (2s)

-----------|----------|----------|----------|----------|-------------------|
File       |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------|----------|----------|----------|----------|-------------------|
All files  |    96.43 |       60 |     87.5 |    95.45 |                   |
 config.ts |    96.43 |       60 |     87.5 |    95.45 |                40 |
-----------|----------|----------|----------|----------|-------------------|
```

## Run

Link to path

```bash
npm link
```

Run from command line

```bash
serapay
```

Sample output

```bash
$ serapaycli
Usage: serapaycli [options] <path>

Commandline tool that computes commission fees from cash transactions provided in a .json file

Options:
  -V, --version         output the version number
  -i, --input <string>  path to json input file
  -h, --help            output usage information
```

Run from build

```bash
npm start
```

Sample output

```bash
$ npm start

> serapay@1.0.0 start /Users/stormwild/Source/paysera/cliapp/serapay
> node ./dist/serapaycli.js

Please provide a path to an input file!
```

## Run with Sample Data

### Run from linked serapaycli

Build the application

```
npm i
npm run build
npm link
```

Run with the sample data. Make sure you are within the application root folder

```
serapaycli ./data/input.json
```

Output

```bash
0.06
0.90
87.00
3.00
0.30
0.30
5.00
0.00
0.00
```

### Run from dist

Build the application

```
npm run build
```

Run with sample data

```
npm run start ./data/input.json
```

Alternatively

```
node ./dist/serapaycli.js ./data/input.json
```

Output

```bash
0.06
0.90
87.00
3.00
0.30
0.30
5.00
0.00
0.00
```

## Log

### Tue 10 Sep 2019

Computation seems to be working correctly

### Sun 8 Sep 2019

- Completed unit test for Config class which wraps config api
- Started command line setup

### Sat 7 Sep 2019

- Created class as a wrapper for the commission configuration api.
