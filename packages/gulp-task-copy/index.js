const gulp = require("gulp");

const chalk = require("chalk");
const log = require("fancy-log");
// const debug = require("gulp-debug");

const filesize = require("filesize");
const sum = arr => arr.reduce((a, b) => a + b, 0);

const defaults = {
  src: ["**/*", "!webpack.config.js", "!{images,js,sass}/**/*"],
  srcOptions: { cwd: "./src", nodir: true },
  dest: "./dist"
};

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

  const { src, srcOptions, dest } = { ...defaults, ...opts };
  function gulpCopy() {
    const filesizes = [];
    return gulp
      .src(src, srcOptions)
      .on("data", data => filesizes.push(data.contents.length))
      .pipe(gulp.dest(dest))
      .on("end", () => {
        const total = chalk.magenta(`${filesize(sum(filesizes))}`);
        log(
          `Copied ${chalk.magenta(filesizes.length)} files totaling ${total}`
        );
      });
  }

  gulpCopy.displayName = "copy";
  gulpCopy.description = "Copy static files";

  // TODO: Worried, is this too much magic?
  // Use a factory function to retjurn a configured Gulp.watch task
  gulpCopy.watch = () => gulp.watch(src, { cwd: srcOptions.cwd }, gulpCopy);

  // use the spread operator to apply arguments to gulp.watch()
  // gulpCopy.watch = [src, { cwd: srcOptions.cwd }, gulpCopy];

  return gulpCopy;
};

module.exports.create = create;
