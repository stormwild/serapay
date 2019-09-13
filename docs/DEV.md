# Notes

## Pre-requisites

For local development

- Git
- Node v10+

Tools

- Visual Studio Code

## Development Notes

Typescript code in src directory is compile using typescript compiler tsc and outputs to the dist folder

Define the build command in package.json

```json
"build": "tsc",
```

tsconfig.json is the configuration for the compiler

```

```

To run a build

```
npm run build
```

Install typescript

```bash
npm i -D typescript
```

Initialize tsconfig

```bash
npx tsc --init
```

Enable generation of type declaration

```json
"declaration": true
```

Enable `"noImplicitAny": true,`

Created `src` and `tests` and `dist` directory

Enable sourceMaps

```json
"sourceMap": true,                     /* Generates corresponding '.map' file. */
```

## Linting and Formatting

Enforce linting and code formatting for typescript.

Install tslint

```bash
npm i -D tslint
```

Generate a basic config file

```bash
# Generate a basic configuration file
npx tslint --init
```

Integrate tslint with prettier

```bash
npm i -D prettier tslint-config-prettier
```

Add AirBnB Style Guide

```bash
npm i -D tslint-config-airbnb
```

Update `tslint.json`

```json
"extends": [
  "tslint:recommended",
  "tslint-config-prettier",
  "tslint-config-airbnb"
],
```

### Dependencies

- axios

Axios Config

```js
http://private-38e18c-uzduotis.apiary-mock.com/config/
```

### API

```js
/* 
// http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in
{
  "percents": 0.03,
  "max": {
    "amount": 5,
    "currency": "EUR"
  }
}

// http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural
{
  "percents": 0.3,
  "week_limit": {
    "amount": 1000,
    "currency": "EUR"
  }
}

// http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical
{
  "percents": 0.3,
  "min": {
    "amount": 0.5,
    "currency": "EUR"
  }
}
*/
```

### Testing with Mocha Chai

```bash
npm i -D chai mocha nyc ts-node
npm i -D @types/chai @types/mocha
npm i -D chai-http @types/chai-http
```

## References

- [Enforce your team’s coding style with Prettier and TsLint](https://itnext.io/enforce-your-team-coding-style-with-prettier-and-tslint-9faac5016ce7)

- [Node Express App + TypeScript + TSLint + Prettier + Airbnb + Husky](https://medium.com/@jorgemcdev/node-express-app-typescript-tslint-prettier-airbnb-husky-c42588cbcbe3)

Tslint to be deprecated

- [How To Set Up ESLint, TypeScript, Prettier with Create React App](https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675)

- [From ESLint to TSLint and Back Again](https://codeburst.io/from-eslint-to-tslint-and-back-again-bf259c2e7437)

- [My airbnb based ESLint config for "typescript-eslint" with React & prettier](https://gist.github.com/1natsu172/a65a4b45faed2bd3fa74b24163e4256e)

Publishing npm package

- [Step by step: Building and publishing an NPM Typescript package.](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)

- [The 30-second guide to publishing a TypeScript package to NPM](https://medium.com/cameron-nokes/the-30-second-guide-to-publishing-a-typescript-package-to-npm-89d93ff7bccd)

- [How to Create and Publish an NPM module in TypeScript](https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724)

Prettier

Ignore format on save for specific files

Add a `.prettierignore`

```
tsconfig.json
```

- [Stop re-formatting package.json with Prettier and VSCode once and for all](https://medium.com/@martin_hotell/stop-re-formatting-package-json-with-prettier-and-vscode-once-and-for-all-52d283067f9a)

Testing TypeScript with Mocha Chai

```
 "test": "mocha -r ts-node/register src/**/*.spec.ts"
```

Install sinon

```bash
npm i -D sinon
npm i -D @types/sinon
```

Chai

```bash
npm i -D dirty-chai chai-as-promised
npm i -D @types/chai-as-promised
npm i -D @types/dirty-chai
```

- [Testing a TypeScript API With Mocha and Chai Image Testing a TypeScript API With Mocha and Chai](https://tutorialedge.net/typescript/testing-typescript-api-with-mocha-chai/)

- [Writing unit tests in TypeScript](https://medium.com/@RupaniChirag/writing-unit-tests-in-typescript-d4719b8a0a40)

- [11 Best JavaScript Unit Testing Framework and Tools](https://geekflare.com/javascript-unit-testing/)

API Docs

- [uzduotis](https://uzduotis.docs.apiary.io/#)

Read File

- [Read Files with Node.js](https://stackabuse.com/read-files-with-node-js/)

Round to 2 decimal places

- [Round off a number upto 2 decimal place using JavaScript](https://www.geeksforgeeks.org/round-off-a-number-upto-2-decimal-place-using-javascript/)

## Feedback

First of all, thank you for the time taken to complete the task.

We are pleased to see your expressed desire to work with us.

In regard to evaluate your skills better we would like to ask you for some improvements in your implementation.
business logic(calculation of commissions) should be tested. Now You only test configuration endpoints, what's not very useful
for example if we have such data:

```json
[
  {
    "date": "2019-01-01",
    "user_id": 1,
    "user_type": "natural",
    "type": "cash_out",
    "operation": { "amount": 200.0, "currency": "EUR" }
  },
  {
    "date": "2019-01-01",
    "user_id": 1,
    "user_type": "natural",
    "type": "cash_out",
    "operation": { "amount": 900.0, "currency": "EUR" }
  }
]
```

commissions should only be calculated from exceeded amount(same week), so output should be:

```bash
0.00
0.03
```

copy paste code should be reduced. For example, I see several places where commissions are calculated identically: `Math.ceil(result * 100) / 100`. It would be very nice that you reuse whole commissions calculation logic, because now it's pretty the same.
