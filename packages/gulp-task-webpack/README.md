![](https://img.shields.io/npm/v/@ideasonpurpose/gulp-task-webpack.svg)
[![dependencies Status](https://david-dm.org/ideasonpurpose/gulp-tasks/status.svg?path=packages/gulp-task-webpack)](https://david-dm.org/ideasonpurpose/gulp-tasks?path=packages/gulp-task-webpack)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Gulp Task: Webpack

Create a pre-configured Gulp 4 task which starts a webpack compiler.

## Installation

```
$ yarn add @ideasonpurpose/gulp-task-webpack

  or

$ npm install @ideasonpurpose/gulp-task-webpack
```

## Usage

Call the `create` method directly on the import. In most cases, just trust the defaults and go:

```js
// Call `create` on the require to initialize a new task
const zip = require("@ideasonpurpose/gulp-task-webpack").create();

// Export to make the task publicly callable
exports.zip = zip;
```

Or configure the task:

```js
// Set the archive name and change the output location
const zip = require("@ideasonpurpose/gulp-task-zip").create({
  dest: "build-snapshots",
  outFile: {
    baseName: "archive",
    gitHash: false
  }
});

// output file will be something like `build-snapshots/archive-1.0.4.zip`
```

## API

### gulpTaskZip.create([options])

The `create` method accepts one configuration object with the following properties:

#### src

Type: `String` or `Array`  
Default: `dest/**/*`

A glob string or array of glob-strings. _Passed directly to `gulp.src`_

#### srcOptions

Type: `Object`  
Default: `{ cwd: "dist", nodir: true }`

An object containing any [options][srcoptions] recognized by [gulp.src][]. _Passed directly to `gulp.src`_

#### dest

Type: `String`  
Default: `"./build"`

The output path. _Passed directly to `gulp.dest`_

#### outFile

Type: `Object`  
Default: _see below_

This object configures the filename of the archive.

The filename of the generated archive is composed from the three `outfile` properties, `baseName`, `version` and `gitHash`, then passed through [slugify][]. Components appear in order, for example:

```
// basename-version-gitHash.zip
project-name-1_0_3-222c740f3f.zip
```

##### outFile.baseName

Type: `String`  
Default: value of `process.env.npm_package_name`

The first part of the output archive's filename.

##### outFile.version

Type: `String`  
Default: value of `process.env.npm_package_version`

The current version from the project's package.json file. Appears second

##### outFile.gitHash

Type: `Boolean`  
Default: value of`process.env.npm_package_version`

##### outFile.slugify

Type: `Boolean`, `String` or `Object`  
Default `{lower: true}`

Options for applying [slugify][] to the output file name. _Passed directly to [`slugify`][slugify]_

##### outFile.noDots

Type: `Boolean` or `String`  
Default: `True` (same as `_`)

Replaces all dots in the output filename. If `true`, dots are replaced with an underscore. If a `String`, then the string-value will be used as the replacement. Some decompression tools have issues with extra dots before the `.zip` extension.

## License

ISC © [Ideas On Purpose](https://www.ideasonpurpose.com)

[gulp.src]: https://gulpjs.com/docs/en/api/src
[srcoptions]: https://gulpjs.com/docs/en/api/src#options
[slugify]: https://www.npmjs.com/package/slugify
