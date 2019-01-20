const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const bs = require("browser-sync");
const browserSync = bs.has(process.env.npm_package_name)
  ? bs.get(process.env.npm_package_name)
  : bs.create();

// const debug = require("gulp-debug");

const prodPlugins = [
  imagemin.gifsicle({ optimizationLevel: 3 }),
  imagemin.optipng({ optimizationLevel: 5 }),
  imageminMozjpeg({ quality: 80 }),
  imagemin.svgo({
    floatPrecision: 3,
    plugins: [
      // {mergePaths: true},
      { cleanupIDs: false },
      { convertTransform: true },
      { removeTitle: true },
      { sortAttrs: true }
    ]
  })
];

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

const defaults = {
  src: "src/images/**/*",
  srcOptions: {},
  dest: "dist/images",
  plugins: process.env.NODE_ENV === "production" ? prodPlugins : devPlugins,
  gulp
};

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
  const { src, srcOptions, dest, plugins, gulp } = { ...defaults, ...opts };

  function gulpImagemin() {
    if (!!srcOptions.since) {
      srcOptions.since = gulp.lastRun(gulpImagemin);
    }

    return (
      gulp
        .src(src, srcOptions)
        // .pipe(debug())
        .pipe(
          imagemin(plugins, {
            verbose: process.env.NODE_ENV === "production"
          })
        )
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream())
    );
  }
  gulpImagemin.displayName = "imagemin";
  gulpImagemin.description = "Compress images with ImageMin";

  // TODO: Worried, is this too much magic?
  // Use a factory function to return a configured Gulp.watch task
  gulpImagemin.watch = () => gulp.watch(src, { cwd: srcOptions.cwd }, gulpImagemin);

  // use the spread operator to apply arguments to gulp.watch()
  // gulpImagemin.watch = [src, { cwd: srcOptions.cwd }, gulpImagemin];

  return gulpImagemin;
};

module.exports.create = create;
