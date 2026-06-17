// Karma config for the Angular playground.
//
// The @angular/build:karma builder injects its own asset-middleware + polyfills
// plugins, but once a karmaConfig file is supplied it stops providing the
// built-in framework/launcher plugins — so we register them here, resolved from
// the workspace root exactly as the builder does internally.
//
// Why this file exists: the default Angular karma scaffold enables the
// `karma-jasmine-html-reporter` (kjhtml), whose debug page keeps the headless
// Chrome tab alive after the run finishes. On Windows that prevents karma from
// closing the browser cleanly and the single-run exits with a spurious
// "Disconnected ... transport close" error even though every spec passed.
// Dropping kjhtml (it is only useful in interactive watch mode) lets the
// headless browser shut down cleanly. The hardened Chrome flags additionally
// avoid GPU/shm crashes while rendering the full <tulpar-shell> (Shadow DOM +
// web components) under the test harness.
const { createRequire } = require('node:module');
const path = require('node:path');

const workspaceRoot = path.join(__dirname, '..', '..');
const workspaceRequire = createRequire(workspaceRoot + '/');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: ['karma-jasmine', 'karma-chrome-launcher'].map((p) => workspaceRequire(p)),
    reporters: ['progress'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--headless=new',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
        ],
      },
    },
    browserDisconnectTolerance: 2,
    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 30000,
    pingTimeout: 20000,
    restartOnFileChange: false,
  });
};
