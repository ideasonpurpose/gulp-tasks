const del = require("del");

const defaults = {
  target: "dist"
};

const create = opts => {
  const { target } = { ...defaults, ...opts };

  function gulpClean() {
    return del(target);
  }
  gulpClean.displayName = "clean";
  gulpClean.description = "Clean destinations";

  return gulpClean;
};

module.exports.create = create;
