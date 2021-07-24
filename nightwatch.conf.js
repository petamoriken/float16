const { SAUCE_USERNAME, SAUCE_ACCESS_KEY, GITHUB_RUN_NUMBER, GITHUB_REF, GITHUB_HEAD_REF } = process.env;

module.exports = {
    src_folders: "test/browser",
    output_folder: "test_report",
    custom_commands_path: "test/nightwatch_custom",

    test_settings: {
        default: {
            launch_url: "http://localhost",
            selenium_host: "ondemand.saucelabs.com",
            selenium_port: 80,

            webdriver: {
                username: SAUCE_USERNAME,
                access_key: SAUCE_ACCESS_KEY,
                default_path_prefix: "/wd/hub",
            },

            desiredCapabilities: {
                javascriptEnabled: true,
                acceptSslCerts: true,
                "tunnel-identifier": GITHUB_RUN_NUMBER,
                ...(GITHUB_REF === "refs/heads/master" && GITHUB_HEAD_REF === undefined ? { build: `build-${ GITHUB_RUN_NUMBER }` } : {}),
            },
        },

        chrome: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "chrome",
                version: "latest",
            },
        },

        chrome_old: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "chrome",
                version: "latest-1",
            },
        },

        firefox: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "firefox",
                version: "latest",
            },
        },

        firefox_old: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "firefox",
                version: "latest-1",
            },
        },

        firefox_esr: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "firefox",
                version: "68.0",
            },
        },

        edge: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "MicrosoftEdge",
                version: "latest",
            },
        },

        edge_old: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "MicrosoftEdge",
                version: "latest-1",
            },
        },

        safari: {
            desiredCapabilities: {
                platform: "macOS 10.15",
                browserName: "safari",
                version: "latest",
            },
        },

        safari_old: {
            desiredCapabilities: {
                platform: "macOS 10.14",
                browserName: "safari",
                version: "latest",
            },
        },
    },
};
