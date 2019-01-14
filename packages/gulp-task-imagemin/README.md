![npm](https://img.shields.io/npm/v/@ideasonpurpose/gulp-task-imagemin.svg)
[![dependencies Status](https://david-dm.org/ideasonpurpose/gulp-tasks/status.svg?path=packages/gulp-task-imagemin)](https://david-dm.org/ideasonpurpose/gulp-tasks?path=packages/gulp-task-imagemin)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Installation

```
$ yarn add @ideasonpurpose/gulp-task-imagemin

  or

$ npm install @ideasonpurpose/gulp-task-imagemin
```

## Usage

This module is a factory function which returns a pre-configured task for gulp 4. This helps simplify gulpfiles down to little more than configuration, with boilerplate tasks like this one imported just like any other npm module.

### Basic

Call the `create` method directly on the import. In many cases, just trust the defaults and go:

```js
const imagemin = require("@ideasonpurpose/gulp-task-imagemin").create();

// Call the task as a watch action
const watch = () => {
  gulp.watch("src/images/**/*", imagemin);
};

// Export to make the task public
exports.imagemin = imagemin;
```

### Options

The `create` method accepts one configuration object. This module accepts four properties:

- **src**  
  A glob string or array of glob-strings. Defaults to `src/images/**/*`
  _Passed directly to `gulp.src`_

- **srcOptions**  
  An object containing any [options][srcoptions] recognized by [gulp.src][] string or array of glob-strings. All options are passed directly to `gulp-src` except for `since`.

  - **srcOptions.since**  
    To use incremental builds, set the value of `since` to `true`. This will be replaced with `gulp.lastRun` in the generated function. (The `gulp` instance will also need to be included, see **gulp** below)

- **dest**  
  The output path to be passed to `gulp.dest` Defaults to `dist/images`
  _Passed directly to `gulp.dest`_

- **plugins**  
  An array of plugins to pass to [gulp-imagemin][]. This array completely replaces the default set and should include a plugin for each file format to be processed. See **plugins** below for defaults.  
  _Passed directly to `gulp-imagemin`_

- **gulp**
  The current gulp instance. Required when `srcOptions.since` is `true`

#### Incremental Builds

If `srcOptions` includes `since: true`, a `gulp` instance must be passed into the task for the incremental build checks to work correctly. Something like this:

```js
const imagemin = require("@ideasonpurpose/gulp-task-imagemin").create({
  src: "src/images/**/*",
  srcOptions: { since: true },
  dest: "./dist/images",
  gulp // or `gulp: gulp`, same thing.
});
```

Incremental builds may prevent new files from being processed. If the file's modification date is before the tasks's last-run timestamp, the new file will not be processed. Either restart the watch or `touch` the files to be added.

### Plugins

Tasks created by this plugin include a two sets of imagemin plugins which are selected based on the value of the `NODE_ENV` environment variable. Plugins can also be customized.

#### Default development plugins

The development plugins put processing speed before compression or filesize.

```js
const devPlugins = [
  imagemin.gifsicle({ optimizationLevel: 1 }),
  imagemin.optipng({ optimizationLevel: 0 }),
  imagemin.jpegtran({ progressive: true }),
  imagemin.svgo({
    js2svg: { pretty: true },
    floatPrecision: 3,
    plugins: [
      { cleanupIDs: false },
      { convertTransform: true },
      { removeTitle: true },
      { sortAttrs: true }
    ]
  })
];
```

#### Default Production Plugins

The production plugins trade speed for filesize, compression and image quality. This set of plugins will be used when no custom plugins are defined and `process.env.NODE_ENV === "production"`.

```js
const prodPlugins = [
  imagemin.gifsicle({ optimizationLevel: 3 }),
  imagemin.optipng({ optimizationLevel: 5 }),
  imageminMozjpeg({ quality: 80 }),
  imagemin.svgo({
    floatPrecision: 3,
    plugins: [
      { cleanupIDs: false },
      { convertTransform: true },
      { removeTitle: true },
      { sortAttrs: true }
    ]
  })
];
```

#### Custom plugins

While the default plugins work very well in most cases, the plugins array can also be customized. Specifying a custom set of plugins overrides all defaults including the `NODE_ENV` environment check.

### Watch helper

Very frequently, gulp `watch` globs are identical to the source globs for a given task. To reduce repetition, the generated task includes a helper method which calls `gulp.watch` with default arguments. This makes writing watch tasks very concise and easy to maintain.

```js
const imagemin = require("@ideasonpurpose/gulp-task-imagemin").create({ gulp });

const watch = () => {
  imagemin.watch(); // calls `gulp.watch(src, {cwd: srcOptions.cwd}, imagemin)`
};
```

[gulp.src]: https://gulpjs.com/docs/en/api/src
[srcoptions]: https://gulpjs.com/docs/en/api/src#options
[gulp-imagemin]: https://github.com/sindresorhus/gulp-imagemin
