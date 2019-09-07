# serapay

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

Created `src` and `tests` directory

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
