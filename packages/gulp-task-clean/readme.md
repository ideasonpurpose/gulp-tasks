![](https://img.shields.io/npm/v/@ideasonpurpose/gulp-task-clean.svg)
[![dependencies Status](https://david-dm.org/ideasonpurpose/gulp-tasks/status.svg?path=packages/gulp-task-clean)](https://david-dm.org/ideasonpurpose/gulp-tasks?path=packages/gulp-task-clean)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Gulp Task: Clean

Create a very simple pre-configured Gulp 4 task to remove files. Most often used to clear generated artifacts before starting a new build.

## Installation

```
$ yarn add @ideasonpurpose/gulp-task-clean

  or

$ npm install @ideasonpurpose/gulp-task-clean
```

## Usage

### Basic

Call the `create` method directly on the import. In most cases, just trust the defaults and go:

```js
const clean = require("@ideasonpurpose/gulp-task-clean").create();

// Export to make the task publicly callable
exports.clean = clean;
```

### Custom options

The `create` method accepts one configuration object. This module accepts one property:

- **target**  
  A glob string or array of glob-strings. Defaults to `dist`
  _Passed directly to `del`_

### Example use

An example which cleans both the `dist` directory and all `*.zip` files from `snapshots` before running a build task might look like this:

```js
const gulp = require("gulp");
const clean = require("@ideasonpurpose/gulp-task-clean").create({
  target: ["dist", "snapshots/**/*.zip"]
});

// Run this in series as part of a pipeline and only the one build task
exports.build = gulp.series(clean, gulp.parallel(styles, imaagemin));
```
