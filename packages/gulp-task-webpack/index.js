const gulp = require("gulp");

const webpack = require("webpack");
const { once } = require("lodash");

const bs = require("browser-sync");
const browserSync = bs.has(process.env.npm_package_name)
  ? bs.get(process.env.npm_package_name)
  : bs.create();

const webpack_config = require("./webpack.config.js");

const defaults = {
  src: "src/images/**/*",
  srcOptions: {},
  dest: "dist/images",
  config: webpack_config,
  gulp
};

const create = opts => {
  const { src, srcOptions, dest, config, gulp } = { ...defaults, ...opts };

  // if (config === string) {
  //   load config from string
  // }

  webpack_config.mode =
    process.env.NODE_ENV == "production" ? "production" : "development";
  if (webpack_config.mode == "development") {
    webpack_config.performance.hints = false;
  }
  const compiler = webpack(webpack_config);

  function gulpWebpack(callback) {
    const isWatch = process.argv.includes("watch");
    let cb = once(callback);

    if (isWatch) {
      compiler.watch({ aggregateTimeout: 300, poll: 500 }, (err, stats) => {
        if (err) {
          // TODO: Why are there two here? does the shape of the error change?
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          return;
        }
        log(stats.toString({ colors: true }));

        cb();

        const assets = stats
          .toJson()
          .assets.map(c => c.name)
          .filter(c => c.slice(-4) !== ".map");
        browserSync.reload(assets);
      });
    } else {
      compiler.run(function(err, stats) {
        if (err) console.error(err);
        log(stats.toString({ colors: true }));
        callback();
      });
    }
  }

  gulpWebpack.displayName = "webpack";
  gulpWebpack.description = "Compile JavaScript with webpack";

  // TODO: Worried, is this too much magic?
  // Use a factory function to return a configured Gulp.watch task
  gulpWebpack.watch = () =>
    gulp.watch(src, { cwd: srcOptions.cwd }, gulpWebpack);

  // use the spread operator to apply arguments to gulp.watch()
  // gulpWebpack.watch = [src, { cwd: srcOptions.cwd }, gulpWebpack];

  return gulpWebpack;
};

module.exports.create = create;
