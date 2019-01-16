![](https://img.shields.io/npm/v/@ideasonpurpose/gulp-task-styles.svg)
[![dependencies Status](https://david-dm.org/ideasonpurpose/gulp-tasks/status.svg?path=packages/gulp-task-styles)](https://david-dm.org/ideasonpurpose/gulp-tasks?path=packages/gulp-task-styles)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Gulp Task: Styles

Create pre-configured Gulp 4 tasks using Sass and PostCSS to generate CSS stylesheets.

## Installation

```
$ yarn add @ideasonpurpose/gulp-task-styles

  or

$ npm install @ideasonpurpose/gulp-task-styles
```

## Usage

### Basic

Call the `create` method directly on the import. In most cases, just trust the defaults and go:

```js
// Call `create` on the require to initialize a new task
const sass = require("@ideasonpurpose/gulp-task-styles").create();

// Export to make the task publicly callable
exports.sass = sass;
```

### Custom options

The `create` method accepts one configuration object. This module accepts four properties:

- **src**  
  A glob string or array of glob-strings. Defaults to `src/sass/**/*`
  _Passed directly to `gulp.src`_

- **srcOptions**  
  An object containing any [options][srcoptions] recognized by [gulp.src][] string or array of glob-strings. All options are passed directly to `gulp-src` except for `since`.

  - **srcOptions.since**  
    To use incremental builds, set the value of `since` to `true`. This will be replaced with `gulp.lastRun` in the generated function. (The `gulp` instance will also need to be included, see **gulp** below)

- **dest**  
  The output path to be passed to `gulp.dest` Defaults to `dist/css`
  _Passed directly to `gulp.dest`_

- **sassConfig**  
  A Sass configuration object of settings to pass to [gulp-sass][] (and then to [node-sass][]). See [**Sass Config**](#sass-config) below for default settings.
  _Passed directly to `gulp-sass`_

- **postcssPlugins**  
  An array of plugins to pass to [gulp-postcss][]. This array completely replaces the default set of plugins. See [**PostCSS Options**](#postcss-options) below for defaults.  
  _Passed directly to `gulp-postcss`_

- **gulp**  
  The current gulp instance. Required when `srcOptions.since` is `true`

### Sass Config

The generated task uses a well-tested set of default Sass settings:

```js
{
  sassConfig: {
    includePaths: ["node_modules"],
    sourceComments: true,
    outputStyle: "expanded"
  }
};
```

These settings can be overridden by adding a `sassOptions` key to the configuration object passed to `create`. Custom settings will be merged with the Sass defaults.

### PostCSS Options

The generated task adds a well-tested default set of PostCSS transformations: [autoprefixer][] and [postcss-import][] and, if `NODE_ENV` is set to `production`, [cssnano][] for minification and optimization.

```js
{
  postCssPlugins: [
    autoprefixer({ grid: "no-autoplace" }),
    postCssImport(),
    cssnano() // if (NODE_ENV === "production")
  ];
}
```

As with `sassOptions`, these settings can be overidden by setting `postcssOptions` to a new array of plugins. Specifying custom plugins overwrites all defaults postcss plugins including the `NODE_ENV` environment check.

#### What about Less?

We don't use it. Pull requests are welcome.

### Browserslist

The CSS pipeline uses browserslist definiitons when available. We recommend including a `.browserslistrc` file in the project root. The task optimizes and minifies the resulting CSS when `NODE_ENV` is set to `production`.

### Watch helper

Very frequently, gulp `watch` globs are identical to the source globs for a given task. To reduce repetition, the generated task includes a helper method which calls `gulp.watch` with default arguments. This makes writing watch tasks very concise and easy to maintain.

For Gulp logging to work correctly withe the watch helper method, the gulp instance must be passed to the create call.

```js
const styles = require("@ideasonpurpose/gulp-task-styles").create({ gulp });

const watch = () => {
  styles.watch(); // calls `gulp.watch(src, {cwd: srcOptions.cwd}, styles)`
};
```

[browserslist]: https://github.com/browserslist/browserslist
[cssnano]: https://cssnano.co/
[autoprefixer]: https://github.com/postcss/autoprefixer
[postcss-import]: https://github.com/postcss/postcss-import
[gulp-sass]: https://github.com/dlmanning/gulp-sass
[node-sass]: https://github.com/sass/node-sass
[gulp-postcss]: https://github.com/postcss/gulp-postcss
