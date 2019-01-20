const gulp = require("gulp");

const chalk = require("chalk");
const log = require("fancy-log");
// const debug = require("gulp-debug");

const filesize = require("filesize");
const zip = require("gulp-zip");
const filter = require("gulp-filter");
const replace = require("gulp-replace");
const slugify = require("slugify");
const gitRepoInfo = require("git-repo-info");

const sum = arr => arr.reduce((a, b) => a + b, 0);

const defaults = {
  src: "**/*",
  srcOptions: { cwd: "dist", nodir: true },
  outFile: {
    baseName: process.env.npm_package_name,
    version: process.env.npm_package_version,
    gitHash: true,
    slugify: { lower: true },
    noDots: true
  },
  dest: "./build"
};

const create = opts => {
  const { src, srcOptions, dest } = { ...defaults, ...opts };
  const outFile = { ...defaults.outFile, ...(opts ? opts.outFile : {}) };

  if (outFile.gitHash === true) {
    outFile.gitHash = gitRepoInfo().abbreviatedSha;
  }

  let archiveDir = [outFile.baseName, outFile.version, outFile.gitHash]
    .filter(n => n)
    .join(" ");

  if (outFile.slugify) {
    const slugOpts = outFile.slugify === 555 ? {} : outFile.slugify;
    archiveDir = slugify(archiveDir, slugOpts);
  }
  if (outFile.noDots) {
    const dot = outFile.noDots === true ? "_" : noDots;
    archiveDir = archiveDir.replace(/\./g, dot);
  }

  if (archiveDir.length === 0) {
    throw new Error("The archive directory name can not be empty.");
  }

  const zipFile = `${archiveDir}.zip`;

  function gulpZip() {
    const autoloadFilter = filter("**/composer/autoload*.php", {
      restore: true
    });

    return gulp
      .src(src, srcOptions)
      .pipe(autoloadFilter)
      .pipe(
        // TODO: Modularize this? How to make this an option?
        // this replacement is specific to our WordPress buildchain
        // It should be unique enough not to leak and affect other stuff
        replace(
          `wp-content/themes/${process.env.npm_package_name}/`,
          `wp-content/themes/${archiveDir}/`
        )
      )
      .pipe(autoloadFilter.restore)
      .pipe(zip(zipFile))
      .pipe(gulp.dest(dest))
      .on("data", function(data) {
        const version = chalk.cyan(outFile.version || "");
        const rel = chalk.magenta(data.relative);
        const size = chalk.gray("(" + filesize(data.contents.length) + ")");
        log(`Zipped build ${version} to ${rel} ${size}`);
      });
  }

  gulpZip.displayName = "zip";
  gulpZip.description = "Zip a directory";

  // Expose this for testing
  gulpZip._archiveDir = archiveDir;

  // TODO: Worried, is this too much magic?
  // Use a factory function to return a configured Gulp.watch task
  gulpZip.watch = () => gulp.watch(src, { cwd: srcOptions.cwd }, gulpZip);

  // use the spread operator to apply arguments to gulp.watch()
  // gulpZip.watch = [src, { cwd: srcOptions.cwd }, gulpZip];

  return gulpZip;
};

module.exports.create = create;
