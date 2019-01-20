# Gulp Tasks

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This monorepo contains a collection of gulp tasks commonly used in projects at [Ideas On Purpose][iop]. See the `packages` directory for a listing of tasks. Each package has it's own README file.

These tasks have grown out of several years using gulp. Composition of tasks became much simpler with the release of Gulp 4 so we began the process of extracting our common tasks into a library of resuable modules.

## About tasks

All packages export a factory function which returns a pre-configured Gulp 4 task. This allows us to simplify a project's gulpfile down to just configuration, with boilerplate tasks imported just like any other npm module.

### Tasks

- [@ideasonpurpose/gulp-task-clean](https://www.npmjs.com/package/@ideasonpurpose/gulp-task-clean)
- [@ideasonpurpose/gulp-task-copy](https://www.npmjs.com/package/@ideasonpurpose/gulp-task-copy)
- [@ideasonpurpose/gulp-task-imagemin](https://www.npmjs.com/package/@ideasonpurpose/gulp-task-imagemin)
- [@ideasonpurpose/gulp-task-styles](https://www.npmjs.com/package/@ideasonpurpose/gulp-task-styles)
- [@ideasonpurpose/gulp-task-zip](https://www.npmjs.com/package/@ideasonpurpose/gulp-task-zip)

[iop]: https://www.ideasonpurpose.com
