const gulp = require("gulp");

const chalk = require("chalk");
const log = require("fancy-log");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const postCssImport = require("postcss-import");
const cssnano = require("cssnano");

// const debug = require("gulp-debug");

const bs = require("browser-sync");
const browserSync = bs.has(process.env.npm_package_name)
  ? bs.get(process.env.npm_package_name)
  : bs.create();

const defaults = {
  src: "src/sass/**/*.scss",
  srcOptions: {},
  dest: "dist/images",
  sassConfig: {
    includePaths: ["node_modules"],
    sourceComments: true,
    outputStyle: "expanded"
  },
  postcssPlugins: [autoprefixer({ grid: true }), postCssImport()],
  gulp
};
if (process.env.NODE_ENV == "production") {
  defaults.postcssPlugins.push(cssnano());
}

// TODO: break this out too? repeating in quite a few of these
const gulpSinceCheck = opts => {
  if (
    opts &&
    opts.srcOptions &&
    opts.srcOptions.since === true &&
    opts.gulp === undefined
  ) {
    throw Error(
      "For caching to work correctly, the gulp instance must be included in options when `srcOptions.since` is true."
    );
  }
};

const create = opts => {
  gulpSinceCheck(opts);
  const { src, srcOptions, dest, sassConfig, postcssPlugins, gulp } = {
    ...defaults,
    ...opts
  };

  function gulpSass() {
    if (!!srcOptions.since) {
      srcOptions.since = gulp.lastRun(gulpSass);
    }

    return (
      gulp
        .src(src, srcOptions)
        // .pipe(debug())
        .pipe(
          sass(sassConfig)
            .on("error", function(err) {
              browserSync.sockets.emit("fullscreen:message", {
                title: `Sass Error: ${err.relativePath}:${err.line}:${
                  err.column
                }`,
                body: err.message,
                timeout: 10000
              });
              sass.logError.bind(this)(err);
            })
            .on("data", function(data) {
              log("Sass: compiled", chalk.magenta(data.relative));
            })
        )
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream())
    );
  }

  gulpSass.displayName = "styles";
  gulpSass.description = "Compress images with ImageMin";

  // TODO: Worried, is this too much magic?
  // Use a factory function to return a configured Gulp.watch task
  gulpSass.watch = () => gulp.watch(src, { cwd: srcOptions.cwd }, gulpSass);

  // use the spread operator to apply arguments to gulp.watch()
  // gulpSass.watch = [src, { cwd: srcOptions.cwd }, gulpSass];

  return gulpSass;
};
module.exports.create = create;
