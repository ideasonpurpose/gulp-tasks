const del = require("del");
const chalk = require("chalk");
const log = require("fancy-log");

const defaults = {
  target: "dist",
  debug: false
};

const create = opts => {
  const { target, debug } = { ...defaults, ...opts };

  function gulpClean() {
    return del(target).then(paths => {
      paths.forEach(path => {
        if (debug) {
          log(`Removed ${chalk.blue(path)}`);
        }
      });
    });
  }
  gulpClean.displayName = "clean";
  gulpClean.description = "Clean destinations";

  return gulpClean;
};

module.exports.create = create;
