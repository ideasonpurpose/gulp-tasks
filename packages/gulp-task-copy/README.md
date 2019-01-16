![npm](https://img.shields.io/npm/v/@ideasonpurpose/gulp-task-copy.svg)
[![dependencies Status](https://david-dm.org/ideasonpurpose/gulp-tasks/status.svg?path=packages/gulp-task-copy)](https://david-dm.org/ideasonpurpose/gulp-tasks?path=packages/gulp-task-copy)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Installation

```
$ yarn add @ideasonpurpose/gulp-task-copy

  or

$ npm install @ideasonpurpose/gulp-task-copy
```

## Usage

This module is a factory function which returns a pre-configured copy task for gulp 4.

### Basic

Call the `create` method directly on the import. In most cases, just trust the defaults and go:

```js
// Call `create` on the require to initialize a new task
const copy = require("@ideasonpurpose/gulp-task-copy").create();

// Export to make the task publicly callable
exports.copy = copy;
```

### Options

```js
const defaults = {
  src: ["**/*", "!webpack.config.js", "!{images,js,sass}/**/*"],
  srcOptions: { cwd: "./src", nodir: true },
  dest: "./dist"
};
```

The `create` method accepts one configuration object. This module accepts four properties:

- **src**  
  A glob string or array of glob-strings. Defaults to `["**/*", "!webpack.config.js", "!{images,js,sass}/**/*"`
  _Passed directly to `gulp.src`_

- **srcOptions**  
  An object containing any [options][srcoptions] recognized by [gulp.src][] string or array of glob-strings. Defaults to `{ cwd: "./src", nodir: true }`. All options are passed directly to `gulp-src` except for `since`.

  - **srcOptions.since**  
    To use incremental builds, set the value of `since` to `true`. This will be replaced with `gulp.lastRun` in the generated function. (The `gulp` instance will also need to be included, see **gulp** below)

- **dest**  
  The output path to be passed to `gulp.dest` Defaults to `dist`
  _Passed directly to `gulp.dest`_

- **gulp**  
  The current gulp instance. Required when `srcOptions.since` is `true` or when using the `watch` helper method.

#### Incremental Builds

If `srcOptions` includes `since: true`, a `gulp` instance must be passed into the task for the incremental build checks to work correctly. Something like this:

```js
const copy = require("@ideasonpurpose/gulp-task-copy").create({
  src: ["**/*", "!webpack.config.js", "!{images,js,sass}/**/*"],
  srcOptions: { since: true },
  dest: "dist",
  gulp // or `gulp: gulp`, same thing.
});
```

Incremental builds may prevent newly added files from being processed. If the modification dates of the new files are before the task's last-run timestamp, the new files will not be processed. Either restart the watch or `touch` the files to be added.

### Watch helper

Very frequently, gulp `watch` globs are identical to the source globs for a given task. To reduce repetition, the generated task includes a helper method which calls `gulp.watch` with default arguments. This makes writing watch tasks very concise and easy to maintain.

```js
const copy = require("@ideasonpurpose/gulp-task-copy").create({ gulp });

const watch = () => {
  copy.watch(); // calls `gulp.watch(src, {cwd: srcOptions.cwd}, copy)`
};
```

[gulp.src]: https://gulpjs.com/docs/en/api/src
[srcoptions]: https://gulpjs.com/docs/en/api/src#options
