const browserslist = require("browserslist");

const FIREFOX_ESR_VERSION = `${Number.parseInt(browserslist("Firefox ESR")[0].replace(/^firefox\s+([\d.]+)$/i, "$1"))}.0`;
const { SAUCE_USERNAME, SAUCE_ACCESS_KEY, GITHUB_RUN_NUMBER, GITHUB_EVENT_NAME } = process.env;

module.exports = {
    src_folders: "test/browser",
    output_folder: "test_report",
    custom_commands_path: "./node_modules/nightwatch-saucelabs-endsauce/commands",

    test_settings: {
        default: {
            username: SAUCE_USERNAME,
            access_key: SAUCE_ACCESS_KEY,
            sauce_region: "us-west-1",
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
                "tunnel-identifier": "github-action-tunnel",
                build: GITHUB_EVENT_NAME === "push" ? `build-${ GITHUB_RUN_NUMBER }` : undefined,
            },
        },

        chrome: {
            desiredCapabilities: {
                browserName: "chrome",
                version: "latest",
            },
        },

        chrome_old: {
            desiredCapabilities: {
                browserName: "chrome",
                version: "latest-1",
            },
        },

        firefox: {
            desiredCapabilities: {
                browserName: "firefox",
                version: "latest",
            },
        },

        firefox_old: {
            desiredCapabilities: {
                browserName: "firefox",
                version: "latest-1",
            },
        },

        firefox_esr: {
            desiredCapabilities: {
                browserName: "firefox",
                version: FIREFOX_ESR_VERSION,
            },
        },

        edge: {
            desiredCapabilities: {
                browserName: "MicrosoftEdge",
                version: "latest",
            },
        },

        edge_old: {
            desiredCapabilities: {
                browserName: "MicrosoftEdge",
                version: "latest-1",
            },
        },

        safari: {
            desiredCapabilities: {
                browserName: "safari",
                version: "latest",
            },
        },

        safari_old: {
            desiredCapabilities: {
                browserName: "safari",
                version: "latest-1",
            },
        },
    },
};
