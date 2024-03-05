"use strict";

const {
  SAUCE_USERNAME,
  SAUCE_ACCESS_KEY,
  GITHUB_RUN_NUMBER,
  GITHUB_EVENT_NAME,
} = process.env;

const browserslist = require("browserslist");
const FIREFOX_ESR_VERSION =
  Number.parseInt(
    browserslist("Firefox ESR")[0].replace(/^firefox\s+([\d.]+)$/i, "$1"),
  ) + "";

/** @type {import("nightwatch").NightwatchOptions} */
module.exports = {
  src_folders: "test/browser",
  output_folder: "test_report",
  plugins: ["nightwatch-saucelabs-endsauce"],

  test_settings: {
    default: {
      use_ssl: true,
      silent: true,

      selenium: {
        host: "ondemand.saucelabs.com",
        port: 443,
        start_process: false,
      },

      request_timeout_options: {
        timeout: 60000,
        retry_attempts: 5,
      },

      desiredCapabilities: {
        javascriptEnabled: true,
        acceptSslCerts: true,

        // SauceLabs options
        "sauce:options" : {
          username: SAUCE_USERNAME,
          accessKey: SAUCE_ACCESS_KEY,
          extendedDebugging: true,
          build: GITHUB_EVENT_NAME === "push"
            ? `build-${GITHUB_RUN_NUMBER}`
            : undefined,
          public: "public",
        },
      },
    },

    chrome: {
      desiredCapabilities: {
        browserName: "chrome",
        browserVersion: "latest",
        platformName: "windows",
      },
    },

    chrome_old: {
      desiredCapabilities: {
        browserName: "chrome",
        browserVersion: "latest-1",
        platformName: "windows",
      },
    },

    firefox: {
      desiredCapabilities: {
        browserName: "firefox",
        browserVersion: "latest",
      },
    },

    firefox_old: {
      desiredCapabilities: {
        browserName: "firefox",
        browserVersion: "latest-1",
      },
    },

    firefox_esr: {
      desiredCapabilities: {
        browserName: "firefox",
        browserVersion: FIREFOX_ESR_VERSION,
      },
    },

    safari: {
      desiredCapabilities: {
        browserName: "safari",
        browserVersion: "latest",
      },
    },

    safari_old: {
      desiredCapabilities: {
        browserName: "safari",
        browserVersion: "latest-1",
      },
    },
  },
};
